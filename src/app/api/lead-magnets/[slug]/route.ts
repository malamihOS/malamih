import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { createContactSubmissionWithLead } from "@/lib/leads/sync";
import { parseUtmFromBody } from "@/lib/leads/utm";
import { jsonError, getClientIp } from "@/lib/admin-route";
import { isContactIpLimited } from "@/lib/rate-limit";
import { sanitizeEmail, sanitizeText } from "@/lib/sanitize";

type RouteContext = { params: Promise<{ slug: string }> };

const schema = z.object({
  name: z.string().min(1).max(200),
  email: z.string().email(),
  phone: z.string().max(50).optional().default(""),
  company: z.string().max(200).optional().default(""),
  website: z.string().optional().default(""),
  sourcePage: z.string().optional().default(""),
});

export async function POST(request: Request, context: RouteContext) {
  if (isContactIpLimited(getClientIp(request))) {
    return NextResponse.json({ error: "Too many submissions." }, { status: 429 });
  }

  const { slug } = await context.params;
  const magnet = await prisma.leadMagnet.findUnique({ where: { slug } });
  if (!magnet || magnet.status !== "active") {
    return jsonError("Lead magnet not found", 404);
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonError("Invalid JSON body");
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return jsonError(parsed.error.issues[0]?.message ?? "Invalid input");
  }
  if (parsed.data.website) {
    return NextResponse.json({ success: true, downloadUrl: magnet.fileUrl });
  }

  const utm = parseUtmFromBody(body as Record<string, unknown>);

  const { submission, lead } = await createContactSubmissionWithLead({
    name: sanitizeText(parsed.data.name, 200),
    email: sanitizeEmail(parsed.data.email),
    phone: sanitizeText(parsed.data.phone, 50),
    company: sanitizeText(parsed.data.company, 200),
    subject: `Lead magnet: ${magnet.titleEn}`,
    message: `Downloaded: ${magnet.titleEn}`,
    formType: "lead_magnet",
    leadSource: "lead_magnet",
    sourcePage: parsed.data.sourcePage,
    interestedServices: magnet.relatedService ? [magnet.relatedService] : [],
    utm,
    metadata: { leadMagnetId: magnet.id, slug },
  });

  await prisma.leadMagnetDownload.create({
    data: {
      leadMagnetId: magnet.id,
      leadId: lead.id,
      name: sanitizeText(parsed.data.name, 200),
      email: sanitizeEmail(parsed.data.email),
      phone: sanitizeText(parsed.data.phone, 50),
      company: sanitizeText(parsed.data.company, 200),
    },
  });

  return NextResponse.json(
    {
      success: true,
      id: submission.id,
      leadId: lead.id,
      downloadUrl: magnet.fileUrl,
    },
    { status: 201 },
  );
}

export async function GET(_request: Request, context: RouteContext) {
  const { slug } = await context.params;
  const magnet = await prisma.leadMagnet.findUnique({ where: { slug } });
  if (!magnet || magnet.status !== "active") {
    return jsonError("Lead magnet not found", 404);
  }
  return NextResponse.json({ magnet });
}
