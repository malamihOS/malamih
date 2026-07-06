import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { withAdmin, withAdminMutation, jsonError, revalidateProjectPaths } from "@/lib/admin-route";

type RouteContext = { params: Promise<{ id: string }> };

const projectUpdateSchema = z.object({
  slug: z.string().min(1).optional(),
  titleEn: z.string().min(1).optional(),
  titleAr: z.string().min(1).optional(),
  shortDescEn: z.string().optional(),
  shortDescAr: z.string().optional(),
  categoryEn: z.string().optional(),
  categoryAr: z.string().optional(),
  industryEn: z.string().optional(),
  industryAr: z.string().optional(),
  spaceOfWorkEn: z.string().optional(),
  spaceOfWorkAr: z.string().optional(),
  timeline: z.string().optional(),
  clientName: z.string().optional(),
  servicesUsed: z.union([z.string(), z.array(z.string())]).optional(),
  year: z.string().optional(),
  projectUrl: z.string().optional(),
  coverImage: z.string().optional(),
  galleryJson: z.union([z.string(), z.record(z.string(), z.unknown())]).optional(),
  sectionsJson: z.union([z.string(), z.record(z.string(), z.unknown())]).optional(),
  seoTitleEn: z.string().optional(),
  seoTitleAr: z.string().optional(),
  seoDescEn: z.string().optional(),
  seoDescAr: z.string().optional(),
  status: z.enum(["draft", "published"]).optional(),
  showOnHomepage: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
});

function normalizeUpdate(data: z.infer<typeof projectUpdateSchema>) {
  const result: Record<string, unknown> = { ...data };
  if (data.servicesUsed !== undefined) {
    result.servicesUsed =
      typeof data.servicesUsed === "string"
        ? data.servicesUsed
        : JSON.stringify(data.servicesUsed);
  }
  if (data.galleryJson !== undefined) {
    result.galleryJson =
      typeof data.galleryJson === "string"
        ? data.galleryJson
        : JSON.stringify(data.galleryJson);
  }
  if (data.sectionsJson !== undefined) {
    result.sectionsJson =
      typeof data.sectionsJson === "string"
        ? data.sectionsJson
        : JSON.stringify(data.sectionsJson);
  }
  return result;
}

export async function GET(_request: Request, context: RouteContext) {
  return withAdmin(async () => {
    const { id } = await context.params;
    const project = await prisma.project.findUnique({ where: { id } });
    if (!project) {
      return jsonError("Project not found", 404);
    }
    return NextResponse.json({ project });
  });
}

export async function PUT(request: Request, context: RouteContext) {
  return withAdminMutation(request, async () => {
    const { id } = await context.params;

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return jsonError("Invalid JSON body");
    }

    const parsed = projectUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return jsonError(parsed.error.issues[0]?.message ?? "Invalid input");
    }

    if (parsed.data.slug) {
      const conflict = await prisma.project.findFirst({
        where: { slug: parsed.data.slug, id: { not: id } },
      });
      if (conflict) {
        return jsonError("A project with this slug already exists", 409);
      }
    }

    try {
      const project = await prisma.project.update({
        where: { id },
        data: normalizeUpdate(parsed.data),
      });
      revalidateProjectPaths(project.slug);
      return NextResponse.json({ project });
    } catch {
      return jsonError("Project not found", 404);
    }
  });
}

export async function DELETE(request: Request, context: RouteContext) {
  return withAdminMutation(request, async () => {
    const { id } = await context.params;
    try {
      const project = await prisma.project.findUnique({ where: { id } });
      await prisma.project.delete({ where: { id } });
      if (project) revalidateProjectPaths(project.slug);
      return NextResponse.json({ success: true });
    } catch {
      return jsonError("Project not found", 404);
    }
  });
}
