import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { withAdmin, withAdminMutation, jsonError, revalidateProjectPaths } from "@/lib/admin-route";

const projectSchema = z.object({
  slug: z.string().min(1),
  titleEn: z.string().min(1),
  titleAr: z.string().min(1),
  shortDescEn: z.string().default(""),
  shortDescAr: z.string().default(""),
  categoryEn: z.string().default(""),
  categoryAr: z.string().default(""),
  industryEn: z.string().default(""),
  industryAr: z.string().default(""),
  spaceOfWorkEn: z.string().default(""),
  spaceOfWorkAr: z.string().default(""),
  timeline: z.string().default(""),
  clientName: z.string().default(""),
  servicesUsed: z.union([z.string(), z.array(z.string())]).default("[]"),
  year: z.string().default(""),
  projectUrl: z.string().default(""),
  coverImage: z.string().default(""),
  galleryJson: z.union([z.string(), z.record(z.string(), z.unknown())]).default("{}"),
  sectionsJson: z.union([z.string(), z.record(z.string(), z.unknown())]).default("{}"),
  seoTitleEn: z.string().default(""),
  seoTitleAr: z.string().default(""),
  seoDescEn: z.string().default(""),
  seoDescAr: z.string().default(""),
  status: z.enum(["draft", "published"]).default("draft"),
  showOnHomepage: z.boolean().default(false),
  sortOrder: z.number().int().default(0),
});

function stringifyJson(value: string | unknown) {
  return typeof value === "string" ? value : JSON.stringify(value);
}

function normalizeProjectInput(data: z.infer<typeof projectSchema>) {
  return {
    ...data,
    servicesUsed: stringifyJson(data.servicesUsed),
    galleryJson: stringifyJson(data.galleryJson),
    sectionsJson: stringifyJson(data.sectionsJson),
  };
}

export async function GET() {
  return withAdmin(async () => {
    const projects = await prisma.project.findMany({
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    });
    return NextResponse.json({ projects });
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

    const parsed = projectSchema.safeParse(body);
    if (!parsed.success) {
      return jsonError(parsed.error.issues[0]?.message ?? "Invalid input");
    }

    const existing = await prisma.project.findUnique({
      where: { slug: parsed.data.slug },
    });
    if (existing) {
      return jsonError("A project with this slug already exists", 409);
    }

    const project = await prisma.project.create({
      data: normalizeProjectInput(parsed.data),
    });

    revalidateProjectPaths(project.slug);

    return NextResponse.json({ project }, { status: 201 });
  });
}
