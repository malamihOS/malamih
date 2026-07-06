"use client";

import { useEffect, useId, useRef, useState } from "react";
import styles from "./ServiceInquiryForm.module.css";

export type InquirySelectOption = {
  value: string;
  label: string;
};

type InquirySelectProps = {
  name: string;
  value: string;
  onChange: (value: string) => void;
  options: InquirySelectOption[];
  placeholder: string;
};

export default function InquirySelect({
  name,
  value,
  onChange,
  options,
  placeholder,
}: InquirySelectProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const listId = useId();
  const selected = options.find((option) => option.value === value);

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  return (
    <div className={styles.selectWrap} ref={rootRef}>
      <input type="hidden" name={name} value={value} />

      <button
        type="button"
        className={[
          styles.selectTrigger,
          open ? styles.selectTriggerOpen : "",
          !value ? styles.selectTriggerPlaceholder : "",
        ]
          .filter(Boolean)
          .join(" ")}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => setOpen((current) => !current)}
      >
        <span className={styles.selectValue}>{selected?.label ?? placeholder}</span>
        <span className={styles.selectChevron} aria-hidden />
      </button>

      {open ? (
        <ul id={listId} className={styles.selectMenu} role="listbox">
          {options.map((option) => (
            <li key={option.value} role="presentation">
              <button
                type="button"
                role="option"
                aria-selected={option.value === value}
                className={[
                  styles.selectOption,
                  option.value === value ? styles.selectOptionActive : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
                onClick={() => {
                  onChange(option.value);
                  setOpen(false);
                }}
              >
                {option.label}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
