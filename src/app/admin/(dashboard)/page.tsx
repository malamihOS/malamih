import Link from "next/link";
import AdminHeader from "@/components/admin/AdminHeader";
import { prisma } from "@/lib/prisma";

const MODULES = [
  { href: "/admin/leads", title: "Leads CRM", desc: "Pipeline, scoring & follow-ups" },
  { href: "/admin/messages", title: "Messages", desc: "Contact form submissions" },
  { href: "/admin/newsletter", title: "Newsletter", desc: "Email subscribers" },
  { href: "/admin/proposals", title: "Proposals", desc: "Proposal requests" },
  { href: "/admin/lead-magnets", title: "Lead Magnets", desc: "Downloadable resources" },
  { href: "/admin/landing-pages", title: "Landing Pages", desc: "Campaign landing pages" },
  { href: "/admin/hero", title: "Hero", desc: "Homepage hero section & slides" },
  { href: "/admin/blog", title: "Blog", desc: "Blog posts & categories" },
  { href: "/admin/analytics", title: "Analytics", desc: "Visits, pages & submissions" },
  { href: "/admin/export", title: "Backup & Export", desc: "Export CMS & growth data" },
];

export default async function AdminDashboardPage() {
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const now = new Date();

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
      select: { leadSource: true, interestedServices: true },
    }),
  ]);

  const serviceCounts: Record<string, number> = {};
  const sourceCounts: Record<string, number> = {};
  for (const lead of leads) {
    sourceCounts[lead.leadSource] = (sourceCounts[lead.leadSource] ?? 0) + 1;
    try {
      for (const s of JSON.parse(lead.interestedServices) as string[]) {
        serviceCounts[s] = (serviceCounts[s] ?? 0) + 1;
      }
    } catch {
      // skip
    }
  }

  const topService = Object.entries(serviceCounts).sort((a, b) => b[1] - a[1])[0];
  const topSource = Object.entries(sourceCounts).sort((a, b) => b[1] - a[1])[0];

  return (
    <>
      <AdminHeader title="Dashboard" />
      <div className="admin-content">
        <div className="admin-card">
          <h2 className="admin-card-title">Growth overview</h2>
          <div className="admin-grid admin-grid-3">
            <div>
              <p className="admin-inline-hint">Total leads</p>
              <p className="admin-stat">{totalLeads}</p>
              <Link href="/admin/leads" className="admin-btn admin-btn-secondary admin-btn-sm">
                View CRM
              </Link>
            </div>
            <div>
              <p className="admin-inline-hint">New leads (7 days)</p>
              <p className="admin-stat">{newLeadsWeek}</p>
            </div>
            <div>
              <p className="admin-inline-hint">Hot leads</p>
              <p className="admin-stat">{hotLeads}</p>
            </div>
            <div>
              <p className="admin-inline-hint">New messages</p>
              <p className="admin-stat">{contactSubmissions}</p>
            </div>
            <div>
              <p className="admin-inline-hint">Newsletter subscribers</p>
              <p className="admin-stat">{newsletterActive}</p>
            </div>
            <div>
              <p className="admin-inline-hint">Proposal requests</p>
              <p className="admin-stat">{proposalRequests}</p>
            </div>
            <div>
              <p className="admin-inline-hint">Upcoming follow-ups</p>
              <p className="admin-stat">{upcomingFollowUps}</p>
              <Link href="/admin/leads/follow-ups" className="admin-btn admin-btn-secondary admin-btn-sm">
                View reminders
              </Link>
            </div>
            <div>
              <p className="admin-inline-hint">Overdue follow-ups</p>
              <p className="admin-stat">{overdueFollowUps}</p>
            </div>
            <div>
              <p className="admin-inline-hint">Top service</p>
              <p className="admin-stat" style={{ fontSize: "1.25rem" }}>
                {topService ? `${topService[0]} (${topService[1]})` : "—"}
              </p>
            </div>
          </div>
          {topSource ? (
            <p className="admin-inline-hint" style={{ marginTop: "1rem" }}>
              Top lead source: {topSource[0]} ({topSource[1]} leads)
            </p>
          ) : null}
        </div>

        <h2 className="admin-card-title">Modules</h2>
        <div className="admin-dashboard-grid">
          {MODULES.map((mod) => (
            <Link key={mod.href} href={mod.href} className="admin-dashboard-card">
              <h3>{mod.title}</h3>
              <p>{mod.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
