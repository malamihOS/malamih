import { NextResponse } from "next/server";
import { z } from "zod";
import {
  sendContactAdminNotification,
  sendContactAutoReply,
} from "@/lib/email";
import { createContactSubmissionWithLead } from "@/lib/leads/sync";
import { parseUtmFromBody } from "@/lib/leads/utm";
import { jsonError, getClientIp } from "@/lib/admin-route";
import { isContactIpLimited } from "@/lib/rate-limit";
import { sanitizeEmail, sanitizeText } from "@/lib/sanitize";

const contactSchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  email: z.string().email("Valid email is required"),
  phone: z.string().max(50).optional().default(""),
  company: z.string().max(200).optional().default(""),
  subject: z.string().max(300).optional().default(""),
  message: z.string().min(1, "Message is required").max(10000),
  website: z.string().optional().default(""),
  sourcePage: z.string().optional().default(""),
});

export async function POST(request: Request) {
  const ip = getClientIp(request);

  if (isContactIpLimited(ip)) {
    return NextResponse.json(
      { error: "Too many submissions. Please try again later." },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonError("Invalid JSON body");
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError(parsed.error.issues[0]?.message ?? "Invalid input");
  }

  if (parsed.data.website) {
    return NextResponse.json({ success: true, id: "ok" }, { status: 201 });
  }

  const utm = parseUtmFromBody(body as Record<string, unknown>);
  const data = {
    name: sanitizeText(parsed.data.name, 200),
    email: sanitizeEmail(parsed.data.email),
    phone: sanitizeText(parsed.data.phone ?? "", 50),
    company: sanitizeText(parsed.data.company ?? "", 200),
    subject: sanitizeText(parsed.data.subject ?? "", 300),
    message: sanitizeText(parsed.data.message, 10000),
  };

  const { submission, lead } = await createContactSubmissionWithLead({
    ...data,
    formType: "contact",
    leadSource: "contact_form",
    sourcePage: parsed.data.sourcePage || "/contact",
    utm,
  });

  void sendContactAdminNotification(data).catch(() => {});
  void sendContactAutoReply({ name: data.name, email: data.email }).catch(
    () => {},
  );

  return NextResponse.json(
    { success: true, id: submission.id, leadId: lead.id },
    { status: 201 },
  );
}
