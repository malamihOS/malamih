import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { syncLeadFromSubmission } from "@/lib/leads/sync";
import { parseUtmFromBody } from "@/lib/leads/utm";
import { jsonError, getClientIp } from "@/lib/admin-route";
import { isContactIpLimited } from "@/lib/rate-limit";
import { sanitizeEmail, sanitizeText } from "@/lib/sanitize";

const schema = z.object({
  email: z.string().email(),
  name: z.string().max(200).optional().default(""),
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
  const email = sanitizeEmail(parsed.data.email);
  const name = sanitizeText(parsed.data.name || email.split("@")[0], 200);

  const existing = await prisma.newsletterSubscriber.findUnique({
    where: { email },
  });

  if (existing?.status === "active") {
    return NextResponse.json({ success: true, alreadySubscribed: true });
  }

  const lead = await syncLeadFromSubmission({
    fullName: name,
    email,
    leadSource: "newsletter",
    formType: "newsletter",
    sourcePage: parsed.data.sourcePage,
    utm,
  });

  if (existing) {
    await prisma.newsletterSubscriber.update({
      where: { email },
      data: { status: "active", leadId: lead.id, name, ...utmFieldsFrom(utm) },
    });
  } else {
    await prisma.newsletterSubscriber.create({
      data: {
        email,
        name,
        status: "active",
        sourcePage: sanitizeText(parsed.data.sourcePage, 500),
        leadId: lead.id,
        ...utmFieldsFrom(utm),
      },
    });
  }

  return NextResponse.json({ success: true, leadId: lead.id }, { status: 201 });
}

function utmFieldsFrom(utm: ReturnType<typeof parseUtmFromBody>) {
  return {
    utmSource: utm.utmSource ?? "",
    utmMedium: utm.utmMedium ?? "",
    utmCampaign: utm.utmCampaign ?? "",
    utmContent: utm.utmContent ?? "",
    utmTerm: utm.utmTerm ?? "",
  };
}
