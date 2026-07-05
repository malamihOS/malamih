export type UtmParams = {
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  utmTerm?: string;
};

export type LeadStatus =
  | "new"
  | "contacted"
  | "interested"
  | "meeting_scheduled"
  | "proposal_sent"
  | "won"
  | "lost";

export type LeadPriority = "low" | "medium" | "high";

export type LeadQuality = "cold" | "warm" | "hot";

export type FormType =
  | "contact"
  | "service_inquiry"
  | "project_inquiry"
  | "blog_cta"
  | "newsletter"
  | "lead_magnet"
  | "proposal"
  | "landing_page"
  | "manual";

export const LEAD_STATUSES: LeadStatus[] = [
  "new",
  "contacted",
  "interested",
  "meeting_scheduled",
  "proposal_sent",
  "won",
  "lost",
];

export const LEAD_PRIORITIES: LeadPriority[] = ["low", "medium", "high"];

export const SERVICE_INQUIRY_SLUGS = [
  "branding",
  "digital-marketing",
  "content-production",
  "web-development",
  "business-automation",
  "consulting",
] as const;

export type ServiceInquirySlug = (typeof SERVICE_INQUIRY_SLUGS)[number];

export function getLeadStatusLabel(status: string): string {
  return status
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}
