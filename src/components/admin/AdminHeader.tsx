type AdminHeaderProps = {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
};

export default function AdminHeader({ title, subtitle, children }: AdminHeaderProps) {
  return (
    <header className="admin-header">
      <div className="admin-header-copy">
        <h1 className="admin-header-title">{title}</h1>
        {subtitle ? <p className="admin-header-subtitle">{subtitle}</p> : null}
      </div>
      {children ? <div className="admin-header-actions">{children}</div> : null}
    </header>
  );
}
