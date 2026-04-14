import { useEffect, useRef } from "react";
import { useGameStore } from "@/store/useGameStore";
import styles from "./SearchBar.module.scss";

/**
 * SearchBar Component
 *
 * Implements a debounced search input for game filtering.
 *
 * Debounce Strategy:
 * - Updates searchQuery immediately for instant UI feedback
 * - Debounces debouncedQuery by 300ms before triggering API calls
 * - Uses custom useEffect-based debounce (no external library)
 * - Cleanup on unmount prevents stale API calls
 *
 * Auto-switching:
 * - Switches to 'search' viewMode on focus (if in 'lobby')
 * - Returns to 'lobby' viewMode when cleared
 */
export default function SearchBar() {
  const inputRef = useRef<HTMLInputElement>(null);

  const searchQuery = useGameStore((state) => state.searchQuery);
  const viewMode = useGameStore((state) => state.viewMode);
  const setSearchQuery = useGameStore((state) => state.setSearchQuery);
  const setDebouncedQuery = useGameStore((state) => state.setDebouncedQuery);
  const setViewMode = useGameStore((state) => state.setViewMode);

  // Debounce implementation - updates debouncedQuery 300ms after user stops typing
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);

    // Cleanup: cancel pending debounce on new input or unmount
    return () => {
      clearTimeout(timeoutId);
    };
  }, [searchQuery, setDebouncedQuery]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Update immediately for UI responsiveness
    setSearchQuery(e.target.value);
  };

  const handleFocus = () => {
    // Switch to search view when user starts searching
    if (viewMode === "lobby") {
      setViewMode("search");
    }
  };

  const handleClear = () => {
    // Reset all search-related state
    setSearchQuery("");
    setDebouncedQuery("");
    setViewMode("lobby");
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
        placeholder="Search games..."
        value={searchQuery}
        onChange={handleChange}
        onFocus={handleFocus}
        onKeyDown={handleKeyDown}
        aria-label="Search games"
      />

      {/* Clear Button */}
      {searchQuery && (
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
  );
}
