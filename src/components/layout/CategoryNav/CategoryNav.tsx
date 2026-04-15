"use client";

import { useRouter, useSearchParams } from "next/navigation";
import type { GameCategory } from "@/types/game.types";
import styles from "./CategoryNav.module.scss";

interface CategoryTab {
  label: string;
  category?: GameCategory;
  isClear?: boolean;
}

const CATEGORIES: CategoryTab[] = [
  { label: "Jackpot Originals", category: "original" },
  { label: "New Games", category: "new" },
  { label: "Slots", category: "slots" },
  { label: "Featured Games", category: "popular" },
];

interface CategoryNavProps {
  activeCategory: string;
}

/**
 * CategoryNav Component
 *
 * Horizontal scrollable navigation pills for game categories.
 * URL-driven: clicking navigates to /?category=X
 * Active pill has white border outline (no fill).
 * "Feeling Lucky" clears all filters.
 */
export default function CategoryNav({ activeCategory }: CategoryNavProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleCategoryClick = (tab: CategoryTab) => {
    const search = searchParams.get("search");

    if (tab.isClear || (tab.category && activeCategory === tab.category)) {
      // Clear category but preserve search if present
      if (search) {
        router.push(`/?search=${encodeURIComponent(search)}`);
      } else {
        router.push("/");
      }
    } else if (tab.category) {
      // Navigate to category, preserve search if present
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      params.set("category", tab.category);
      router.push(`/?${params.toString()}`);
    }
  };

  return (
    <nav className={styles.categoryNav}>
      <div className={styles.scrollContainer}>
        {CATEGORIES.map((tab) => {
          const isActive = tab.category && activeCategory === tab.category;

          return (
            <button
              key={tab.label}
              className={`${styles.pill} ${isActive ? styles.active : ""} ${tab.isClear ? styles.feelingLucky : ""}`}
              onClick={() => handleCategoryClick(tab)}
              type="button"
            >
              {tab.isClear && <span className={styles.clearIcon}>✕</span>}
              {tab.label}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
