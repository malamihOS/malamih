import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { withAdmin, jsonError } from "@/lib/admin-route";

const contactPutSchema = z.object({
  phones: z.union([z.string(), z.array(z.string())]),
  whatsappNumbers: z.union([
    z.string(),
    z.array(z.object({ label: z.string(), url: z.string() })),
  ]),
  emails: z.union([z.string(), z.array(z.string())]),
  addressEn: z.string(),
  addressAr: z.string(),
  mapsUrl: z.string(),
  socialLinks: z.union([
    z.string(),
    z.array(
      z.object({
        key: z.string(),
        href: z.string(),
        labelEn: z.string().optional(),
        labelAr: z.string().optional(),
      }),
    ),
  ]),
  workingHoursEn: z.string(),
  workingHoursAr: z.string(),
});

function stringifyJson(value: string | unknown) {
  return typeof value === "string" ? value : JSON.stringify(value);
}

export async function GET() {
  return withAdmin(async () => {
    const settings = await prisma.contactSettings.findFirst();
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

    const parsed = contactPutSchema.safeParse(body);
    if (!parsed.success) {
      return jsonError(parsed.error.issues[0]?.message ?? "Invalid input");
    }

    const data = {
      ...parsed.data,
      phones: stringifyJson(parsed.data.phones),
      whatsappNumbers: stringifyJson(parsed.data.whatsappNumbers),
      emails: stringifyJson(parsed.data.emails),
      socialLinks: stringifyJson(parsed.data.socialLinks),
    };

    const settings = await prisma.contactSettings.upsert({
      where: { id: 1 },
      create: { id: 1, ...data },
      update: data,
    });

    return NextResponse.json({ settings });
  });
}
