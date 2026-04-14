import { useGameStore } from "@/store/useGameStore";
import type { GameVendor, GameCategory, SortField } from "@/types/game.types";
import styles from "./FilterPanel.module.scss";

const VENDORS: GameVendor[] = [
  "PragmaticPlay",
  "EvolutionGaming",
  "JackpotOriginal",
  "Play'nGo",
  "RelaxGaming",
  "BGaming",
];

const CATEGORIES: GameCategory[] = [
  "VIDEOSLOTS",
  "BLACKJACK",
  "BACCARAT",
  "TABLEGAMES",
  "LIVEDEALER",
];

const SORT_OPTIONS: { value: SortField; label: string }[] = [
  { value: "name", label: "Name" },
  { value: "theoreticalPayOut", label: "RTP" },
  { value: "popularity", label: "Popularity" },
  { value: "featuredPriority", label: "Featured" },
];

/**
 * FilterPanel Component
 *
 * Provides filtering controls for games by vendor, category, and sorting.
 * Renders as a sidebar on desktop and inside BottomSheet on mobile.
 *
 * Features:
 * - Multi-select vendor chips
 * - Single-select category pills
 * - Sort field and order controls
 * - Clear all filters functionality
 * - All state managed through Zustand store
 */
export default function FilterPanel() {
  const selectedVendors = useGameStore((state) => state.selectedVendors);
  const selectedCategory = useGameStore((state) => state.selectedCategory);
  const sortField = useGameStore((state) => state.sortField);
  const sortOrder = useGameStore((state) => state.sortOrder);
  const toggleVendor = useGameStore((state) => state.toggleVendor);
  const setCategory = useGameStore((state) => state.setCategory);
  const setSortField = useGameStore((state) => state.setSortField);
  const setSortOrder = useGameStore((state) => state.setSortOrder);
  const clearFilters = useGameStore((state) => state.clearFilters);

  const hasActiveFilters =
    selectedVendors.length > 0 ||
    selectedCategory !== null ||
    sortField !== "featuredPriority" ||
    sortOrder !== "desc";

  return (
    <div className={styles.filterPanel}>
      {/* Vendors Section */}
      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Vendors</h3>
        <div className={styles.chipGroup}>
          {VENDORS.map((vendor) => (
            <button
              key={vendor}
              className={`${styles.chip} ${
                selectedVendors.includes(vendor) ? styles.active : ""
              }`}
              onClick={() => toggleVendor(vendor)}
              type="button"
            >
              {vendor}
            </button>
          ))}
        </div>
      </section>

      {/* Categories Section */}
      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Category</h3>
        <div className={styles.pillGroup}>
          {CATEGORIES.map((category) => (
            <button
              key={category}
              className={`${styles.pill} ${
                selectedCategory === category ? styles.active : ""
              }`}
              onClick={() =>
                setCategory(selectedCategory === category ? null : category)
              }
              type="button"
            >
              {category}
            </button>
          ))}
        </div>
      </section>

      {/* Sort Section */}
      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Sort By</h3>
        <select
          className={styles.select}
          value={sortField}
          onChange={(e) => setSortField(e.target.value as SortField)}
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <div className={styles.sortOrderToggle}>
          <button
            className={`${styles.orderButton} ${
              sortOrder === "asc" ? styles.active : ""
            }`}
            onClick={() => setSortOrder("asc")}
            type="button"
          >
            ↑ Ascending
          </button>
          <button
            className={`${styles.orderButton} ${
              sortOrder === "desc" ? styles.active : ""
            }`}
            onClick={() => setSortOrder("desc")}
            type="button"
          >
            ↓ Descending
          </button>
        </div>
      </section>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <button
          className={styles.clearButton}
          onClick={clearFilters}
          type="button"
        >
          Clear All Filters
        </button>
      )}
    </div>
  );
}
