import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { createContactSubmissionWithLead, syncLeadFromSubmission } from "@/lib/leads/sync";
import { parseUtmFromBody } from "@/lib/leads/utm";
import { SERVICE_INQUIRY_SLUGS } from "@/lib/leads/types";
import { jsonError, getClientIp } from "@/lib/admin-route";
import { isContactIpLimited } from "@/lib/rate-limit";
import { sanitizeEmail, sanitizeText } from "@/lib/sanitize";

const schema = z.object({
  name: z.string().min(1).max(200),
  email: z.string().email(),
  phone: z.string().max(50).optional().default(""),
  company: z.string().max(200).optional().default(""),
  service: z.enum(SERVICE_INQUIRY_SLUGS),
  description: z.string().min(1).max(10000),
  budgetRange: z.string().optional().default(""),
  contactMethod: z.string().optional().default("email"),
  website: z.string().optional().default(""),
  sourcePage: z.string().optional().default(""),
});

export async function POST(request: Request) {
  if (isContactIpLimited(getClientIp(request))) {
    return NextResponse.json({ error: "Too many submissions." }, { status: 429 });
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
    return NextResponse.json({ success: true }, { status: 201 });
  }

  const utm = parseUtmFromBody(body as Record<string, unknown>);
  const service = parsed.data.service;
  const message = [
    `Service: ${service}`,
    `Budget: ${parsed.data.budgetRange || "—"}`,
    `Preferred contact: ${parsed.data.contactMethod}`,
    "",
    parsed.data.description,
  ].join("\n");

  const { submission, lead } = await createContactSubmissionWithLead({
    name: sanitizeText(parsed.data.name, 200),
    email: sanitizeEmail(parsed.data.email),
    phone: sanitizeText(parsed.data.phone, 50),
    company: sanitizeText(parsed.data.company, 200),
    subject: `Service inquiry: ${service}`,
    message,
    formType: "service_inquiry",
    leadSource: "service_inquiry",
    sourcePage: parsed.data.sourcePage,
    interestedServices: [service],
    budgetRange: parsed.data.budgetRange,
    utm,
    metadata: {
      contactMethod: parsed.data.contactMethod,
      service,
    },
  });

  return NextResponse.json(
    { success: true, id: submission.id, leadId: lead.id },
    { status: 201 },
  );
}
