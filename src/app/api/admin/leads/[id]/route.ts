import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import {
  withAdmin,
  withAdminMutation,
  jsonError,
} from "@/lib/admin-route";
import { LEAD_PRIORITIES, LEAD_STATUSES } from "@/lib/leads/types";
import { sanitizeText } from "@/lib/sanitize";

type RouteContext = { params: Promise<{ id: string }> };

const patchSchema = z.object({
  status: z.enum(LEAD_STATUSES as [string, ...string[]]).optional(),
  priority: z.enum(LEAD_PRIORITIES as [string, ...string[]]).optional(),
  assignedTo: z.string().optional(),
  notes: z.string().optional(),
  nextFollowUpDate: z.string().nullable().optional(),
  lastContactDate: z.string().nullable().optional(),
});

export async function GET(_request: Request, context: RouteContext) {
  return withAdmin(
    async () => {
      const { id } = await context.params;
      const lead = await prisma.lead.findUnique({
        where: { id },
        include: {
          submissions: { orderBy: { createdAt: "desc" }, take: 10 },
          proposals: { orderBy: { createdAt: "desc" } },
          magnetDownloads: { orderBy: { createdAt: "desc" }, take: 5 },
        },
      });
      if (!lead) return jsonError("Lead not found", 404);
      return NextResponse.json({ lead });
    },
    "leads",
  );
}

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

      const data: Record<string, unknown> = {};
      if (parsed.data.status) data.status = parsed.data.status;
      if (parsed.data.priority) data.priority = parsed.data.priority;
      if (parsed.data.assignedTo !== undefined) {
        data.assignedTo = sanitizeText(parsed.data.assignedTo, 100);
      }
      if (parsed.data.notes !== undefined) {
        data.notes = sanitizeText(parsed.data.notes, 10000);
      }
      if (parsed.data.nextFollowUpDate !== undefined) {
        data.nextFollowUpDate = parsed.data.nextFollowUpDate
          ? new Date(parsed.data.nextFollowUpDate)
          : null;
      }
      if (parsed.data.lastContactDate !== undefined) {
        data.lastContactDate = parsed.data.lastContactDate
          ? new Date(parsed.data.lastContactDate)
          : null;
      }

      try {
        const lead = await prisma.lead.update({ where: { id }, data });
        return NextResponse.json({ lead });
      } catch {
        return jsonError("Lead not found", 404);
      }
    },
    "leads",
  );
}

export async function DELETE(request: Request, context: RouteContext) {
  return withAdminMutation(
    request,
    async () => {
      const { id } = await context.params;
      try {
        await prisma.lead.delete({ where: { id } });
        return NextResponse.json({ success: true });
      } catch {
        return jsonError("Lead not found", 404);
      }
    },
    "leads",
  );
}
