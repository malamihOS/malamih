import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { withAdmin, jsonError } from "@/lib/admin-route";

type RouteContext = { params: Promise<{ id: string }> };

const patchSchema = z.object({
  status: z.enum(["new", "read", "replied", "archived"]),
});

export async function GET(_request: Request, context: RouteContext) {
  return withAdmin(async () => {
    const { id } = await context.params;
    const message = await prisma.contactSubmission.findUnique({ where: { id } });
    if (!message) {
      return jsonError("Message not found", 404);
    }
    return NextResponse.json({ message });
  });
}

export async function PATCH(request: Request, context: RouteContext) {
  return withAdmin(async () => {
    const { id } = await context.params;

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return jsonError("Invalid JSON body");
    }

    const parsed = patchSchema.safeParse(body);
    if (!parsed.success) {
      return jsonError(parsed.error.issues[0]?.message ?? "Invalid input");
    }

    try {
      const message = await prisma.contactSubmission.update({
        where: { id },
        data: parsed.data,
      });
      return NextResponse.json({ message });
    } catch {
      return jsonError("Message not found", 404);
    }
  });
}

export async function DELETE(_request: Request, context: RouteContext) {
  return withAdmin(async () => {
    const { id } = await context.params;
    try {
      await prisma.contactSubmission.delete({ where: { id } });
      return NextResponse.json({ success: true });
    } catch {
      return jsonError("Message not found", 404);
    }
  });
}
