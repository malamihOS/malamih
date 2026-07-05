"use client";

import { useCallback, useEffect, useState } from "react";
import AdminHeader from "@/components/admin/AdminHeader";

type AnalyticsData = {
  summary: {
    totalEvents: number;
    pageViews: number;
    visits: number;
    submissions: number;
    trackingConfigured: boolean;
  };
  localeBreakdown: { locale: string; count: number }[];
  deviceBreakdown: { device: string; count: number }[];
  topPages: { path: string; views: number }[];
  topBlogPosts: { path: string; views: number }[];
  topProjects: { path: string; views: number }[];
  trafficSources: { referrer: string; count: number }[];
  placeholders: {
    googleAnalytics: boolean;
    metaPixel: boolean;
    note: string;
  };
};

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/analytics");
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Failed to load analytics");
      setData(json);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load analytics");
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  if (loading) {
    return (
      <>
        <AdminHeader title="Analytics" subtitle="Traffic, page views, and conversion events." />
        <div className="admin-content">Loading…</div>
      </>
    );
  }

  if (error || !data) {
    return (
      <>
        <AdminHeader title="Analytics" subtitle="Traffic, page views, and conversion events." />
        <div className="admin-content">
          <div className="admin-alert admin-alert-error">{error ?? "No data"}</div>
        </div>
      </>
    );
  }

  return (
    <>
      <AdminHeader title="Analytics" subtitle="Traffic, page views, and conversion events." />
      <div className="admin-content">
        {!data.summary.trackingConfigured ? (
          <div className="admin-alert admin-alert-warning">
            {data.placeholders.note}{" "}
            <a href="/admin/integrations">Configure integrations →</a>
          </div>
        ) : null}

        <div className="admin-grid admin-grid-3">
          <div className="admin-card">
            <p className="admin-inline-hint">Page views (30 days)</p>
            <p className="admin-stat">{data.summary.pageViews}</p>
          </div>
          <div className="admin-card">
            <p className="admin-inline-hint">Contact submissions</p>
            <p className="admin-stat">{data.summary.submissions}</p>
          </div>
          <div className="admin-card">
            <p className="admin-inline-hint">Total tracked events</p>
            <p className="admin-stat">{data.summary.totalEvents}</p>
          </div>
        </div>

        <div className="admin-grid admin-grid-2">
          <div className="admin-card">
            <h2 className="admin-card-title">Language usage (30 days)</h2>
            {data.localeBreakdown.length === 0 ? (
              <p className="admin-inline-hint">No data yet — visits will appear as users browse the site.</p>
            ) : (
              <ul className="admin-stat-list">
                {data.localeBreakdown.map((row) => (
                  <li key={row.locale}>
                    <span>{row.locale.toUpperCase()}</span>
                    <strong>{row.count}</strong>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="admin-card">
            <h2 className="admin-card-title">Device types (30 days)</h2>
            {data.deviceBreakdown.length === 0 ? (
              <p className="admin-inline-hint">No data yet.</p>
            ) : (
              <ul className="admin-stat-list">
                {data.deviceBreakdown.map((row) => (
                  <li key={row.device}>
                    <span>{row.device}</span>
                    <strong>{row.count}</strong>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="admin-grid admin-grid-2">
          <div className="admin-card">
            <h2 className="admin-card-title">Most viewed pages</h2>
            {data.topPages.length === 0 ? (
              <p className="admin-inline-hint">No page views recorded yet.</p>
            ) : (
              <ul className="admin-stat-list">
                {data.topPages.map((row) => (
                  <li key={row.path}>
                    <span>{row.path}</span>
                    <strong>{row.views}</strong>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="admin-card">
            <h2 className="admin-card-title">Traffic sources</h2>
            {data.trafficSources.length === 0 ? (
              <p className="admin-inline-hint">Referrer data will appear when available.</p>
            ) : (
              <ul className="admin-stat-list">
                {data.trafficSources.map((row) => (
                  <li key={row.referrer}>
                    <span>{row.referrer || "Direct"}</span>
                    <strong>{row.count}</strong>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="admin-grid admin-grid-2">
          <div className="admin-card">
            <h2 className="admin-card-title">Top blog posts</h2>
            {data.topBlogPosts.length === 0 ? (
              <p className="admin-inline-hint">No blog post views yet.</p>
            ) : (
              <ul className="admin-stat-list">
                {data.topBlogPosts.map((row) => (
                  <li key={row.path}>
                    <span>{row.path}</span>
                    <strong>{row.views}</strong>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="admin-card">
            <h2 className="admin-card-title">Top projects</h2>
            {data.topProjects.length === 0 ? (
              <p className="admin-inline-hint">No project views yet.</p>
            ) : (
              <ul className="admin-stat-list">
                {data.topProjects.map((row) => (
                  <li key={row.path}>
                    <span>{row.path}</span>
                    <strong>{row.views}</strong>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
