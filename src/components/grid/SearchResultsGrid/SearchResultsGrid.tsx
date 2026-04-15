"use client";

import { motion } from "framer-motion";
import { useGameSearch } from "@/hooks/useGameSearch";
import { useGameStore } from "@/store/useGameStore";
import GameCard from "@/components/game/GameCard/GameCard";
import GameCardSkeleton from "@/components/game/GameCardSkeleton/GameCardSkeleton";
import EmptyState from "@/components/ui/EmptyState/EmptyState";
import ErrorState from "@/components/ui/ErrorState/ErrorState";
import styles from "./SearchResultsGrid.module.scss";

interface SearchResultsGridProps {
  query: string;
  category?: string;
}

/**
 * SearchResultsGrid Component
 *
 * Flat grid of search results - no category grouping, no sidebar.
 * Shown when URL has ?search= param.
 * Uses useGameSearch hook with query from props.
 * Optionally filters by category if both search and category params exist.
 */
export default function SearchResultsGrid({
  query,
  category,
}: SearchResultsGridProps) {
  const { results, isLoading, isError, isEmpty } = useGameSearch(query);
  const toggleFavorite = useGameStore((state) => state.toggleFavorite);

  // Filter by category if provided
  const filteredResults = category
    ? results.filter((game) =>
        game.categories.some(
          (cat) => cat.toLowerCase() === category.toLowerCase(),
        ),
      )
    : results;

  // Loading state
  if (isLoading && query.length >= 2) {
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
          message="Failed to search games. Please try again."
          onRetry={() => window.location.reload()}
        />
      </main>
    );
  }

  // Empty state
  if (isEmpty || filteredResults.length === 0) {
    const emptyMessage = category
      ? `No games found for "${query}" in ${category}`
      : `No games found for "${query}"`;

    return (
      <main className={styles.container}>
        <EmptyState
          title={emptyMessage}
          subtitle="Try a different search term"
          icon="🔍"
        />
      </main>
    );
  }

  // Results grid
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
        {filteredResults.map((game, index) => (
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
    </main>
  );
}
