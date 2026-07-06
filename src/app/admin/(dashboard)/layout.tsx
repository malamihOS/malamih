import AdminShell from "@/components/admin/AdminShell";
import { ToastProvider } from "@/components/admin/ToastProvider";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

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
      <AdminShell role={session.role} email={session.email}>
        {children}
      </AdminShell>
    </ToastProvider>
  );
}
