"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

function disablePublicTransitions() {
  delete document.documentElement.dataset.pageTransition;
  document.documentElement.style.overflow = "";
  document.body.style.overflow = "";
}

export default function DisableAdminPageTransitions() {
  const pathname = usePathname();

  useEffect(() => {
    disablePublicTransitions();
  }, []);

  useEffect(() => {
    disablePublicTransitions();
  }, [pathname]);

  return null;
}
