import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { withAdmin, jsonError } from "@/lib/admin-route";

const pageSeoSchema = z.object({
  pageKey: z.string().min(1),
  seoTitleEn: z.string().default(""),
  seoTitleAr: z.string().default(""),
  seoDescEn: z.string().default(""),
  seoDescAr: z.string().default(""),
  seoKeywordsEn: z.string().default(""),
  seoKeywordsAr: z.string().default(""),
  ogImageUrl: z.string().default(""),
  canonicalUrlEn: z.string().default(""),
  canonicalUrlAr: z.string().default(""),
  noIndex: z.boolean().default(false),
});

export async function GET() {
  return withAdmin(async () => {
    const pages = await prisma.pageSeo.findMany();
    return NextResponse.json({ pages });
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

    const parsed = pageSeoSchema.safeParse(body);
    if (!parsed.success) {
      return jsonError(parsed.error.issues[0]?.message ?? "Invalid input");
    }

    const page = await prisma.pageSeo.upsert({
      where: { pageKey: parsed.data.pageKey },
      create: parsed.data,
      update: parsed.data,
    });

    return NextResponse.json({ page });
  });
}
