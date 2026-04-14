import { useState } from "react";
import { useGameStore } from "@/store/useGameStore";
import BottomSheet from "@/components/ui/BottomSheet/BottomSheet";
import FilterPanel from "@/components/grid/FilterPanel/FilterPanel";
import styles from "./SortBar.module.scss";

interface SortBarProps {
  resultCount?: number;
}

/**
 * SortBar Component
 *
 * Displays active filters, result count, and filter controls.
 * Shows filter button on mobile that opens BottomSheet.
 *
 * Features:
 * - Active filter tags with dismiss functionality
 * - Result count display
 * - Filter button with active filter count badge (mobile)
 * - FilterPanel integration via BottomSheet (mobile)
 */
export default function SortBar({ resultCount = 0 }: SortBarProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const selectedVendors = useGameStore((state) => state.selectedVendors);
  const selectedCategory = useGameStore((state) => state.selectedCategory);
  const sortField = useGameStore((state) => state.sortField);
  const sortOrder = useGameStore((state) => state.sortOrder);
  const toggleVendor = useGameStore((state) => state.toggleVendor);
  const setCategory = useGameStore((state) => state.setCategory);
  const clearFilters = useGameStore((state) => state.clearFilters);

  const activeFilterCount = selectedVendors.length + (selectedCategory ? 1 : 0);

  const hasNonDefaultSort =
    sortField !== "featuredPriority" || sortOrder !== "desc";

  return (
    <>
      <div className={styles.sortBar}>
        {/* Mobile Filter Button */}
        <button
          className={styles.filterButton}
          onClick={() => setIsFilterOpen(true)}
          type="button"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M2 4h16M5 10h10M8 16h4"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
          Filters
          {activeFilterCount > 0 && (
            <span className={styles.badge}>{activeFilterCount}</span>
          )}
        </button>

        {/* Result Count */}
        <div className={styles.resultCount}>
          <strong>{resultCount}</strong> games
        </div>

        {/* Active Filters Tags */}
        {(selectedVendors.length > 0 ||
          selectedCategory ||
          hasNonDefaultSort) && (
          <div className={styles.activeTags}>
            {/* Vendor tags */}
            {selectedVendors.map((vendor) => (
              <button
                key={vendor}
                className={styles.tag}
                onClick={() => toggleVendor(vendor)}
                type="button"
              >
                {vendor}
                <span className={styles.removeIcon}>×</span>
              </button>
            ))}

            {/* Category tag */}
            {selectedCategory && (
              <button
                className={styles.tag}
                onClick={() => setCategory(null)}
                type="button"
              >
                {selectedCategory}
                <span className={styles.removeIcon}>×</span>
              </button>
            )}

            {/* Sort tag */}
            {hasNonDefaultSort && (
              <div className={styles.sortTag}>
                Sort: {sortField} ({sortOrder})
              </div>
            )}

            {/* Clear all */}
            {activeFilterCount > 0 && (
              <button
                className={styles.clearAllTag}
                onClick={clearFilters}
                type="button"
              >
                Clear all
              </button>
            )}
          </div>
        )}
      </div>

      {/* Mobile Bottom Sheet with Filters */}
      <BottomSheet
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        title="Filters"
      >
        <FilterPanel />
      </BottomSheet>
    </>
  );
}
