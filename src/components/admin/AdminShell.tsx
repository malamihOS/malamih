"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import AdminBrandLogo from "@/components/admin/AdminBrandLogo";
import AdminSidebar from "@/components/admin/AdminSidebar";
import type { AdminRole } from "@/lib/permissions";

type AdminShellProps = {
  role: AdminRole;
  email?: string;
  children: React.ReactNode;
};

export default function AdminShell({ role, email, children }: AdminShellProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!mobileOpen) return;

    const html = document.documentElement;
    const previousHtmlOverflow = html.style.overflow;
    const previousBodyOverflow = document.body.style.overflow;

    html.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

    return () => {
      html.style.overflow = previousHtmlOverflow;
      document.body.style.overflow = previousBodyOverflow;
    };
  }, [mobileOpen]);

  return (
    <div className={`admin-shell${mobileOpen ? " admin-shell--menu-open" : ""}`}>
      <AdminSidebar
        role={role}
        email={email}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      {mobileOpen ? (
        <button
          type="button"
          className="admin-sidebar-backdrop"
          aria-label="Close menu"
          onClick={() => setMobileOpen(false)}
        />
      ) : null}

      <div className="admin-main">
        <div className="admin-mobile-topbar">
          <button
            type="button"
            className="admin-mobile-menu-btn"
            aria-expanded={mobileOpen}
            aria-controls="admin-sidebar"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            onClick={() => setMobileOpen((open) => !open)}
          >
            <span className="admin-mobile-menu-icon" aria-hidden>
              <span />
              <span />
              <span />
            </span>
          </button>
          <AdminBrandLogo href="/admin" />
          <span className="admin-mobile-topbar-label">Admin panel</span>
        </div>
        {children}
      </div>
    </div>
  );
}
