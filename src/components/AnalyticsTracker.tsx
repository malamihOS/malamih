"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useLocale } from "@/context/LocaleProvider";

function getSessionId() {
  if (typeof window === "undefined") return "";
  const key = "malamih_analytics_sid";
  let sid = sessionStorage.getItem(key);
  if (!sid) {
    sid = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    sessionStorage.setItem(key, sid);
  }
  return sid;
}

export default function AnalyticsTracker() {
  const pathname = usePathname();
  const { locale } = useLocale();
  const lastPath = useRef("");

  useEffect(() => {
    if (!pathname || pathname.startsWith("/admin")) return;
    if (lastPath.current === pathname) return;
    lastPath.current = pathname;

    const payload = {
      eventType: "page_view" as const,
      path: pathname,
      locale,
      referrer: document.referrer,
      sessionId: getSessionId(),
    };

    void fetch("/api/analytics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      keepalive: true,
    }).catch(() => {});
  }, [pathname, locale]);

  return null;
}
