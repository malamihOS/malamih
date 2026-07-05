"use client";

import { ReactLenis, useLenis } from "lenis/react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

function ScrollInit() {
  const lenis = useLenis();

  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
  }, []);

  useEffect(() => {
    lenis?.scrollTo(0, { immediate: true });
  }, [lenis]);

  return null;
}

function LenisTransitionSync() {
  const lenis = useLenis();

  useEffect(() => {
    const root = document.documentElement;

    const sync = () => {
      const phase = root.dataset.pageTransition;

      if (phase === "exit") {
        lenis?.stop();
        return;
      }

      if (phase === "enter") {
        lenis?.stop();
        lenis?.scrollTo(0, { immediate: true, force: true });
        return;
      }

      lenis?.start();
    };

    sync();

    const observer = new MutationObserver(sync);
    observer.observe(root, {
      attributes: true,
      attributeFilter: ["data-page-transition"],
    });

    return () => observer.disconnect();
  }, [lenis]);

  return null;
}

function ScrollRouteReset() {
  const lenis = useLenis();
  const pathname = usePathname();

  useEffect(() => {
    if (document.documentElement.dataset.pageTransition) {
      return;
    }

    lenis?.scrollTo(0, { immediate: true, force: true });
  }, [pathname, lenis]);

  return null;
}

function NativeScrollInit() {
  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    window.scrollTo(0, 0);
  }, []);

  return null;
}

export default function SmoothScroll({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [smoothEnabled, setSmoothEnabled] = useState<boolean | null>(null);
  const isAdmin =
    pathname === "/admin" || pathname.startsWith("/admin/");

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setSmoothEnabled(!media.matches);

    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  if (smoothEnabled === null || isAdmin) {
    return (
      <>
        <NativeScrollInit />
        {children}
      </>
    );
  }

  if (!smoothEnabled) {
    return (
      <>
        <NativeScrollInit />
        {children}
      </>
    );
  }

  return (
    <ReactLenis
      root
      options={{
        lerp: 0.1,
        duration: 1.2,
        smoothWheel: true,
        autoRaf: true,
      }}
    >
      <ScrollInit />
      <ScrollRouteReset />
      <LenisTransitionSync />
      {children}
    </ReactLenis>
  );
}
