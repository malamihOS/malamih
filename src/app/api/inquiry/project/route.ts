import { NextResponse } from "next/server";
import { z } from "zod";
import { createContactSubmissionWithLead } from "@/lib/leads/sync";
import { parseUtmFromBody } from "@/lib/leads/utm";
import { jsonError, getClientIp } from "@/lib/admin-route";
import { isContactIpLimited } from "@/lib/rate-limit";
import { sanitizeEmail, sanitizeText } from "@/lib/sanitize";

const schema = z.object({
  name: z.string().min(1).max(200),
  email: z.string().email(),
  phone: z.string().max(50).optional().default(""),
  company: z.string().max(200).optional().default(""),
  projectSlug: z.string().optional().default(""),
  projectTitle: z.string().optional().default(""),
  message: z.string().min(1).max(10000),
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
  const subject = parsed.data.projectTitle
    ? `Project inquiry: ${parsed.data.projectTitle}`
    : "Project inquiry";

  const { submission, lead } = await createContactSubmissionWithLead({
    name: sanitizeText(parsed.data.name, 200),
    email: sanitizeEmail(parsed.data.email),
    phone: sanitizeText(parsed.data.phone, 50),
    company: sanitizeText(parsed.data.company, 200),
    subject,
    message: sanitizeText(parsed.data.message, 10000),
    formType: "project_inquiry",
    leadSource: "project_inquiry",
    sourcePage: parsed.data.sourcePage,
    utm,
    metadata: {
      projectSlug: parsed.data.projectSlug,
      projectTitle: parsed.data.projectTitle,
    },
  });

  return NextResponse.json(
    { success: true, id: submission.id, leadId: lead.id },
    { status: 201 },
  );
}
