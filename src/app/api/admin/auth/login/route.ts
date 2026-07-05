import { NextResponse } from "next/server";
import { z } from "zod";
import { loginAdmin } from "@/lib/auth";
import { jsonError, getClientIp } from "@/lib/admin-route";
import {
  isLoginRateLimited,
  recordLoginAttempt,
} from "@/lib/rate-limit";
import { sanitizeEmail } from "@/lib/sanitize";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1).max(128),
});

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonError("Invalid JSON body");
  }

  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError(parsed.error.issues[0]?.message ?? "Invalid input");
  }

  const email = sanitizeEmail(parsed.data.email);
  const ip = getClientIp(request);

  const rateLimit = await isLoginRateLimited(email, ip);
  if (rateLimit.limited) {
    return NextResponse.json(
      { error: "Too many login attempts. Please try again later." },
      { status: 429 },
    );
  }

  const admin = await loginAdmin(email, parsed.data.password);
  if (!admin) {
    await recordLoginAttempt(email, ip, false);
    return NextResponse.json(
      { error: "Invalid email or password" },
      { status: 401 },
    );
  }

  await recordLoginAttempt(email, ip, true);
  return NextResponse.json({ admin });
}
