import { useGameStore } from "@/store/useGameStore";
import type { GameCategory } from "@/types/game.types";
import styles from "./CategoryNav.module.scss";

interface CategoryTab {
  label: string;
  category?: GameCategory;
}

const CATEGORIES: CategoryTab[] = [
  { label: "Jackpot Originals", category: "ORIGINAL" },
  { label: "New Bonuses" },
  { label: "Slots", category: "VIDEOSLOTS" },
  { label: "Featured" },
  { label: "Table Games", category: "TABLEGAMES" },
  { label: "Game Shows", category: "GAMESHOWSLIVEDEALER" },
  { label: "Sports" },
  { label: "New Games" },
];

/**
 * CategoryNav Component
 *
 * Horizontal scrollable navigation tabs for game categories.
 * Clicking a tab opens the grid view with the selected category.
 */
export default function CategoryNav() {
  const activeCategory = useGameStore((state) => state.activeCategory);
  const openGridView = useGameStore((state) => state.openGridView);

  const handleCategoryClick = (tab: CategoryTab) => {
    if (tab.category) {
      openGridView(tab.category);
    }
  };

  return (
    <nav className={styles.categoryNav}>
      <div className={styles.scrollContainer}>
        {CATEGORIES.map((tab) => (
          <button
            key={tab.label}
            className={`${styles.tab} ${
              activeCategory === tab.label ? styles.active : ""
            }`}
            onClick={() => handleCategoryClick(tab)}
            type="button"
          >
            {tab.label}
          </button>
        ))}
      </div>
    </nav>
  );
}
