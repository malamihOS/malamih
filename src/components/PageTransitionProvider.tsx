"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import {
  getInternalPath,
  isAdminPath,
  isInternalLink,
  isModifiedClick,
} from "@/lib/pageTransition";

const EXIT_MS = 600;
const ENTER_DELAY_MS = 500;
const ENTER_MS = 600;

function sleep(ms: number) {
  return new Promise<void>((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function setTransitionPhase(phase: "exit" | "enter" | null) {
  const root = document.documentElement;

  if (!phase) {
    delete root.dataset.pageTransition;
    return;
  }

  root.dataset.pageTransition = phase;
}

function waitForRoute(pathname: string) {
  return new Promise<void>((resolve) => {
    const timeout = window.setTimeout(() => {
      if (pendingNavigation?.pathname === pathname) {
        pendingNavigation = null;
      }
      resolve();
    }, 3000);

    pendingNavigation = {
      pathname,
      resolve: () => {
        window.clearTimeout(timeout);
        resolve();
      },
    };
  });
}

let pendingNavigation: {
  pathname: string;
  resolve: () => void;
} | null = null;

function completeRouteNavigation(pathname: string) {
  if (!pendingNavigation || pendingNavigation.pathname !== pathname) {
    return;
  }

  pendingNavigation.resolve();
  pendingNavigation = null;
}

export default function PageTransitionProvider() {
  const router = useRouter();
  const pathname = usePathname();
  const isAnimatingRef = useRef(false);

  useEffect(() => {
    completeRouteNavigation(pathname);
  }, [pathname]);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (isAnimatingRef.current || isModifiedClick(event)) {
        return;
      }

      const target = event.target;
      if (!(target instanceof Element)) {
        return;
      }

      const anchor = target.closest("a");
      if (!(anchor instanceof HTMLAnchorElement) || !isInternalLink(anchor)) {
        return;
      }

      const href = anchor.getAttribute("href");
      if (!href) {
        return;
      }

      const nextPath = getInternalPath(href);
      const currentPath = getInternalPath(window.location.href);

      const nextPathname = new URL(href, window.location.href).pathname;
      const currentPathname = window.location.pathname;

      if (isAdminPath(currentPathname) || isAdminPath(nextPathname)) {
        return;
      }

      if (nextPath === currentPath) {
        return;
      }

      if (prefersReducedMotion()) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();

      isAnimatingRef.current = true;
      setTransitionPhase("exit");

      void (async () => {
        try {
          await sleep(EXIT_MS);

          const navigationReady = waitForRoute(nextPathname);
          router.push(nextPath);
          await navigationReady;

          setTransitionPhase("enter");

          await sleep(ENTER_DELAY_MS + ENTER_MS);
        } finally {
          setTransitionPhase(null);
          isAnimatingRef.current = false;
        }
      })();
    };

    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, [router]);

  return null;
}
