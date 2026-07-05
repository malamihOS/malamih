"use client";

import Link from "next/link";

export default function AdminError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="admin-content">
      <div className="admin-card">
        <h2 className="admin-card-title">Something went wrong</h2>
        <p className="admin-inline-hint">
          An error occurred while loading this admin page.
        </p>
        <div className="admin-form-actions" style={{ marginTop: "1rem" }}>
          <button
            type="button"
            className="admin-btn admin-btn-primary"
            onClick={() => reset()}
          >
            Try again
          </button>
          <Link href="/admin" className="admin-btn admin-btn-secondary">
            Back to dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
