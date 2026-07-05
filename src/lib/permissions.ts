export type AdminRole = "super_admin" | "admin" | "editor";

export type Permission =
  | "dashboard"
  | "hero"
  | "why"
  | "logos"
  | "team"
  | "projects"
  | "blog"
  | "services"
  | "contact"
  | "messages"
  | "seo"
  | "settings"
  | "integrations"
  | "media"
  | "analytics"
  | "export"
  | "users"
  | "leads"
  | "newsletter"
  | "lead_magnets"
  | "proposals"
  | "landing_pages";

const ROLE_PERMISSIONS: Record<AdminRole, Permission[] | ["*"]> = {
  super_admin: ["*"],
  admin: [
    "dashboard",
    "hero",
    "why",
    "logos",
    "team",
    "projects",
    "blog",
    "services",
    "contact",
    "messages",
    "seo",
    "settings",
    "integrations",
    "media",
    "analytics",
    "export",
    "leads",
    "newsletter",
    "lead_magnets",
    "proposals",
    "landing_pages",
  ],
  editor: ["dashboard", "projects", "blog", "media", "leads"],
};

export function isAdminRole(value: string): value is AdminRole {
  return value === "super_admin" || value === "admin" || value === "editor";
}

export function hasPermission(role: AdminRole, permission: Permission): boolean {
  const perms = ROLE_PERMISSIONS[role];
  if (perms[0] === "*") return true;
  return (perms as Permission[]).includes(permission);
}

export function getRoleLabel(role: AdminRole): string {
  switch (role) {
    case "super_admin":
      return "Super Admin";
    case "admin":
      return "Admin";
    case "editor":
      return "Editor";
    default:
      return role;
  }
}

export const NAV_PERMISSIONS: Record<string, Permission> = {
  "/admin": "dashboard",
  "/admin/hero": "hero",
  "/admin/why": "why",
  "/admin/logos": "logos",
  "/admin/team": "team",
  "/admin/projects": "projects",
  "/admin/blog": "blog",
  "/admin/services": "services",
  "/admin/contact": "contact",
  "/admin/messages": "messages",
  "/admin/seo": "seo",
  "/admin/settings": "settings",
  "/admin/integrations": "integrations",
  "/admin/media": "media",
  "/admin/analytics": "analytics",
  "/admin/export": "export",
  "/admin/users": "users",
  "/admin/leads": "leads",
  "/admin/newsletter": "newsletter",
  "/admin/lead-magnets": "lead_magnets",
  "/admin/proposals": "proposals",
  "/admin/landing-pages": "landing_pages",
};

export function canAccessPath(role: AdminRole, path: string): boolean {
  const base = Object.keys(NAV_PERMISSIONS)
    .filter((key) => path === key || path.startsWith(`${key}/`))
    .sort((a, b) => b.length - a.length)[0];

  if (!base) return role === "super_admin";
  return hasPermission(role, NAV_PERMISSIONS[base]);
}
