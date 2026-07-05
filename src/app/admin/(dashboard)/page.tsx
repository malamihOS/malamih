import Link from "next/link";
import AdminHeader from "@/components/admin/AdminHeader";
import { ADMIN_NAV_SECTIONS } from "@/lib/admin-nav";
import { prisma } from "@/lib/prisma";

const QUICK_STATS = [
  { key: "leads", label: "Total leads", href: "/admin/leads", cta: "Open CRM" },
  { key: "newLeads", label: "New leads (7 days)" },
  { key: "hot", label: "Hot leads" },
  { key: "messages", label: "New messages", href: "/admin/messages", cta: "View inbox" },
  { key: "newsletter", label: "Newsletter subscribers" },
  { key: "proposals", label: "Proposal requests" },
  { key: "followUps", label: "Upcoming follow-ups", href: "/admin/leads/follow-ups", cta: "Reminders" },
  { key: "overdue", label: "Overdue follow-ups", warn: true },
] as const;

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

  const statValues: Record<(typeof QUICK_STATS)[number]["key"], number> = {
    leads: totalLeads,
    newLeads: newLeadsWeek,
    hot: hotLeads,
    messages: contactSubmissions,
    newsletter: newsletterActive,
    proposals: proposalRequests,
    followUps: upcomingFollowUps,
    overdue: overdueFollowUps,
  };

  const serviceCounts: Record<string, number> = {};
  const sourceCounts: Record<string, number> = {};
  for (const lead of leads) {
    sourceCounts[lead.leadSource] = (sourceCounts[lead.leadSource] ?? 0) + 1;
    try {
      for (const s of JSON.parse(lead.interestedServices) as string[]) {
        serviceCounts[s] = (serviceCounts[s] ?? 0) + 1;
      }
    } catch {
      // skip invalid JSON
    }
  }

  const topService = Object.entries(serviceCounts).sort((a, b) => b[1] - a[1])[0];
  const topSource = Object.entries(sourceCounts).sort((a, b) => b[1] - a[1])[0];

  const navSections = ADMIN_NAV_SECTIONS.filter((section) => section.id !== "overview");

  return (
    <>
      <AdminHeader
        title="Dashboard"
        subtitle="Overview of leads, messages, and quick access to every admin section."
      />
      <div className="admin-content">
        <div className="admin-card">
          <div className="admin-card-head">
            <h2 className="admin-card-title">Growth overview</h2>
            <p className="admin-card-desc">Key numbers from the last 7 days and your CRM pipeline.</p>
          </div>
          <div className="admin-stat-grid">
            {QUICK_STATS.map((stat) => (
              <div
                key={stat.key}
                className={`admin-stat-tile${"warn" in stat && stat.warn && statValues[stat.key] > 0 ? " admin-stat-tile-warn" : ""}`}
              >
                <p className="admin-stat-tile-label">{stat.label}</p>
                <p className="admin-stat-tile-value">{statValues[stat.key]}</p>
                {"href" in stat && stat.href ? (
                  <Link href={stat.href} className="admin-stat-tile-link">
                    {stat.cta}
                  </Link>
                ) : null}
              </div>
            ))}
          </div>
          {(topService || topSource) && (
            <div className="admin-insight-row">
              {topService ? (
                <p className="admin-inline-hint">
                  Top service interest: <strong>{topService[0]}</strong> ({topService[1]} leads)
                </p>
              ) : null}
              {topSource ? (
                <p className="admin-inline-hint">
                  Top lead source: <strong>{topSource[0]}</strong> ({topSource[1]} leads)
                </p>
              ) : null}
            </div>
          )}
        </div>

        {navSections.map((section, index) => (
          <section key={section.id} className="admin-dashboard-section">
            <div className="admin-dashboard-section-head">
              <span className="admin-dashboard-section-badge">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div className="admin-dashboard-section-copy">
                <h2 className="admin-dashboard-section-title">{section.title}</h2>
                <p className="admin-dashboard-section-desc">{section.description}</p>
              </div>
            </div>
            <div className="admin-dashboard-grid">
              {section.items.map((item) => (
                <Link key={item.href} href={item.href} className="admin-dashboard-card">
                  <span className="admin-dashboard-card-kicker">{section.title}</span>
                  <h3>{item.label}</h3>
                  <p>{item.description}</p>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </>
  );
}
