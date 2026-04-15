"use client";

import { useSearchParams } from "next/navigation";
import Header from "@/components/layout/Header/Header";
import CategoryNav from "@/components/layout/CategoryNav/CategoryNav";
import HeroBanner from "@/components/lobby/HeroBanner/HeroBanner";
import SearchBar from "@/components/ui/SearchBar/SearchBar";
import LobbyView from "@/components/lobby/LobbyView/LobbyView";
import SearchResultsGrid from "@/components/grid/SearchResultsGrid/SearchResultsGrid";
import CategoryGrid from "@/components/grid/CategoryGrid/CategoryGrid";
import styles from "./page.module.scss";

/**
 * Main Page Component
 *
 * URL-driven architecture matching production jackpot.bet:
 * - /                        → lobby mode, all rows visible
 * - /?search=blackjack      → search mode, flat grid of results
 * - /?category=ORIGINAL     → category mode, flat grid filtered
 *
 * URL params are the single source of truth.
 * Always shows: Header, HeroBanner, SearchBar, CategoryNav
 * Content area switches based on URL params.
 */
export default function Home() {
  const searchParams = useSearchParams();
  const search = searchParams.get("search") ?? "";
  const category = searchParams.get("category") ?? "";

  // Determine mode based on URL params
  // When both exist, search takes precedence (search within category)
  const mode = search ? "search" : category ? "category" : "lobby";

  return (
    <div className={styles.page}>
      <Header />
      <HeroBanner />

      <div className={styles.searchBarRow}>
        <SearchBar />
      </div>

      <CategoryNav activeCategory={category} />

      {/* Content area - switches based on URL */}
      {mode === "lobby" && <LobbyView />}
      {mode === "search" && (
        <SearchResultsGrid query={search} category={category} />
      )}
      {mode === "category" && <CategoryGrid category={category} />}
    </div>
  );
}
