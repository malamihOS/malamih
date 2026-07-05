import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { withAdmin, jsonError } from "@/lib/admin-route";

const whySlideSchema = z.object({
  id: z.string().optional(),
  imageUrl: z.string().min(1),
  altEn: z.string().default(""),
  altAr: z.string().default(""),
  sortOrder: z.number().int().default(0),
  visible: z.boolean().default(true),
});

const whyStatSchema = z.object({
  id: z.string().optional(),
  value: z.number().int(),
  suffix: z.string().default(""),
  labelEn: z.string().default(""),
  labelAr: z.string().default(""),
  sortOrder: z.number().int().default(0),
  visible: z.boolean().default(true),
});

const whyCardSchema = z.object({
  id: z.string().optional(),
  titleEn: z.string().default(""),
  titleAr: z.string().default(""),
  descriptionEn: z.string().default(""),
  descriptionAr: z.string().default(""),
  imageUrl: z.string().default(""),
  sortOrder: z.number().int().default(0),
  visible: z.boolean().default(true),
});

const whyPutSchema = z.object({
  config: z.object({
    labelEn: z.string(),
    labelAr: z.string(),
    titleLine1En: z.string(),
    titleLine1Ar: z.string(),
    titleLine2En: z.string(),
    titleLine2Ar: z.string(),
    descriptionEn: z.string(),
    descriptionAr: z.string(),
    videoUrl: z.string(),
    commitmentHeadingEn: z.string(),
    commitmentHeadingAr: z.string(),
    commitmentDescEn: z.string(),
    commitmentDescAr: z.string(),
    marqueeLabelEn: z.string(),
    marqueeLabelAr: z.string(),
  }),
  slides: z.array(whySlideSchema),
  stats: z.array(whyStatSchema),
  cards: z.array(whyCardSchema),
});

async function syncCollection<T extends { id?: string }>(
  model: {
    deleteMany: (args: { where: { id?: { notIn: string[] } } }) => Promise<unknown>;
    update: (args: { where: { id: string }; data: T }) => Promise<unknown>;
    create: (args: { data: Omit<T, "id"> }) => Promise<unknown>;
  },
  items: T[],
) {
  const ids = items.filter((i) => i.id).map((i) => i.id!);
  await model.deleteMany({
    where: ids.length > 0 ? { id: { notIn: ids } } : {},
  });

  for (const item of items) {
    if (item.id) {
      await model.update({ where: { id: item.id }, data: item });
    } else {
      const { id: _id, ...data } = item;
      await model.create({ data: data as Omit<T, "id"> });
    }
  }
}

export async function GET() {
  return withAdmin(async () => {
    const [config, slides, stats, cards] = await Promise.all([
      prisma.whyMalamihConfig.findFirst(),
      prisma.whyMalamihSlide.findMany({ orderBy: { sortOrder: "asc" } }),
      prisma.whyMalamihStat.findMany({ orderBy: { sortOrder: "asc" } }),
      prisma.whyMalamihCard.findMany({ orderBy: { sortOrder: "asc" } }),
    ]);
    return NextResponse.json({ config, slides, stats, cards });
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

    const parsed = whyPutSchema.safeParse(body);
    if (!parsed.success) {
      return jsonError(parsed.error.issues[0]?.message ?? "Invalid input");
    }

    const { config, slides, stats, cards } = parsed.data;

    await prisma.whyMalamihConfig.upsert({
      where: { id: 1 },
      create: { id: 1, ...config },
      update: config,
    });

    await syncCollection(prisma.whyMalamihSlide, slides);
    await syncCollection(prisma.whyMalamihStat, stats);
    await syncCollection(prisma.whyMalamihCard, cards);

    const [updatedConfig, updatedSlides, updatedStats, updatedCards] =
      await Promise.all([
        prisma.whyMalamihConfig.findFirst(),
        prisma.whyMalamihSlide.findMany({ orderBy: { sortOrder: "asc" } }),
        prisma.whyMalamihStat.findMany({ orderBy: { sortOrder: "asc" } }),
        prisma.whyMalamihCard.findMany({ orderBy: { sortOrder: "asc" } }),
      ]);

    return NextResponse.json({
      config: updatedConfig,
      slides: updatedSlides,
      stats: updatedStats,
      cards: updatedCards,
    });
  });
}
