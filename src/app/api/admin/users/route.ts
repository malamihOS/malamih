import { NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import {
  withAdmin,
  withAdminMutation,
  jsonError,
} from "@/lib/admin-route";

const createUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(128),
  name: z.string().min(1).max(100),
  role: z.enum(["super_admin", "admin", "editor"]),
});

export async function GET() {
  return withAdmin(
    async (session) => {
      if (session.role !== "super_admin") {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }

      const users = await prisma.admin.findMany({
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          createdAt: true,
        },
        orderBy: { createdAt: "asc" },
      });

      return NextResponse.json({ users });
    },
    "users",
  );
}

export async function POST(request: Request) {
  return withAdminMutation(
    request,
    async (session) => {
      if (session.role !== "super_admin") {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }

      let body: unknown;
      try {
        body = await request.json();
      } catch {
        return jsonError("Invalid JSON body");
      }

      const parsed = createUserSchema.safeParse(body);
      if (!parsed.success) {
        return jsonError(parsed.error.issues[0]?.message ?? "Invalid input");
      }

      const existing = await prisma.admin.findUnique({
        where: { email: parsed.data.email.toLowerCase() },
      });
      if (existing) {
        return jsonError("Email already in use");
      }

      const passwordHash = await bcrypt.hash(parsed.data.password, 12);
      const user = await prisma.admin.create({
        data: {
          email: parsed.data.email.toLowerCase(),
          passwordHash,
          name: parsed.data.name,
          role: parsed.data.role,
        },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          createdAt: true,
        },
      });

      return NextResponse.json({ user }, { status: 201 });
    },
    "users",
  );
}

export async function DELETE(request: Request) {
  return withAdminMutation(
    request,
    async (session) => {
      if (session.role !== "super_admin") {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }

      const { searchParams } = new URL(request.url);
      const id = searchParams.get("id");
      if (!id) return jsonError("Missing user id");

      if (id === session.adminId) {
        return jsonError("Cannot delete your own account");
      }

      try {
        await prisma.admin.delete({ where: { id } });
        return NextResponse.json({ success: true });
      } catch {
        return jsonError("User not found", 404);
      }
    },
    "users",
  );
}
