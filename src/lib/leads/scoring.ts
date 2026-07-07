import type { FormType, LeadQuality } from "@/lib/leads/types";

export type ScoringInput = {
  email: string;
  phone: string;
  company: string;
  message?: string;
  budgetRange?: string;
  interestedServices?: string[];
  leadSource: string;
  formType: FormType;
  utmSource?: string;
  hasWhatsApp?: boolean;
  city?: string;
  country?: string;
  industry?: string;
};

const BUDGET_SCORES: Record<string, number> = {
  "under-5k": 5,
  "5k-15k": 15,
  "15k-50k": 25,
  "50k-100k": 30,
  "100k+": 35,
  "not-sure": 8,
};

const SOURCE_SCORES: Record<string, number> = {
  contact_form: 12,
  service_inquiry: 18,
  project_inquiry: 20,
  proposal_request: 25,
  newsletter: 5,
  blog_cta: 8,
  landing_page: 15,
  manual: 0,
};

const SERVICE_SCORES: Record<string, number> = {
  branding: 8,
  "digital-marketing": 10,
  "content-production": 8,
  "web-development": 12,
  "business-automation": 15,
  consulting: 12,
};

export function calculateLeadScore(input: ScoringInput): {
  score: number;
  qualityLabel: LeadQuality;
} {
  let score = 0;

  if (input.email.includes("@") && !input.email.includes("test")) score += 10;
  if (input.phone.trim().length >= 8) score += 10;
  if (input.company.trim().length > 1) score += 8;
  if (input.hasWhatsApp) score += 5;
  if (input.city?.trim()) score += 3;
  if (input.country?.trim()) score += 3;
  if (input.industry?.trim()) score += 5;

  const messageLen = (input.message ?? "").trim().length;
  if (messageLen > 200) score += 15;
  else if (messageLen > 80) score += 10;
  else if (messageLen > 20) score += 5;

  if (input.budgetRange && BUDGET_SCORES[input.budgetRange]) {
    score += BUDGET_SCORES[input.budgetRange];
  }

  score += SOURCE_SCORES[input.leadSource] ?? 5;

  for (const service of input.interestedServices ?? []) {
    score += SERVICE_SCORES[service] ?? 4;
  }

  if (input.utmSource) score += 5;
  if (input.formType === "proposal") score += 10;

  score = Math.min(100, Math.max(0, score));

  let qualityLabel: LeadQuality = "cold";
  if (score >= 65) qualityLabel = "hot";
  else if (score >= 35) qualityLabel = "warm";

  return { score, qualityLabel };
}

export function derivePriority(score: number): "low" | "medium" | "high" {
  if (score >= 65) return "high";
  if (score >= 35) return "medium";
  return "low";
}
