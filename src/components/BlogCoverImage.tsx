"use client";

import Image from "next/image";
import { useState } from "react";
import { BLOG_FALLBACK_COVER, blogImageUrl } from "@/lib/blog/media";

type BlogCoverImageProps = {
  src: string;
  alt: string;
  className?: string;
  sizes: string;
  priority?: boolean;
  loading?: "eager" | "lazy";
};

export default function BlogCoverImage({
  src,
  alt,
  className,
  sizes,
  priority = false,
  loading,
}: BlogCoverImageProps) {
  const [currentSrc, setCurrentSrc] = useState(() => blogImageUrl(src));

  return (
    <Image
      src={currentSrc}
      alt={alt}
      fill
      sizes={sizes}
      className={className}
      priority={priority}
      loading={loading}
      onError={() => {
        if (currentSrc !== BLOG_FALLBACK_COVER) {
          setCurrentSrc(BLOG_FALLBACK_COVER);
        }
      }}
    />
  );
}
