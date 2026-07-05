"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import {
  captureUtmFromSearch,
  storeUtmClient,
} from "@/lib/leads/utm";

export default function UtmCapture() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const fromUrl = captureUtmFromSearch(searchParams.toString());
    if (fromUrl.utmSource || fromUrl.utmMedium || fromUrl.utmCampaign) {
      storeUtmClient(fromUrl);
    }
  }, [searchParams]);

  return null;
}
