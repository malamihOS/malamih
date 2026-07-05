import DisableAdminPageTransitions from "@/components/admin/DisableAdminPageTransitions";
import "./admin.css";

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="admin-root">
      <DisableAdminPageTransitions />
      {children}
    </div>
  );
}
