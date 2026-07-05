import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import type { AdminRole } from "@/lib/permissions";
import { isAdminRole } from "@/lib/permissions";

const SESSION_COOKIE = "malamih_admin_session";
const SESSION_DURATION = 60 * 60 * 24 * 7;

function getSecret() {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 32) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("SESSION_SECRET must be set (min 32 chars) in production");
    }
    return new TextEncoder().encode("development-secret-change-me-in-production");
  }
  return new TextEncoder().encode(secret);
}

export type AdminSession = {
  adminId: string;
  email: string;
  role: AdminRole;
  name: string;
};

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export async function createSession(admin: AdminSession) {
  const token = await new SignJWT({
    adminId: admin.adminId,
    email: admin.email,
    role: admin.role,
    name: admin.name,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DURATION}s`)
    .sign(getSecret());

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: SESSION_DURATION,
  });
}

export async function destroySession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export async function getSession(): Promise<AdminSession | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, getSecret());
    const role = payload.role as string;
    return {
      adminId: payload.adminId as string,
      email: payload.email as string,
      role: isAdminRole(role) ? role : "admin",
      name: (payload.name as string) || "",
    };
  } catch {
    return null;
  }
}

export async function requireAdmin(): Promise<AdminSession> {
  const session = await getSession();
  if (!session) {
    throw new Error("UNAUTHORIZED");
  }
  return session;
}

export async function loginAdmin(email: string, password: string) {
  const admin = await prisma.admin.findUnique({
    where: { email: email.toLowerCase() },
  });
  if (!admin) return null;

  const valid = await verifyPassword(password, admin.passwordHash);
  if (!valid) return null;

  const role = isAdminRole(admin.role) ? admin.role : "admin";
  const session: AdminSession = {
    adminId: admin.id,
    email: admin.email,
    role,
    name: admin.name,
  };

  await createSession(session);
  return { id: admin.id, email: admin.email, role, name: admin.name };
}

export { SESSION_COOKIE };
