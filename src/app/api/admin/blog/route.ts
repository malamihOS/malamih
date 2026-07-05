import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { withAdmin, withAdminMutation, jsonError } from "@/lib/admin-route";

const blogSchema = z.object({
  slug: z.string().min(1),
  titleEn: z.string().min(1),
  titleAr: z.string().min(1),
  excerptEn: z.string().default(""),
  excerptAr: z.string().default(""),
  contentEn: z.union([z.string(), z.array(z.unknown())]).default("[]"),
  contentAr: z.union([z.string(), z.array(z.unknown())]).default("[]"),
  coverImage: z.string().default(""),
  coverAltEn: z.string().default(""),
  coverAltAr: z.string().default(""),
  categoryEn: z.string().default(""),
  categoryAr: z.string().default(""),
  categorySlug: z.string().default(""),
  tagsEn: z.union([z.string(), z.array(z.string())]).default("[]"),
  tagsAr: z.union([z.string(), z.array(z.string())]).default("[]"),
  author: z.string().default("Malamih Creative Company"),
  publishedAt: z.string().optional(),
  status: z.enum(["draft", "published"]).default("draft"),
  featured: z.boolean().default(false),
  seoTitleEn: z.string().default(""),
  seoTitleAr: z.string().default(""),
  seoDescEn: z.string().default(""),
  seoDescAr: z.string().default(""),
  seoKeywordsEn: z.string().default(""),
  seoKeywordsAr: z.string().default(""),
  ogImageUrl: z.string().default(""),
  canonicalUrl: z.string().default(""),
  noIndex: z.boolean().default(false),
  sortOrder: z.number().int().default(0),
});

function stringifyJson(value: string | unknown) {
  return typeof value === "string" ? value : JSON.stringify(value);
}

function normalizeInput(data: z.infer<typeof blogSchema>) {
  return {
    ...data,
    contentEn: stringifyJson(data.contentEn),
    contentAr: stringifyJson(data.contentAr),
    tagsEn: stringifyJson(data.tagsEn),
    tagsAr: stringifyJson(data.tagsAr),
    publishedAt: data.publishedAt ? new Date(data.publishedAt) : new Date(),
  };
}

export async function GET() {
  return withAdmin(async () => {
    const posts = await prisma.blogPost.findMany({
      orderBy: [{ featured: "desc" }, { publishedAt: "desc" }],
    });
    return NextResponse.json({ posts });
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

    const parsed = blogSchema.safeParse(body);
    if (!parsed.success) {
      return jsonError(parsed.error.issues[0]?.message ?? "Invalid input");
    }

    const existing = await prisma.blogPost.findUnique({
      where: { slug: parsed.data.slug },
    });
    if (existing) return jsonError("Slug already exists", 409);

    const post = await prisma.blogPost.create({
      data: normalizeInput(parsed.data),
    });
    return NextResponse.json({ post }, { status: 201 });
  });
}
