import type { NextConfig } from "next";

function getR2RemotePattern() {
  const publicUrl = process.env.R2_PUBLIC_URL;
  if (!publicUrl) return null;

  try {
    const { hostname, protocol } = new URL(publicUrl);
    if (protocol !== "https:" && protocol !== "http:") return null;
    return {
      protocol: protocol.replace(":", "") as "http" | "https",
      hostname,
    };
  } catch {
    return null;
  }
}

const r2Pattern = getR2RemotePattern();

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "framerusercontent.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      ...(r2Pattern ? [r2Pattern] : []),
    ],
  },
};

export default nextConfig;
