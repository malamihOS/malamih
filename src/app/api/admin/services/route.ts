import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { withAdmin, withAdminMutation, jsonError } from "@/lib/admin-route";

const serviceSchema = z.object({
  id: z.string().optional(),
  number: z.string().default(""),
  titleEn: z.string().min(1),
  titleAr: z.string().min(1),
  descriptionEn: z.string().default(""),
  descriptionAr: z.string().default(""),
  tagsEn: z.union([z.string(), z.array(z.string())]).default("[]"),
  tagsAr: z.union([z.string(), z.array(z.string())]).default("[]"),
  iconUrl: z.string().default(""),
  sortOrder: z.number().int().default(0),
  visible: z.boolean().default(true),
});

const reorderSchema = z.object({
  reorder: z.array(z.string()).min(1),
});

function normalizeTags(value: string | string[]) {
  return Array.isArray(value) ? JSON.stringify(value) : value;
}

function normalizeService(data: z.infer<typeof serviceSchema>) {
  return {
    ...data,
    tagsEn: normalizeTags(data.tagsEn),
    tagsAr: normalizeTags(data.tagsAr),
  };
}

export async function GET() {
  return withAdmin(async () => {
    const services = await prisma.service.findMany({
      orderBy: { sortOrder: "asc" },
    });
    return NextResponse.json({ services });
  });
}

export async function POST(request: Request) {
  return withAdminMutation(request, async () => {
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return jsonError("Invalid JSON body");
    }

    const parsed = serviceSchema.safeParse(body);
    if (!parsed.success) {
      return jsonError(parsed.error.issues[0]?.message ?? "Invalid input");
    }

    const { id: _id, ...data } = normalizeService(parsed.data);
    const maxOrder = await prisma.service.aggregate({ _max: { sortOrder: true } });
    const service = await prisma.service.create({
      data: {
        ...data,
        sortOrder: data.sortOrder ?? (maxOrder._max.sortOrder ?? -1) + 1,
      },
    });

    return NextResponse.json({ service }, { status: 201 });
  });
}

export async function PUT(request: Request) {
  return withAdminMutation(request, async () => {
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return jsonError("Invalid JSON body");
    }

    const reorderParsed = reorderSchema.safeParse(body);
    if (reorderParsed.success) {
      const updates = reorderParsed.data.reorder.map((id, index) =>
        prisma.service.update({ where: { id }, data: { sortOrder: index } }),
      );
      await prisma.$transaction(updates);
      const services = await prisma.service.findMany({ orderBy: { sortOrder: "asc" } });
      return NextResponse.json({ services });
    }

    const parsed = serviceSchema.extend({ id: z.string() }).safeParse(body);
    if (!parsed.success) {
      return jsonError(parsed.error.issues[0]?.message ?? "Invalid input");
    }

    const service = await prisma.service.update({
      where: { id: parsed.data.id },
      data: normalizeService(parsed.data),
    });

    return NextResponse.json({ service });
  });
}

export async function DELETE(request: Request) {
  return withAdminMutation(request, async () => {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return jsonError("Missing id parameter");
    }

    await prisma.service.delete({ where: { id } });
    return NextResponse.json({ success: true });
  });
}
