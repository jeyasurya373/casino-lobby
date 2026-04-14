"use client";

import { useGameStore } from "@/store/useGameStore";
import Header from "@/components/layout/Header/Header";
import CategoryNav from "@/components/layout/CategoryNav/CategoryNav";
import HeroBanner from "@/components/lobby/HeroBanner/HeroBanner";
import GameRow from "@/components/lobby/GameRow/GameRow";
import ProviderRow from "@/components/lobby/ProviderRow/ProviderRow";
import GameGrid from "@/components/grid/GameGrid/GameGrid";
import FilterPanel from "@/components/grid/FilterPanel/FilterPanel";
import SortBar from "@/components/grid/SortBar/SortBar";
import { useGames } from "@/hooks/useGames";
import styles from "./page.module.scss";

export default function Home() {
  const viewMode = useGameStore((state) => state.viewMode);
  const openGridView = useGameStore((state) => state.openGridView);
  const { games } = useGames();

  return (
    <div className={styles.page}>
      <Header />
      <CategoryNav />

      {/* Lobby View */}
      {viewMode === "lobby" && (
        <main className={styles.lobby}>
          <HeroBanner />
          <GameRow
            title="Featured Games"
            category="VIDEOSLOTS"
            icon="⭐"
            onViewAll={() => openGridView("VIDEOSLOTS")}
          />
          <ProviderRow />
          <GameRow
            title="Slots"
            category="VIDEOSLOTS"
            icon="🎰"
            onViewAll={() => openGridView("VIDEOSLOTS")}
          />
          <GameRow
            title="Table Games"
            category="TABLEGAMES"
            icon="♠️"
            onViewAll={() => openGridView("TABLEGAMES")}
          />
          <GameRow
            title="Blackjack"
            category="BLACKJACK"
            icon="🃏"
            onViewAll={() => openGridView("BLACKJACK")}
          />
        </main>
      )}

      {/* Grid View */}
      {(viewMode === "grid" || viewMode === "search") && (
        <main className={styles.gridView}>
          <div className={styles.sidebar}>
            <FilterPanel />
          </div>
          <div className={styles.gridContent}>
            <SortBar resultCount={games.length} />
            <GameGrid />
          </div>
        </main>
      )}
    </div>
  );
}
