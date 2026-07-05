import { prisma } from "@/lib/prisma";
import { calculateLeadScore, derivePriority } from "@/lib/leads/scoring";
import type { FormType, UtmParams } from "@/lib/leads/types";
import { utmFields } from "@/lib/leads/utm";
import { sanitizeEmail, sanitizeText } from "@/lib/sanitize";

export type LeadSyncInput = {
  fullName: string;
  email: string;
  phone?: string;
  company?: string;
  whatsApp?: string;
  city?: string;
  country?: string;
  industry?: string;
  leadSource: string;
  formType: FormType;
  interestedServices?: string[];
  budgetRange?: string;
  message?: string;
  notes?: string;
  sourcePage?: string;
  utm?: UtmParams;
};

export async function syncLeadFromSubmission(input: LeadSyncInput) {
  const email = sanitizeEmail(input.email);
  const utm = utmFields(input.utm ?? {});
  const services = JSON.stringify(input.interestedServices ?? []);

  const { score, qualityLabel } = calculateLeadScore({
    email,
    phone: input.phone ?? "",
    company: input.company ?? "",
    message: input.message,
    budgetRange: input.budgetRange,
    interestedServices: input.interestedServices,
    leadSource: input.leadSource,
    formType: input.formType,
    utmSource: utm.utmSource,
    hasWhatsApp: Boolean(input.whatsApp),
    city: input.city,
    country: input.country,
    industry: input.industry,
  });

  const priority = derivePriority(score);

  const existing = await prisma.lead.findFirst({
    where: { email },
    orderBy: { updatedAt: "desc" },
  });

  const data = {
    fullName: sanitizeText(input.fullName, 200),
    companyName: sanitizeText(input.company ?? "", 200),
    email,
    phone: sanitizeText(input.phone ?? "", 50),
    whatsApp: sanitizeText(input.whatsApp ?? "", 50),
    city: sanitizeText(input.city ?? "", 100),
    country: sanitizeText(input.country ?? "", 100),
    industry: sanitizeText(input.industry ?? "", 100),
    leadSource: input.leadSource,
    interestedServices: services,
    budgetRange: sanitizeText(input.budgetRange ?? "", 50),
    notes: sanitizeText(input.notes ?? input.message ?? "", 10000),
    score,
    qualityLabel,
    priority,
    lastContactDate: new Date(),
    ...utm,
  };

  if (existing) {
    const mergedServices = mergeJsonArray(
      existing.interestedServices,
      input.interestedServices ?? [],
    );
    return prisma.lead.update({
      where: { id: existing.id },
      data: {
        ...data,
        interestedServices: JSON.stringify(mergedServices),
        notes: existing.notes
          ? `${existing.notes}\n\n---\n${data.notes}`.slice(0, 10000)
          : data.notes,
      },
    });
  }

  return prisma.lead.create({ data });
}

export async function createContactSubmissionWithLead(params: {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  subject?: string;
  message: string;
  formType: FormType;
  sourcePage?: string;
  metadata?: Record<string, unknown>;
  utm?: UtmParams;
  leadSource: string;
  interestedServices?: string[];
  budgetRange?: string;
}) {
  const lead = await syncLeadFromSubmission({
    fullName: params.name,
    email: params.email,
    phone: params.phone,
    company: params.company,
    leadSource: params.leadSource,
    formType: params.formType,
    interestedServices: params.interestedServices,
    budgetRange: params.budgetRange,
    message: params.message,
    sourcePage: params.sourcePage,
    utm: params.utm,
  });

  const submission = await prisma.contactSubmission.create({
    data: {
      name: sanitizeText(params.name, 200),
      email: sanitizeEmail(params.email),
      phone: sanitizeText(params.phone ?? "", 50),
      company: sanitizeText(params.company ?? "", 200),
      subject: sanitizeText(params.subject ?? "", 300),
      message: sanitizeText(params.message, 10000),
      status: "new",
      formType: params.formType,
      sourcePage: sanitizeText(params.sourcePage ?? "", 500),
      metadataJson: JSON.stringify(params.metadata ?? {}),
      leadId: lead.id,
      ...utmFields(params.utm ?? {}),
    },
  });

  return { lead, submission };
}

function mergeJsonArray(existing: string, incoming: string[]) {
  try {
    const current = JSON.parse(existing) as string[];
    return [...new Set([...(Array.isArray(current) ? current : []), ...incoming])];
  } catch {
    return incoming;
  }
}
