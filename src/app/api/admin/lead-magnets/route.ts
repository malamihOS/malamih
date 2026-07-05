import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { withAdmin, withAdminMutation, jsonError } from "@/lib/admin-route";

const schema = z.object({
  slug: z.string().min(1),
  titleEn: z.string().min(1),
  titleAr: z.string().min(1),
  descriptionEn: z.string().optional().default(""),
  descriptionAr: z.string().optional().default(""),
  coverImage: z.string().optional().default(""),
  fileUrl: z.string().min(1),
  relatedService: z.string().optional().default(""),
  status: z.enum(["active", "hidden"]).optional().default("active"),
  sortOrder: z.number().int().optional().default(0),
});

export async function GET() {
  return withAdmin(
    async () => {
      const magnets = await prisma.leadMagnet.findMany({ orderBy: { sortOrder: "asc" } });
      return NextResponse.json({ magnets });
    },
    "lead_magnets",
  );
}

export async function POST(request: Request) {
  return withAdminMutation(
    request,
    async () => {
      let body: unknown;
      try {
        body = await request.json();
      } catch {
        return jsonError("Invalid JSON body");
      }
      const parsed = schema.safeParse(body);
      if (!parsed.success) return jsonError(parsed.error.issues[0]?.message ?? "Invalid input");
      const magnet = await prisma.leadMagnet.create({ data: parsed.data });
      return NextResponse.json({ magnet }, { status: 201 });
    },
    "lead_magnets",
  );
}

export async function PUT(request: Request) {
  return withAdminMutation(
    request,
    async () => {
      let body: unknown;
      try {
        body = await request.json();
      } catch {
        return jsonError("Invalid JSON body");
      }
      const parsed = schema.extend({ id: z.string() }).safeParse(body);
      if (!parsed.success) return jsonError(parsed.error.issues[0]?.message ?? "Invalid input");
      const { id, ...data } = parsed.data;
      const magnet = await prisma.leadMagnet.update({ where: { id }, data });
      return NextResponse.json({ magnet });
    },
    "lead_magnets",
  );
}

export async function DELETE(request: Request) {
  return withAdminMutation(
    request,
    async () => {
      const id = new URL(request.url).searchParams.get("id");
      if (!id) return jsonError("Missing id");
      await prisma.leadMagnet.delete({ where: { id } });
      return NextResponse.json({ success: true });
    },
    "lead_magnets",
  );
}
