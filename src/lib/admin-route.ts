import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdmin, type AdminSession } from "@/lib/auth";
import {
  hasPermission,
  type Permission,
} from "@/lib/permissions";
import { isValidOrigin } from "@/lib/sanitize";

export function unauthorizedResponse() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

export function forbiddenResponse() {
  return NextResponse.json({ error: "Forbidden" }, { status: 403 });
}

export async function withAdmin(
  handler: (session: AdminSession) => Promise<Response>,
  permission?: Permission,
): Promise<Response> {
  try {
    const session = await requireAdmin();
    if (permission && !hasPermission(session.role, permission)) {
      return forbiddenResponse();
    }
    return await handler(session);
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return unauthorizedResponse();
    }
    throw error;
  }
}

export function revalidatePublicSite() {
  const paths = [
    "/",
    "/ar",
    "/contact",
    "/ar/contact",
    "/projects",
    "/ar/projects",
    "/blog",
    "/ar/blog",
    "/legal/terms-and-conditions",
    "/ar/legal/terms-and-conditions",
    "/legal/privacy-policy",
    "/ar/legal/privacy-policy",
  ];

  for (const path of paths) {
    revalidatePath(path, "layout");
    revalidatePath(path, "page");
  }
}

export async function withAdminMutation(
  request: Request,
  handler: (session: AdminSession) => Promise<Response>,
  permission?: Permission,
): Promise<Response> {
  if (!isValidOrigin(request)) {
    return NextResponse.json({ error: "Invalid origin" }, { status: 403 });
  }
  const response = await withAdmin(handler, permission);
  if (response.ok) {
    revalidatePublicSite();
  }
  return response;
}

export function jsonError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

export function getClientIp(request: Request): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}
