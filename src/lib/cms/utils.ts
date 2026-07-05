export function parseJson<T>(value: string, fallback: T): T {
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

export function pickLocale<T extends Record<string, unknown>>(
  en: T[keyof T],
  ar: T[keyof T],
  locale: "en" | "ar",
): T[keyof T] {
  return locale === "ar" ? ar : en;
}

export function pick(en: string, ar: string, locale: "en" | "ar") {
  return locale === "ar" ? ar : en;
}
