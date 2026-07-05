import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { withAdmin, jsonError } from "@/lib/admin-route";

const settingsPutSchema = z.object({
  websiteNameEn: z.string(),
  websiteNameAr: z.string(),
  logoUrl: z.string(),
  faviconUrl: z.string(),
  defaultSeoTitleEn: z.string(),
  defaultSeoTitleAr: z.string(),
  defaultSeoDescEn: z.string(),
  defaultSeoDescAr: z.string(),
  ogImageUrl: z.string(),
  headerMenuJson: z.union([z.string(), z.array(z.unknown())]),
  footerContentJson: z.union([z.string(), z.record(z.string(), z.unknown())]),
  footerLinksJson: z.union([z.string(), z.array(z.unknown())]),
  homeProjectsJson: z.union([z.string(), z.record(z.string(), z.unknown())]),
  contactPageJson: z.union([z.string(), z.record(z.string(), z.unknown())]),
});

function stringifyJson(value: string | unknown) {
  return typeof value === "string" ? value : JSON.stringify(value);
}

export async function GET() {
  return withAdmin(async () => {
    const settings = await prisma.siteSettings.findFirst();
    return NextResponse.json({ settings });
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

    const parsed = settingsPutSchema.safeParse(body);
    if (!parsed.success) {
      return jsonError(parsed.error.issues[0]?.message ?? "Invalid input");
    }

    const data = {
      ...parsed.data,
      headerMenuJson: stringifyJson(parsed.data.headerMenuJson),
      footerContentJson: stringifyJson(parsed.data.footerContentJson),
      footerLinksJson: stringifyJson(parsed.data.footerLinksJson),
      homeProjectsJson: stringifyJson(parsed.data.homeProjectsJson),
      contactPageJson: stringifyJson(parsed.data.contactPageJson),
    };

    const settings = await prisma.siteSettings.upsert({
      where: { id: 1 },
      create: { id: 1, ...data },
      update: data,
    });

    return NextResponse.json({ settings });
  });
}
