"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import AdminBrandLogo from "@/components/admin/AdminBrandLogo";
import { ADMIN_NAV_SECTIONS, getNavPermission } from "@/lib/admin-nav";
import {
  hasPermission,
  getRoleLabel,
  type AdminRole,
} from "@/lib/permissions";

type AdminSidebarProps = {
  role?: AdminRole;
  email?: string;
};

function isActive(pathname: string, href: string, exact?: boolean) {
  if (exact) return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function AdminSidebar({ role = "admin", email }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [sessionEmail, setSessionEmail] = useState(email ?? "");
  const [pendingHref, setPendingHref] = useState<string | null>(null);

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

  useEffect(() => {
    setPendingHref(null);
  }, [pathname]);

  const sections = useMemo(
    () =>
      ADMIN_NAV_SECTIONS.map((section) => ({
        ...section,
        items: section.items.filter((item) => {
          const permission = getNavPermission(item.href);
          if (!permission) return true;
          return hasPermission(role, permission);
        }),
      })).filter((section) => section.items.length > 0),
    [role],
  );

  const showProgress = Boolean(pendingHref);

  function handleNavigate(href: string) {
    if (isActive(pathname, href, href === "/admin")) return;
    setPendingHref(href);
  }

  async function handleLogout() {
    await fetch("/api/admin/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <>
      {showProgress ? <div className="admin-route-progress" aria-hidden /> : null}

      <aside className="admin-sidebar">
        <div className="admin-sidebar-brand">
          <AdminBrandLogo href="/admin" />
          <p className="admin-sidebar-brand-label">Admin panel</p>
        </div>

        {sessionEmail ? (
          <div className="admin-sidebar-user">
            <span className="admin-sidebar-user-email">{sessionEmail}</span>
            <span className="admin-sidebar-user-role">{getRoleLabel(role)}</span>
          </div>
        ) : null}

        <nav className="admin-sidebar-nav" aria-label="Admin navigation">
          {sections.map((section, index) => (
            <div key={section.id} className="admin-sidebar-section">
              <div className="admin-sidebar-section-head">
                <span className="admin-sidebar-section-badge">{String(index + 1).padStart(2, "0")}</span>
                <div className="admin-sidebar-section-copy">
                  <p className="admin-sidebar-section-title">{section.title}</p>
                  <p className="admin-sidebar-section-desc">{section.description}</p>
                </div>
              </div>
              <div className="admin-sidebar-section-items">
                {section.items.map((item) => {
                  const active = isActive(pathname, item.href, item.exact);
                  const pending = pendingHref === item.href && !active;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      prefetch
                      scroll={false}
                      onClick={() => handleNavigate(item.href)}
                      className={`admin-sidebar-link${active ? " active" : ""}${pending ? " pending" : ""}`}
                      aria-current={active ? "page" : undefined}
                    >
                      <span className="admin-sidebar-link-main">
                        <span className="admin-sidebar-link-label">{item.label}</span>
                        {item.description ? (
                          <span className="admin-sidebar-link-desc">{item.description}</span>
                        ) : null}
                      </span>
                      <span className="admin-sidebar-link-arrow" aria-hidden>
                        →
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <button
            type="button"
            className="admin-sidebar-logout"
            onClick={handleLogout}
          >
            Log out
          </button>
        </div>
      </aside>
    </>
  );
}
