import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getDeviceType } from "@/lib/upload";
import { jsonError, getClientIp } from "@/lib/admin-route";

const eventSchema = z.object({
  eventType: z.enum(["page_view", "visit"]).default("page_view"),
  path: z.string().min(1).max(500),
  locale: z.enum(["en", "ar"]).default("en"),
  referrer: z.string().max(2000).optional().default(""),
  sessionId: z.string().max(100).optional().default(""),
});

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonError("Invalid JSON body");
  }

  const parsed = eventSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError(parsed.error.issues[0]?.message ?? "Invalid input");
  }

  const userAgent = request.headers.get("user-agent") ?? "";
  const referrer =
    parsed.data.referrer || request.headers.get("referer") || "";

  await prisma.analyticsEvent.create({
    data: {
      eventType: parsed.data.eventType,
      path: parsed.data.path,
      locale: parsed.data.locale,
      referrer: referrer.slice(0, 2000),
      userAgent: userAgent.slice(0, 500),
      deviceType: getDeviceType(userAgent),
      sessionId: parsed.data.sessionId,
    },
  });

  void getClientIp(request);
  return NextResponse.json({ ok: true });
}
