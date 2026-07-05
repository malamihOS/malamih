export default function AdminDashboardLoading() {
  return (
    <>
      <header className="admin-header admin-header-skeleton">
        <div className="admin-header-copy">
          <div className="admin-skeleton admin-skeleton-title" />
          <div className="admin-skeleton admin-skeleton-subtitle" />
        </div>
      </header>
      <div className="admin-content">
        <div className="admin-card">
          <div className="admin-skeleton admin-skeleton-line" style={{ width: "40%" }} />
          <div className="admin-stat-grid" style={{ marginTop: "1rem" }}>
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="admin-stat-tile admin-skeleton-tile" />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
