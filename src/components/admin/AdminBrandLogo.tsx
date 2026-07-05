import Link from "next/link";
import MalamihLogo from "@/components/MalamihLogo";

type AdminBrandLogoProps = {
  variant?: "light" | "dark";
  centered?: boolean;
  href?: string;
};

export default function AdminBrandLogo({
  variant = "light",
  centered = false,
  href,
}: AdminBrandLogoProps) {
  const color = variant === "dark" ? "#111827" : "#ffffff";
  const className = [
    "admin-brand",
    `admin-brand--${variant}`,
    centered ? "admin-brand--centered" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const logo = <MalamihLogo className="admin-brand-logo" color={color} />;

  if (href) {
    return (
      <Link href={href} className={className} aria-label="Malamih">
        {logo}
      </Link>
    );
  }

  return (
    <div className={className} aria-label="Malamih">
      {logo}
    </div>
  );
}
