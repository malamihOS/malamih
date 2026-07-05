import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { calculateLeadScore, derivePriority } from "@/lib/leads/scoring";
import {
  withAdmin,
  withAdminMutation,
  jsonError,
} from "@/lib/admin-route";
import { LEAD_PRIORITIES, LEAD_STATUSES } from "@/lib/leads/types";
import { sanitizeEmail, sanitizeText } from "@/lib/sanitize";

const createSchema = z.object({
  fullName: z.string().min(1),
  email: z.string().email(),
  companyName: z.string().optional().default(""),
  phone: z.string().optional().default(""),
  whatsApp: z.string().optional().default(""),
  city: z.string().optional().default(""),
  country: z.string().optional().default(""),
  industry: z.string().optional().default(""),
  leadSource: z.string().optional().default("manual"),
  interestedServices: z.array(z.string()).optional().default([]),
  budgetRange: z.string().optional().default(""),
  notes: z.string().optional().default(""),
  status: z.enum(LEAD_STATUSES as [string, ...string[]]).optional().default("new"),
  priority: z.enum(LEAD_PRIORITIES as [string, ...string[]]).optional().default("medium"),
  assignedTo: z.string().optional().default(""),
  nextFollowUpDate: z.string().optional().nullable(),
});

export async function GET(request: Request) {
  return withAdmin(
    async () => {
      const { searchParams } = new URL(request.url);
      const status = searchParams.get("status") ?? "";
      const quality = searchParams.get("quality") ?? "";
      const source = searchParams.get("source") ?? "";

      const leads = await prisma.lead.findMany({
        where: {
          ...(status ? { status } : {}),
          ...(quality ? { qualityLabel: quality } : {}),
          ...(source ? { leadSource: source } : {}),
        },
        orderBy: { updatedAt: "desc" },
      });

      return NextResponse.json({ leads });
    },
    "leads",
  );
}

export async function POST(request: Request) {
  return withAdminMutation(
    request,
    async () => {
      let body: unknown;
      try {
        body = await request.json();
      } catch {
        return jsonError("Invalid JSON body");
      }

      const parsed = createSchema.safeParse(body);
      if (!parsed.success) {
        return jsonError(parsed.error.issues[0]?.message ?? "Invalid input");
      }

      const d = parsed.data;
      const { score, qualityLabel } = calculateLeadScore({
        email: d.email,
        phone: d.phone,
        company: d.companyName,
        message: d.notes,
        budgetRange: d.budgetRange,
        interestedServices: d.interestedServices,
        leadSource: d.leadSource,
        formType: "manual",
        hasWhatsApp: Boolean(d.whatsApp),
        city: d.city,
        country: d.country,
        industry: d.industry,
      });

      const lead = await prisma.lead.create({
        data: {
          fullName: sanitizeText(d.fullName, 200),
          email: sanitizeEmail(d.email),
          companyName: sanitizeText(d.companyName, 200),
          phone: sanitizeText(d.phone, 50),
          whatsApp: sanitizeText(d.whatsApp, 50),
          city: sanitizeText(d.city, 100),
          country: sanitizeText(d.country, 100),
          industry: sanitizeText(d.industry, 100),
          leadSource: d.leadSource,
          interestedServices: JSON.stringify(d.interestedServices),
          budgetRange: sanitizeText(d.budgetRange, 50),
          notes: sanitizeText(d.notes, 10000),
          status: d.status,
          priority: d.priority || derivePriority(score),
          assignedTo: sanitizeText(d.assignedTo, 100),
          score,
          qualityLabel,
          nextFollowUpDate: d.nextFollowUpDate
            ? new Date(d.nextFollowUpDate)
            : null,
        },
      });

      return NextResponse.json({ lead }, { status: 201 });
    },
    "leads",
  );
}
