import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import {
  withAdmin,
  withAdminMutation,
  jsonError,
} from "@/lib/admin-route";

const integrationsSchema = z.object({
  smtpHost: z.string(),
  smtpPort: z.number().int().min(1).max(65535),
  smtpUser: z.string(),
  smtpPass: z.string(),
  smtpFromEmail: z.string(),
  smtpFromName: z.string(),
  smtpEnabled: z.boolean(),
  notifyEmail: z.string(),
  googleAnalyticsId: z.string(),
  googleTagManagerId: z.string(),
  metaPixelId: z.string(),
  tiktokPixelId: z.string(),
  linkedInInsightTag: z.string(),
  googleSiteVerification: z.string(),
  metaDomainVerification: z.string(),
});

export async function GET() {
  return withAdmin(
    async () => {
      const settings = await prisma.siteSettings.findFirst();
      return NextResponse.json({ settings });
    },
    "integrations",
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

      const parsed = integrationsSchema.safeParse(body);
      if (!parsed.success) {
        return jsonError(parsed.error.issues[0]?.message ?? "Invalid input");
      }

      const existing = await prisma.siteSettings.findFirst();
      const data = parsed.data;

      if (existing && !data.smtpPass && existing.smtpPass) {
        data.smtpPass = existing.smtpPass;
      }

      const settings = await prisma.siteSettings.upsert({
        where: { id: 1 },
        create: { id: 1, ...data },
        update: data,
      });

      return NextResponse.json({
        settings: { ...settings, smtpPass: settings.smtpPass ? "••••••••" : "" },
      });
    },
    "integrations",
  );
}
