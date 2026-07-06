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
  mobileOpen?: boolean;
  onMobileClose?: () => void;
};

function isActive(pathname: string, href: string, exact?: boolean) {
  if (exact) return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function AdminSidebar({
  role = "admin",
  email,
  mobileOpen = false,
  onMobileClose,
}: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [sessionEmail, setSessionEmail] = useState(email ?? "");
  const [pendingHref, setPendingHref] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(() => new Set());

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

  useEffect(() => {
    if (!mobileOpen) return;

    setExpandedSections(new Set(sections.map((section) => section.id)));
  }, [mobileOpen, sections]);

  useEffect(() => {
    const activeSection = sections.find((section) =>
      section.items.some((item) => isActive(pathname, item.href, item.exact)),
    );

    if (!activeSection) return;

    setExpandedSections((prev) => {
      if (prev.has(activeSection.id)) return prev;
      const next = new Set(prev);
      next.add(activeSection.id);
      return next;
    });
  }, [pathname, sections]);

  const showProgress = Boolean(pendingHref);

  function toggleSection(sectionId: string) {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(sectionId)) {
        next.delete(sectionId);
      } else {
        next.add(sectionId);
      }
      return next;
    });
  }

  function handleNavigate(href: string) {
    if (isActive(pathname, href, href === "/admin")) return;
    setPendingHref(href);
    onMobileClose?.();
  }

  async function handleLogout() {
    await fetch("/api/admin/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <>
      {showProgress ? <div className="admin-route-progress" aria-hidden /> : null}

      <aside
        id="admin-sidebar"
        className={`admin-sidebar${mobileOpen ? " admin-sidebar--open" : ""}`}
      >
        <div className="admin-sidebar-brand">
          <div className="admin-sidebar-brand-row">
            <AdminBrandLogo href="/admin" />
            <button
              type="button"
              className="admin-sidebar-close"
              aria-label="Close menu"
              onClick={onMobileClose}
            >
              ×
            </button>
          </div>
          <p className="admin-sidebar-brand-label">Admin panel</p>
        </div>

        {sessionEmail ? (
          <div className="admin-sidebar-user">
            <span className="admin-sidebar-user-email">{sessionEmail}</span>
            <span className="admin-sidebar-user-role">{getRoleLabel(role)}</span>
          </div>
        ) : null}

        <nav className="admin-sidebar-nav" aria-label="Admin navigation">
          {sections.map((section, index) => {
            const isOpen = expandedSections.has(section.id);

            return (
              <div
                key={section.id}
                className={`admin-sidebar-section${isOpen ? " open" : ""}`}
              >
                <button
                  type="button"
                  className="admin-sidebar-section-toggle"
                  onClick={() => toggleSection(section.id)}
                  aria-expanded={isOpen}
                  aria-controls={`admin-nav-section-${section.id}`}
                >
                  <span className="admin-sidebar-section-badge">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="admin-sidebar-section-copy">
                    <span className="admin-sidebar-section-title">{section.title}</span>
                    <span className="admin-sidebar-section-desc">{section.description}</span>
                  </span>
                  <span className="admin-sidebar-section-chevron" aria-hidden>
                    <svg viewBox="0 0 16 16" width="14" height="14" focusable="false">
                      <path
                        d="M4 6l4 4 4-4"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.75"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </button>

                <div
                  id={`admin-nav-section-${section.id}`}
                  className="admin-sidebar-section-panel"
                  hidden={!isOpen}
                >
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
              </div>
            );
          })}
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
