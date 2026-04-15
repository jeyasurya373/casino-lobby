"use client";

import { motion } from "framer-motion";
import { useGames } from "@/hooks/useGames";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { useGameStore } from "@/store/useGameStore";
import GameCard from "@/components/game/GameCard/GameCard";
import GameCardSkeleton from "@/components/game/GameCardSkeleton/GameCardSkeleton";
import EmptyState from "@/components/ui/EmptyState/EmptyState";
import ErrorState from "@/components/ui/ErrorState/ErrorState";
import type { GameCategory } from "@/types/game.types";
import styles from "./CategoryGrid.module.scss";

interface CategoryGridProps {
  category: string;
}

/**
 * CategoryGrid Component
 *
 * Full paginated grid filtered by category.
 * Shown when URL has ?category= param.
 * No sidebar. No section grouping. Infinite scroll.
 */
export default function CategoryGrid({ category }: CategoryGridProps) {
  const {
    games,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useGames({
    category: category as GameCategory,
  });
  const toggleFavorite = useGameStore((state) => state.toggleFavorite);

  // Infinite scroll sentinel
  const sentinelRef = useInfiniteScroll({
    onIntersect: () => {
      if (hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
    enabled: hasNextPage ?? false,
  });

  // Loading state
  if (isLoading) {
    return (
      <main className={styles.container}>
        <div className={styles.grid}>
          <GameCardSkeleton variant="full" count={20} />
        </div>
      </main>
    );
  }

  // Error state
  if (isError) {
    return (
      <main className={styles.container}>
        <ErrorState
          message="Failed to load games. Please try again."
          onRetry={() => window.location.reload()}
        />
      </main>
    );
  }

  // Empty state
  if (games.length === 0) {
    return (
      <main className={styles.container}>
        <EmptyState
          title="No games found"
          subtitle="Try selecting a different category"
          icon="🎰"
        />
      </main>
    );
  }

  // Results grid with infinite scroll
  return (
    <main className={styles.container}>
      <motion.div
        className={styles.grid}
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              staggerChildren: 0.05,
            },
          },
        }}
      >
        {games.map((game, index) => (
          <motion.div
            key={game.slug}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
          >
            <GameCard
              game={game}
              variant="full"
              onFavoriteToggle={toggleFavorite}
              priority={index < 10}
            />
          </motion.div>
        ))}
      </motion.div>

      {/* Loading more indicator */}
      {isFetchingNextPage && (
        <div className={styles.grid}>
          <GameCardSkeleton variant="full" count={4} />
        </div>
      )}

      {/* End of results message */}
      {!hasNextPage && games.length > 0 && (
        <div className={styles.endMessage}>
          <p>All games loaded</p>
        </div>
      )}

      {/* Infinite scroll sentinel */}
      <div ref={sentinelRef} className={styles.sentinel} aria-hidden="true" />
    </main>
  );
}
