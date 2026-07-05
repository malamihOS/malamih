import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { withAdmin, withAdminMutation, jsonError } from "@/lib/admin-route";

const schema = z.object({
  slug: z.string().min(1),
  titleEn: z.string().min(1),
  titleAr: z.string().min(1),
  headlineEn: z.string().optional().default(""),
  headlineAr: z.string().optional().default(""),
  descriptionEn: z.string().optional().default(""),
  descriptionAr: z.string().optional().default(""),
  coverImage: z.string().optional().default(""),
  coverVideo: z.string().optional().default(""),
  relatedService: z.string().optional().default(""),
  ctaTextEn: z.string().optional().default("Get Started"),
  ctaTextAr: z.string().optional().default("ابدأ الآن"),
  formFieldsJson: z.union([z.string(), z.array(z.string())]).optional().default("[]"),
  seoTitleEn: z.string().optional().default(""),
  seoTitleAr: z.string().optional().default(""),
  seoDescEn: z.string().optional().default(""),
  seoDescAr: z.string().optional().default(""),
  status: z.enum(["draft", "published"]).optional().default("draft"),
});

function stringifyFields(v: string | string[]) {
  return typeof v === "string" ? v : JSON.stringify(v);
}

export async function GET() {
  return withAdmin(
    async () => {
      const pages = await prisma.landingPage.findMany({ orderBy: { updatedAt: "desc" } });
      return NextResponse.json({ pages });
    },
    "landing_pages",
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
      const page = await prisma.landingPage.create({
        data: { ...parsed.data, formFieldsJson: stringifyFields(parsed.data.formFieldsJson) },
      });
      return NextResponse.json({ page }, { status: 201 });
    },
    "landing_pages",
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
      const { id, ...rest } = parsed.data;
      const page = await prisma.landingPage.update({
        where: { id },
        data: { ...rest, formFieldsJson: stringifyFields(rest.formFieldsJson) },
      });
      return NextResponse.json({ page });
    },
    "landing_pages",
  );
}

export async function DELETE(request: Request) {
  return withAdminMutation(
    request,
    async () => {
      const id = new URL(request.url).searchParams.get("id");
      if (!id) return jsonError("Missing id");
      await prisma.landingPage.delete({ where: { id } });
      return NextResponse.json({ success: true });
    },
    "landing_pages",
  );
}
