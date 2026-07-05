type AdminHeaderProps = {
  title: string;
  children?: React.ReactNode;
};

export default function AdminHeader({ title, children }: AdminHeaderProps) {
  return (
    <header className="admin-header">
      <h1 className="admin-header-title">{title}</h1>
      {children ? <div>{children}</div> : null}
    </header>
  );
}
