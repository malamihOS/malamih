import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  withAdmin,
  withAdminMutation,
  jsonError,
} from "@/lib/admin-route";

function toCsv(rows: Record<string, unknown>[]): string {
  if (rows.length === 0) return "";
  const headers = Object.keys(rows[0]);
  const lines = [
    headers.join(","),
    ...rows.map((row) =>
      headers
        .map((h) => {
          const val = String(row[h] ?? "");
          return val.includes(",") || val.includes('"')
            ? `"${val.replace(/"/g, '""')}"`
            : val;
        })
        .join(","),
    ),
  ];
  return lines.join("\n");
}

export async function GET(request: Request) {
  return withAdmin(
    async () => {
      const { searchParams } = new URL(request.url);
      const type = searchParams.get("type") ?? "full";
      const format = searchParams.get("format") ?? "json";

      let data: unknown;
      let filename = "export";

      switch (type) {
        case "projects":
          data = await prisma.project.findMany({ orderBy: { sortOrder: "asc" } });
          filename = "projects";
          break;
        case "blog":
          data = await prisma.blogPost.findMany({ orderBy: { publishedAt: "desc" } });
          filename = "blog-posts";
          break;
        case "messages":
          data = await prisma.contactSubmission.findMany({
            orderBy: { createdAt: "desc" },
          });
          filename = "contact-submissions";
          break;
        case "leads":
          data = await prisma.lead.findMany({ orderBy: { updatedAt: "desc" } });
          filename = "leads";
          break;
        case "newsletter":
          data = await prisma.newsletterSubscriber.findMany({
            orderBy: { createdAt: "desc" },
          });
          filename = "newsletter-subscribers";
          break;
        case "proposals":
          data = await prisma.proposalRequest.findMany({
            orderBy: { createdAt: "desc" },
          });
          filename = "proposal-requests";
          break;
        case "lead-magnet-downloads":
          data = await prisma.leadMagnetDownload.findMany({
            orderBy: { createdAt: "desc" },
          });
          filename = "lead-magnet-downloads";
          break;
        case "services":
          data = await prisma.service.findMany({ orderBy: { sortOrder: "asc" } });
          filename = "services";
          break;
        case "full":
          data = {
            exportedAt: new Date().toISOString(),
            hero: await prisma.heroConfig.findFirst(),
            heroSlides: await prisma.heroSlide.findMany({ orderBy: { sortOrder: "asc" } }),
            why: await prisma.whyMalamihConfig.findFirst(),
            whySlides: await prisma.whyMalamihSlide.findMany({ orderBy: { sortOrder: "asc" } }),
            whyStats: await prisma.whyMalamihStat.findMany({ orderBy: { sortOrder: "asc" } }),
            whyCards: await prisma.whyMalamihCard.findMany({ orderBy: { sortOrder: "asc" } }),
            logos: await prisma.clientLogo.findMany(),
            teamConfig: await prisma.teamConfig.findFirst(),
            teamMembers: await prisma.teamMember.findMany(),
            projects: await prisma.project.findMany(),
            blogPosts: await prisma.blogPost.findMany(),
            services: await prisma.service.findMany(),
            contactSettings: await prisma.contactSettings.findFirst(),
            contactSubmissions: await prisma.contactSubmission.findMany(),
            siteSettings: await prisma.siteSettings.findFirst(),
            pageSeo: await prisma.pageSeo.findMany(),
            media: await prisma.mediaFile.findMany(),
          };
          filename = "cms-full-export";
          break;
        default:
          return jsonError("Unknown export type");
      }

      if (format === "csv" && Array.isArray(data)) {
        const csv = toCsv(data as Record<string, unknown>[]);
        return new NextResponse(csv, {
          headers: {
            "Content-Type": "text/csv; charset=utf-8",
            "Content-Disposition": `attachment; filename="${filename}.csv"`,
          },
        });
      }

      return new NextResponse(JSON.stringify(data, null, 2), {
        headers: {
          "Content-Type": "application/json",
          "Content-Disposition": `attachment; filename="${filename}.json"`,
        },
      });
    },
    "export",
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

      if (
        typeof body !== "object" ||
        body === null ||
        !("type" in body) ||
        body.type !== "projects"
      ) {
        return jsonError("Only safe project JSON import is supported");
      }

      const projects = (body as { projects?: unknown }).projects;
      if (!Array.isArray(projects) || projects.length === 0) {
        return jsonError("Invalid projects array");
      }

      let imported = 0;
      for (const item of projects) {
        if (typeof item !== "object" || item === null) continue;
        const p = item as Record<string, unknown>;
        if (!p.slug || typeof p.slug !== "string") continue;

        await prisma.project.upsert({
          where: { slug: p.slug },
          create: {
            slug: p.slug,
            titleEn: String(p.titleEn ?? ""),
            titleAr: String(p.titleAr ?? ""),
            shortDescEn: String(p.shortDescEn ?? p.descriptionEn ?? ""),
            shortDescAr: String(p.shortDescAr ?? p.descriptionAr ?? ""),
            categoryEn: String(p.categoryEn ?? ""),
            categoryAr: String(p.categoryAr ?? ""),
            coverImage: String(p.coverImage ?? p.imageUrl ?? ""),
            sortOrder: Number(p.sortOrder ?? 0),
            status: p.status === "draft" ? "draft" : "published",
          },
          update: {
            titleEn: String(p.titleEn ?? ""),
            titleAr: String(p.titleAr ?? ""),
            shortDescEn: String(p.shortDescEn ?? p.descriptionEn ?? ""),
            shortDescAr: String(p.shortDescAr ?? p.descriptionAr ?? ""),
            categoryEn: String(p.categoryEn ?? ""),
            categoryAr: String(p.categoryAr ?? ""),
            coverImage: String(p.coverImage ?? p.imageUrl ?? ""),
            sortOrder: Number(p.sortOrder ?? 0),
            status: p.status === "draft" ? "draft" : "published",
          },
        });
        imported += 1;
      }

      return NextResponse.json({ imported });
    },
    "export",
  );
}
