"use client";

import ErrorPageContent from "@/views/ErrorPageContent";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <ErrorPageContent onRetry={() => reset()} />;
}
