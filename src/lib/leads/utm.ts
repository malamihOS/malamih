import type { UtmParams } from "@/lib/leads/types";

export const UTM_STORAGE_KEY = "malamih_utm";

export function parseUtmFromBody(body: Record<string, unknown>): UtmParams {
  return {
    utmSource: String(body.utmSource ?? body.utm_source ?? "").slice(0, 200),
    utmMedium: String(body.utmMedium ?? body.utm_medium ?? "").slice(0, 200),
    utmCampaign: String(body.utmCampaign ?? body.utm_campaign ?? "").slice(0, 200),
    utmContent: String(body.utmContent ?? body.utm_content ?? "").slice(0, 200),
    utmTerm: String(body.utmTerm ?? body.utm_term ?? "").slice(0, 200),
  };
}

export function utmFields(utm: UtmParams) {
  return {
    utmSource: utm.utmSource ?? "",
    utmMedium: utm.utmMedium ?? "",
    utmCampaign: utm.utmCampaign ?? "",
    utmContent: utm.utmContent ?? "",
    utmTerm: utm.utmTerm ?? "",
  };
}

export function captureUtmFromSearch(search: string): UtmParams {
  const params = new URLSearchParams(search);
  const utm: UtmParams = {};
  const source = params.get("utm_source");
  const medium = params.get("utm_medium");
  const campaign = params.get("utm_campaign");
  const content = params.get("utm_content");
  const term = params.get("utm_term");
  if (source) utm.utmSource = source;
  if (medium) utm.utmMedium = medium;
  if (campaign) utm.utmCampaign = campaign;
  if (content) utm.utmContent = content;
  if (term) utm.utmTerm = term;
  return utm;
}

export function storeUtmClient(utm: UtmParams) {
  if (typeof window === "undefined") return;
  if (!utm.utmSource && !utm.utmMedium && !utm.utmCampaign) return;
  sessionStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(utm));
}

export function readStoredUtmClient(): UtmParams {
  if (typeof window === "undefined") return {};
  try {
    const raw = sessionStorage.getItem(UTM_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as UtmParams) : {};
  } catch {
    return {};
  }
}
