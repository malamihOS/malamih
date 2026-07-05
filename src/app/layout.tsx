import type { Metadata } from "next";
import localFont from "next/font/local";
import SmoothScroll from "@/components/SmoothScroll";
import PageTransitionProvider from "@/components/PageTransitionProvider";
import TrackingScripts from "@/components/TrackingScripts";
import { createSiteMetadata } from "@/i18n/metadata";
import "lenis/dist/lenis.css";
import "./globals.css";
import "./view-transitions.css";

const interDisplay = localFont({
  src: [
    {
      path: "../../public/fonts/InterDisplay-Thin.woff2",
      weight: "100",
      style: "normal",
    },
    {
      path: "../../public/fonts/InterDisplay-ThinItalic.woff2",
      weight: "100",
      style: "italic",
    },
    {
      path: "../../public/fonts/InterDisplay-ExtraLight.woff2",
      weight: "200",
      style: "normal",
    },
    {
      path: "../../public/fonts/InterDisplay-ExtraLightItalic.woff2",
      weight: "200",
      style: "italic",
    },
    {
      path: "../../public/fonts/InterDisplay-Light.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "../../public/fonts/InterDisplay-LightItalic.woff2",
      weight: "300",
      style: "italic",
    },
    {
      path: "../../public/fonts/InterDisplay-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/InterDisplay-Italic.woff2",
      weight: "400",
      style: "italic",
    },
    {
      path: "../../public/fonts/InterDisplay-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/fonts/InterDisplay-MediumItalic.woff2",
      weight: "500",
      style: "italic",
    },
    {
      path: "../../public/fonts/InterDisplay-SemiBold.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../public/fonts/InterDisplay-SemiBoldItalic.woff2",
      weight: "600",
      style: "italic",
    },
    {
      path: "../../public/fonts/InterDisplay-Bold.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../public/fonts/InterDisplay-BoldItalic.woff2",
      weight: "700",
      style: "italic",
    },
    {
      path: "../../public/fonts/InterDisplay-ExtraBold.woff2",
      weight: "800",
      style: "normal",
    },
    {
      path: "../../public/fonts/InterDisplay-ExtraBoldItalic.woff2",
      weight: "800",
      style: "italic",
    },
    {
      path: "../../public/fonts/InterDisplay-Black.woff2",
      weight: "900",
      style: "normal",
    },
    {
      path: "../../public/fonts/InterDisplay-BlackItalic.woff2",
      weight: "900",
      style: "italic",
    },
  ],
  variable: "--font-inter-display",
  display: "swap",
});

const janna2 = localFont({
  src: [
    { path: "../../public/fonts/Janna2-Thin.woff", weight: "100", style: "normal" },
    { path: "../../public/fonts/Janna2-Light.woff", weight: "300", style: "normal" },
    { path: "../../public/fonts/Janna2-Regular.woff", weight: "400", style: "normal" },
    { path: "../../public/fonts/Janna2-Medium.woff", weight: "500", style: "normal" },
    { path: "../../public/fonts/Janna2-Bold.woff", weight: "700", style: "normal" },
    { path: "../../public/fonts/Janna2-Black.woff", weight: "900", style: "normal" },
  ],
  variable: "--font-janna2",
  display: "swap",
});

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  return createSiteMetadata("en");
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${interDisplay.variable} ${janna2.variable} h-full`} suppressHydrationWarning>
      <head>
        <TrackingScripts />
        <script
          dangerouslySetInnerHTML={{
            __html:
              "history.scrollRestoration='manual';window.scrollTo(0,0);",
          }}
        />
      </head>
      <body className="min-h-full antialiased">
        <PageTransitionProvider />
        <SmoothScroll>
          <div data-page-root>{children}</div>
        </SmoothScroll>
      </body>
    </html>
  );
}
