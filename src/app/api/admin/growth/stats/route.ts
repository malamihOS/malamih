import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAdmin } from "@/lib/admin-route";

export async function GET() {
  return withAdmin(
    async () => {
      const now = new Date();
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

      const [
        totalLeads,
        newLeadsWeek,
        hotLeads,
        contactSubmissions,
        newsletterActive,
        proposalRequests,
        upcomingFollowUps,
        overdueFollowUps,
        leads,
      ] = await Promise.all([
        prisma.lead.count(),
        prisma.lead.count({ where: { createdAt: { gte: weekAgo } } }),
        prisma.lead.count({ where: { qualityLabel: "hot" } }),
        prisma.contactSubmission.count({ where: { status: "new" } }),
        prisma.newsletterSubscriber.count({ where: { status: "active" } }),
        prisma.proposalRequest.count(),
        prisma.lead.count({
          where: {
            nextFollowUpDate: { gte: now, lte: new Date(Date.now() + 7 * 86400000) },
          },
        }),
        prisma.lead.count({
          where: { nextFollowUpDate: { lt: now, not: null } },
        }),
        prisma.lead.findMany({
          select: {
            leadSource: true,
            interestedServices: true,
          },
        }),
      ]);

      const serviceCounts: Record<string, number> = {};
      const sourceCounts: Record<string, number> = {};

      for (const lead of leads) {
        sourceCounts[lead.leadSource] = (sourceCounts[lead.leadSource] ?? 0) + 1;
        try {
          const services = JSON.parse(lead.interestedServices) as string[];
          for (const s of services) {
            serviceCounts[s] = (serviceCounts[s] ?? 0) + 1;
          }
        } catch {
          // skip
        }
      }

      const topServices = Object.entries(serviceCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([service, count]) => ({ service, count }));

      const topSources = Object.entries(sourceCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([source, count]) => ({ source, count }));

      const followUpLeads = await prisma.lead.findMany({
        where: {
          OR: [
            { nextFollowUpDate: { gte: now, lte: new Date(Date.now() + 14 * 86400000) } },
            { nextFollowUpDate: { lt: now, not: null } },
          ],
        },
        orderBy: { nextFollowUpDate: "asc" },
        take: 10,
        select: {
          id: true,
          fullName: true,
          email: true,
          nextFollowUpDate: true,
          status: true,
          qualityLabel: true,
        },
      });

      return NextResponse.json({
        totalLeads,
        newLeadsWeek,
        hotLeads,
        contactSubmissions,
        newsletterActive,
        proposalRequests,
        upcomingFollowUps,
        overdueFollowUps,
        topServices,
        topSources,
        followUpLeads,
        remindersPlaceholder:
          "Future email/WhatsApp reminders can be configured when SMTP or WhatsApp API credentials are added.",
      });
    },
    "dashboard",
  );
}
