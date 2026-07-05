import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { createContactSubmissionWithLead } from "@/lib/leads/sync";
import { parseUtmFromBody } from "@/lib/leads/utm";
import { SERVICE_INQUIRY_SLUGS } from "@/lib/leads/types";
import { jsonError, getClientIp } from "@/lib/admin-route";
import { isContactIpLimited } from "@/lib/rate-limit";
import { sanitizeEmail, sanitizeText } from "@/lib/sanitize";

const schema = z.object({
  contactName: z.string().min(1).max(200),
  contactEmail: z.string().email(),
  contactPhone: z.string().max(50).optional().default(""),
  companyName: z.string().max(200).optional().default(""),
  selectedServices: z.array(z.enum(SERVICE_INQUIRY_SLUGS)).min(1),
  goals: z.string().min(1).max(10000),
  budgetRange: z.string().min(1),
  timeline: z.string().min(1).max(200),
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
  const message = [
    `Company: ${parsed.data.companyName || "—"}`,
    `Services: ${parsed.data.selectedServices.join(", ")}`,
    `Budget: ${parsed.data.budgetRange}`,
    `Timeline: ${parsed.data.timeline}`,
    "",
    "Goals:",
    parsed.data.goals,
  ].join("\n");

  const { submission, lead } = await createContactSubmissionWithLead({
    name: sanitizeText(parsed.data.contactName, 200),
    email: sanitizeEmail(parsed.data.contactEmail),
    phone: sanitizeText(parsed.data.contactPhone, 50),
    company: sanitizeText(parsed.data.companyName, 200),
    subject: "Proposal request",
    message,
    formType: "proposal",
    leadSource: "proposal_request",
    sourcePage: parsed.data.sourcePage || "/proposal",
    interestedServices: parsed.data.selectedServices,
    budgetRange: parsed.data.budgetRange,
    utm,
  });

  const proposal = await prisma.proposalRequest.create({
    data: {
      leadId: lead.id,
      contactSubmissionId: submission.id,
      companyName: sanitizeText(parsed.data.companyName, 200),
      contactName: sanitizeText(parsed.data.contactName, 200),
      contactEmail: sanitizeEmail(parsed.data.contactEmail),
      contactPhone: sanitizeText(parsed.data.contactPhone, 50),
      selectedServices: JSON.stringify(parsed.data.selectedServices),
      goals: sanitizeText(parsed.data.goals, 10000),
      budgetRange: sanitizeText(parsed.data.budgetRange, 50),
      timeline: sanitizeText(parsed.data.timeline, 200),
      status: "new",
      utmSource: utm.utmSource ?? "",
      utmMedium: utm.utmMedium ?? "",
      utmCampaign: utm.utmCampaign ?? "",
      utmContent: utm.utmContent ?? "",
      utmTerm: utm.utmTerm ?? "",
    },
  });

  return NextResponse.json(
    { success: true, id: proposal.id, leadId: lead.id },
    { status: 201 },
  );
}
