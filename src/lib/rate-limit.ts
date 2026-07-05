import { prisma } from "@/lib/prisma";

const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000;

export async function recordLoginAttempt(
  email: string,
  ipAddress: string,
  success: boolean,
) {
  await prisma.loginAttempt.create({
    data: { email: email.toLowerCase(), ipAddress, success },
  });
}

export async function isLoginRateLimited(
  email: string,
  ipAddress: string,
): Promise<{ limited: boolean; retryAfterMs?: number }> {
  const since = new Date(Date.now() - WINDOW_MS);

  const failedByEmail = await prisma.loginAttempt.count({
    where: {
      email: email.toLowerCase(),
      success: false,
      createdAt: { gte: since },
    },
  });

  const failedByIp = await prisma.loginAttempt.count({
    where: {
      ipAddress,
      success: false,
      createdAt: { gte: since },
    },
  });

  if (failedByEmail >= MAX_ATTEMPTS || failedByIp >= MAX_ATTEMPTS * 2) {
    return { limited: true, retryAfterMs: WINDOW_MS };
  }

  return { limited: false };
}

export async function isContactRateLimited(
  ipAddress: string,
): Promise<boolean> {
  const since = new Date(Date.now() - 60 * 60 * 1000);
  const count = await prisma.contactSubmission.count({
    where: {
      createdAt: { gte: since },
    },
  });
  // Simple global throttle - also check IP via analytics if needed
  // Per-IP: store in memory map or separate table - use LoginAttempt pattern
  void ipAddress;
  return count > 500;
}

const contactIpAttempts = new Map<string, { count: number; resetAt: number }>();

export function isContactIpLimited(ipAddress: string): boolean {
  const now = Date.now();
  const entry = contactIpAttempts.get(ipAddress);

  if (!entry || entry.resetAt < now) {
    contactIpAttempts.set(ipAddress, { count: 1, resetAt: now + 60 * 60 * 1000 });
    return false;
  }

  entry.count += 1;
  return entry.count > 10;
}
