import AdminSidebar from "@/components/admin/AdminSidebar";
import { ToastProvider } from "@/components/admin/ToastProvider";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { canAccessPath } from "@/lib/permissions";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session) {
    redirect("/admin/login");
  }

  return (
    <ToastProvider>
      <div className="admin-shell">
        <AdminSidebar role={session.role} email={session.email} />
        <div className="admin-main">{children}</div>
      </div>
    </ToastProvider>
  );
}
