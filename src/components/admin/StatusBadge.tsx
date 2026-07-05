type StatusBadgeProps = {
  status: string;
};

const STATUS_CLASS: Record<string, string> = {
  new: "admin-badge-new",
  read: "admin-badge-read",
  replied: "admin-badge-published",
  archived: "admin-badge-archived",
  hot: "admin-badge-new",
  warm: "admin-badge-read",
  cold: "admin-badge-archived",
  active: "admin-badge-published",
  published: "admin-badge-published",
  draft: "admin-badge-draft",
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  const cls = STATUS_CLASS[status] ?? "admin-badge-read";
  return (
    <span className={`admin-badge ${cls}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}
