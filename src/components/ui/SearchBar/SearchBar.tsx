"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "./SearchBar.module.scss";

/**
 * SearchBar Component
 *
 * URL-driven search input with debouncing.
 * Updates URL params after 300ms of inactivity.
 *
 * Navigation patterns:
 * - User types "jack" → URL becomes /?search=jack (after 300ms)
 * - User clears search → URL becomes /
 * - Escape key → clears search and returns to lobby
 */
export default function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize from URL
  const [value, setValue] = useState(searchParams.get("search") ?? "");

  // Debounce: push to URL 300ms after user stops typing
  useEffect(() => {
    const timer = setTimeout(() => {
      const category = searchParams.get("category");

      if (value.length >= 2) {
        // Preserve category if present
        const params = new URLSearchParams();
        params.set("search", value);
        if (category) params.set("category", category);
        router.push(`/?${params.toString()}`);
      } else if (value.length === 0 && searchParams.get("search")) {
        // Clear search but preserve category
        if (category) {
          router.push(`/?category=${encodeURIComponent(category)}`);
        } else {
          router.push("/");
        }
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [value, router, searchParams]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const handleClear = () => {
    setValue("");
    const category = searchParams.get("category");
    // Clear search but preserve category
    if (category) {
      router.push(`/?category=${encodeURIComponent(category)}`);
    } else {
      router.push("/");
    }
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Escape key clears search and blurs input
    if (e.key === "Escape") {
      handleClear();
      inputRef.current?.blur();
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.searchBar}>
        {/* Search Icon */}
        <svg
          className={styles.searchIcon}
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            d="M9 17A8 8 0 1 0 9 1a8 8 0 0 0 0 16zM19 19l-4.35-4.35"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        {/* Search Input */}
        <input
          ref={inputRef}
          type="text"
          className={styles.input}
          placeholder="Search a Games..."
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          aria-label="Search games"
        />

        {/* Clear Button */}
        {value && (
          <button
            className={styles.clearButton}
            onClick={handleClear}
            aria-label="Clear search"
            type="button"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
}
