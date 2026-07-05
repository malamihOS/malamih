"use client";

import Link from "next/link";
import { useLocale } from "@/context/LocaleProvider";
import type { BlogContentBlock } from "@/lib/blog/types";
import styles from "./BlogContent.module.css";

function renderInlineLinks(text: string, localizePath: (path: string) => string) {
  const pattern = /\[([^\]]+)\]\(([^)]+)\)/g;
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    const href = match[2].startsWith("#")
      ? `${localizePath("/")}${match[2]}`
      : localizePath(match[2]);
    parts.push(
      <Link key={`${match.index}-${match[1]}`} href={href} className={styles.inlineLink}>
        {match[1]}
      </Link>,
    );
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts.length > 0 ? parts : text;
}

export default function BlogContent({ blocks }: { blocks: BlogContentBlock[] }) {
  const { localizePath } = useLocale();

  return (
    <div className={styles.content}>
      {blocks.map((block, index) => {
        if (block.type === "heading") {
          const Tag = block.level === 2 ? "h2" : "h3";
          return (
            <Tag key={index} className={block.level === 2 ? styles.h2 : styles.h3}>
              {block.text}
            </Tag>
          );
        }

        if (block.type === "list") {
          return (
            <ul key={index} className={styles.list}>
              {block.items.map((item) => (
                <li key={item} className={styles.listItem}>
                  {renderInlineLinks(item, localizePath)}
                </li>
              ))}
            </ul>
          );
        }

        return (
          <p key={index} className={styles.paragraph}>
            {renderInlineLinks(block.text, localizePath)}
          </p>
        );
      })}
    </div>
  );
}
