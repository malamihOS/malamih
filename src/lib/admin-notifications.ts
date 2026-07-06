import { prisma } from "@/lib/prisma";

export type AdminNotificationCounts = {
  "/admin/messages": number;
  "/admin/leads": number;
  "/admin/proposals": number;
};

export async function getAdminNotificationCounts(): Promise<AdminNotificationCounts> {
  const [messages, leads, proposals] = await Promise.all([
    prisma.contactSubmission.count({ where: { status: "new" } }),
    prisma.lead.count({ where: { status: "new" } }),
    prisma.proposalRequest.count({ where: { status: "new" } }),
  ]);

  return {
    "/admin/messages": messages,
    "/admin/leads": leads,
    "/admin/proposals": proposals,
  };
}

export function getTotalAdminNotifications(counts: AdminNotificationCounts): number {
  return counts["/admin/messages"] + counts["/admin/leads"] + counts["/admin/proposals"];
}

export const FORM_TYPE_LABELS: Record<string, string> = {
  contact: "Contact",
  service_inquiry: "Service inquiry",
  project_inquiry: "Project inquiry",
  proposal: "Proposal",
  landing_page: "Landing page",
  lead_magnet: "Lead magnet",
  newsletter: "Newsletter",
  blog_cta: "Blog CTA",
  manual: "Manual",
};

export function getFormTypeLabel(formType: string): string {
  return FORM_TYPE_LABELS[formType] ?? formType.replace(/_/g, " ");
}
