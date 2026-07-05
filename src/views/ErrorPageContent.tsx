"use client";

import Link from "next/link";

export default function ErrorPageContent({ onRetry }: { onRetry?: () => void }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
        background: "#111827",
        color: "#fff",
        fontFamily: "system-ui, sans-serif",
        textAlign: "center",
      }}
    >
      <div>
        <p style={{ color: "#9ca3af", marginBottom: "0.5rem" }}>Error</p>
        <h1 style={{ fontSize: "2rem", margin: "0 0 1rem" }}>Something went wrong</h1>
        <p style={{ color: "#9ca3af", marginBottom: "1.5rem", maxWidth: "28rem" }}>
          We could not load this page. Please try again or return to the homepage.
        </p>
        <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center" }}>
          {onRetry ? (
            <button
              type="button"
              onClick={onRetry}
              style={{
                padding: "0.75rem 1.25rem",
                background: "#6366f1",
                color: "#fff",
                border: "none",
                borderRadius: "0.375rem",
                cursor: "pointer",
              }}
            >
              Try again
            </button>
          ) : null}
          <Link
            href="/"
            style={{
              padding: "0.75rem 1.25rem",
              background: "transparent",
              color: "#fff",
              border: "1px solid #374151",
              borderRadius: "0.375rem",
              textDecoration: "none",
            }}
          >
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
