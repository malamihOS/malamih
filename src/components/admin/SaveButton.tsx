"use client";

type SaveButtonProps = {
  loading?: boolean;
  error?: string | null;
  success?: string | null;
  label?: string;
  type?: "submit" | "button";
  onClick?: () => void;
};

export default function SaveButton({
  loading = false,
  error,
  success,
  label = "Save changes",
  type = "submit",
  onClick,
}: SaveButtonProps) {
  return (
    <div>
      {error ? <div className="admin-alert admin-alert-error">{error}</div> : null}
      {success ? <div className="admin-alert admin-alert-success">{success}</div> : null}
      <button
        type={type}
        className="admin-btn admin-btn-primary"
        disabled={loading}
        onClick={onClick}
      >
        {loading ? "Saving…" : label}
      </button>
    </div>
  );
}
