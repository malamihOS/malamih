import { NextResponse } from "next/server";
import { unlink } from "fs/promises";
import path from "path";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { UPLOAD_DIR } from "@/lib/upload";
import {
  withAdmin,
  withAdminMutation,
  jsonError,
} from "@/lib/admin-route";

type RouteContext = { params: Promise<{ id: string }> };

const patchSchema = z.object({
  originalName: z.string().min(1).max(255).optional(),
  altEn: z.string().max(500).optional(),
  altAr: z.string().max(500).optional(),
});

export async function PATCH(request: Request, context: RouteContext) {
  return withAdminMutation(
    request,
    async () => {
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
        const media = await prisma.mediaFile.update({
          where: { id },
          data: parsed.data,
        });
        return NextResponse.json({ media });
      } catch {
        return jsonError("File not found", 404);
      }
    },
    "media",
  );
}

export async function DELETE(request: Request, context: RouteContext) {
  return withAdminMutation(
    request,
    async () => {
      const { id } = await context.params;
      const media = await prisma.mediaFile.findUnique({ where: { id } });
      if (!media) return jsonError("File not found", 404);

      try {
        await unlink(path.join(UPLOAD_DIR, media.filename));
      } catch {
        // File may already be removed from disk
      }

      await prisma.mediaFile.delete({ where: { id } });
      return NextResponse.json({ success: true });
    },
    "media",
  );
}

export async function GET(_request: Request, context: RouteContext) {
  return withAdmin(
    async () => {
      const { id } = await context.params;
      const media = await prisma.mediaFile.findUnique({ where: { id } });
      if (!media) return jsonError("File not found", 404);
      return NextResponse.json({ media });
    },
    "media",
  );
}
