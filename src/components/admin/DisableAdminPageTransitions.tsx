"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function DisableAdminPageTransitions() {
  const pathname = usePathname();

  useEffect(() => {
    delete document.documentElement.dataset.pageTransition;
    document.documentElement.style.overflow = "";
    document.body.style.overflow = "";
  }, [pathname]);

  return null;
}
