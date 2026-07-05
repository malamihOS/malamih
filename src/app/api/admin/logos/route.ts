import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { withAdmin, jsonError } from "@/lib/admin-route";

const logoSchema = z.object({
  id: z.string().optional(),
  imageUrl: z.string().min(1),
  nameEn: z.string().default(""),
  nameAr: z.string().default(""),
  link: z.string().default(""),
  sortOrder: z.number().int().default(0),
  visible: z.boolean().default(true),
});

const reorderSchema = z.object({
  reorder: z.array(z.string()).min(1),
});

export async function GET() {
  return withAdmin(async () => {
    const logos = await prisma.clientLogo.findMany({
      orderBy: { sortOrder: "asc" },
    });
    return NextResponse.json({ logos });
  });
}

export async function POST(request: Request) {
  return withAdmin(async () => {
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return jsonError("Invalid JSON body");
    }

    const parsed = logoSchema.safeParse(body);
    if (!parsed.success) {
      return jsonError(parsed.error.issues[0]?.message ?? "Invalid input");
    }

    const { id: _id, ...data } = parsed.data;
    const maxOrder = await prisma.clientLogo.aggregate({ _max: { sortOrder: true } });
    const logo = await prisma.clientLogo.create({
      data: {
        ...data,
        sortOrder: data.sortOrder ?? (maxOrder._max.sortOrder ?? -1) + 1,
      },
    });

    return NextResponse.json({ logo }, { status: 201 });
  });
}

export async function PUT(request: Request) {
  return withAdmin(async () => {
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return jsonError("Invalid JSON body");
    }

    const reorderParsed = reorderSchema.safeParse(body);
    if (reorderParsed.success) {
      const updates = reorderParsed.data.reorder.map((id, index) =>
        prisma.clientLogo.update({ where: { id }, data: { sortOrder: index } }),
      );
      await prisma.$transaction(updates);
      const logos = await prisma.clientLogo.findMany({ orderBy: { sortOrder: "asc" } });
      return NextResponse.json({ logos });
    }

    const parsed = logoSchema.extend({ id: z.string() }).safeParse(body);
    if (!parsed.success) {
      return jsonError(parsed.error.issues[0]?.message ?? "Invalid input");
    }

    const logo = await prisma.clientLogo.update({
      where: { id: parsed.data.id },
      data: parsed.data,
    });

    return NextResponse.json({ logo });
  });
}

export async function DELETE(request: Request) {
  return withAdmin(async () => {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return jsonError("Missing id parameter");
    }

    await prisma.clientLogo.delete({ where: { id } });
    return NextResponse.json({ success: true });
  });
}
