"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AdminBrandLogo from "@/components/admin/AdminBrandLogo";
import {
  NAV_PERMISSIONS,
  hasPermission,
  getRoleLabel,
  type AdminRole,
  type Permission,
} from "@/lib/permissions";

const NAV_ITEMS: { href: string; label: string; exact?: boolean }[] = [
  { href: "/admin", label: "Dashboard", exact: true },
  { href: "/admin/hero", label: "Hero" },
  { href: "/admin/why", label: "Why Malamih" },
  { href: "/admin/logos", label: "Client Logos" },
  { href: "/admin/team", label: "Team" },
  { href: "/admin/projects", label: "Projects" },
  { href: "/admin/blog", label: "Blog" },
  { href: "/admin/services", label: "Services" },
  { href: "/admin/seo", label: "Page SEO" },
  { href: "/admin/media", label: "Media Library" },
  { href: "/admin/contact", label: "Contact Settings" },
  { href: "/admin/messages", label: "Messages" },
  { href: "/admin/leads", label: "Leads CRM" },
  { href: "/admin/newsletter", label: "Newsletter" },
  { href: "/admin/lead-magnets", label: "Lead Magnets" },
  { href: "/admin/proposals", label: "Proposals" },
  { href: "/admin/landing-pages", label: "Landing Pages" },
  { href: "/admin/analytics", label: "Analytics" },
  { href: "/admin/integrations", label: "Integrations" },
  { href: "/admin/export", label: "Backup & Export" },
  { href: "/admin/settings", label: "Site Settings" },
  { href: "/admin/users", label: "Users" },
];

type AdminSidebarProps = {
  role?: AdminRole;
  email?: string;
};

export default function AdminSidebar({ role = "admin", email }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [sessionEmail, setSessionEmail] = useState(email ?? "");

  useEffect(() => {
    if (!email) {
      void fetch("/api/admin/session")
        .then((r) => r.json())
        .then((data) => {
          if (data.session?.email) setSessionEmail(data.session.email);
        })
        .catch(() => {});
    }
  }, [email]);

  const visibleItems = NAV_ITEMS.filter((item) => {
    const permission = NAV_PERMISSIONS[item.href] as Permission | undefined;
    if (!permission) return true;
    return hasPermission(role, permission);
  });

  async function handleLogout() {
    await fetch("/api/admin/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar-brand">
        <AdminBrandLogo href="/admin" />
      </div>
      {sessionEmail ? (
        <div className="admin-sidebar-user">
          <span className="admin-sidebar-user-email">{sessionEmail}</span>
          <span className="admin-sidebar-user-role">{getRoleLabel(role)}</span>
        </div>
      ) : null}
      <nav className="admin-sidebar-nav" aria-label="Admin navigation">
        {visibleItems.map((item) => {
          const active = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`admin-sidebar-link${active ? " active" : ""}`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="admin-sidebar-footer">
        <button
          type="button"
          className="admin-sidebar-link"
          style={{
            width: "100%",
            background: "none",
            border: "none",
            cursor: "pointer",
            textAlign: "left",
          }}
          onClick={handleLogout}
        >
          Log out
        </button>
      </div>
    </aside>
  );
}
