export const SERVICE_INQUIRY_MAP: Record<string, string> = {
  "01": "branding",
  "02": "content-production",
  "03": "digital-marketing",
  "04": "web-development",
  "05": "business-automation",
  "08": "consulting",
};

export function getServiceInquirySlug(serviceNumber: string): string | null {
  return SERVICE_INQUIRY_MAP[serviceNumber] ?? null;
}
