import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { withAdmin, withAdminMutation, jsonError } from "@/lib/admin-route";

const slideSchema = z.object({
  id: z.string().optional(),
  imageUrl: z.string().min(1),
  textEn: z.string().default(""),
  textAr: z.string().default(""),
  objectPosition: z.string().default("center"),
  sortOrder: z.number().int().default(0),
  visible: z.boolean().default(true),
  animationJson: z.string().default("{}"),
});

const heroPutSchema = z.object({
  config: z.object({
    headlineEn: z.string(),
    headlineAr: z.string(),
    descriptionEn: z.string(),
    descriptionAr: z.string(),
    ctaTextEn: z.string(),
    ctaTextAr: z.string(),
    ctaLink: z.string(),
    tagline1En: z.string(),
    tagline1Ar: z.string(),
    tagline2En: z.string(),
    tagline2Ar: z.string(),
    categoriesEn: z.union([z.string(), z.array(z.string())]),
    categoriesAr: z.union([z.string(), z.array(z.string())]),
    brandNameEn: z.string(),
    brandNameAr: z.string(),
    brandCreativeEn: z.string(),
    brandCreativeAr: z.string(),
  }),
  slides: z.array(slideSchema),
});

function stringifyCategories(value: string | string[]) {
  return Array.isArray(value) ? JSON.stringify(value) : value;
}

export async function GET() {
  return withAdmin(async () => {
    const [config, slides] = await Promise.all([
      prisma.heroConfig.findFirst(),
      prisma.heroSlide.findMany({ orderBy: { sortOrder: "asc" } }),
    ]);
    return NextResponse.json({ config, slides });
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

    const parsed = heroPutSchema.safeParse(body);
    if (!parsed.success) {
      return jsonError(parsed.error.issues[0]?.message ?? "Invalid input");
    }

    const { config, slides } = parsed.data;
    const categoriesEn = stringifyCategories(config.categoriesEn);
    const categoriesAr = stringifyCategories(config.categoriesAr);

    await prisma.heroConfig.upsert({
      where: { id: 1 },
      create: { id: 1, ...config, categoriesEn, categoriesAr },
      update: { ...config, categoriesEn, categoriesAr },
    });

    const existingIds = slides.filter((s) => s.id).map((s) => s.id!);
    await prisma.heroSlide.deleteMany({
      where: existingIds.length > 0 ? { id: { notIn: existingIds } } : {},
    });

    for (const slide of slides) {
      if (slide.id) {
        await prisma.heroSlide.update({
          where: { id: slide.id },
          data: slide,
        });
      } else {
        await prisma.heroSlide.create({ data: slide });
      }
    }

    const [updatedConfig, updatedSlides] = await Promise.all([
      prisma.heroConfig.findFirst(),
      prisma.heroSlide.findMany({ orderBy: { sortOrder: "asc" } }),
    ]);

    return NextResponse.json({ config: updatedConfig, slides: updatedSlides });
  });
}
