import { motion } from "framer-motion";
import { useGames } from "@/hooks/useGames";
import { useGameSearch } from "@/hooks/useGameSearch";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { useGameStore } from "@/store/useGameStore";
import GameCard from "@/components/game/GameCard/GameCard";
import GameCardSkeleton from "@/components/game/GameCardSkeleton/GameCardSkeleton";
import EmptyState from "@/components/ui/EmptyState/EmptyState";
import ErrorState from "@/components/ui/ErrorState/ErrorState";
import styles from "./GameGrid.module.scss";

/**
 * GameGrid Component
 *
 * Displays games in a responsive grid layout with infinite scroll.
 * Used in grid view mode when user clicks "View All" or applies filters.
 *
 * Features:
 * - Responsive grid: 2 → 3 → 4 → 5 columns based on viewport
 * - Infinite scroll pagination (20 games per page)
 * - Loading skeletons during initial load and pagination
 * - Error handling with retry functionality
 * - Empty state when no games match filters
 * - Favorite toggle integration with Zustand store
 */
export default function GameGrid() {
  const viewMode = useGameStore((state) => state.viewMode);
  const toggleFavorite = useGameStore((state) => state.toggleFavorite);

  // Use different hooks based on view mode
  const isSearchMode = viewMode === "search";

  // Grid mode: filtered games with infinite scroll
  const gridQuery = useGames();

  // Search mode: search results
  const searchQuery = useGameSearch();

  // Select appropriate data source
  const games = isSearchMode ? searchQuery.results : gridQuery.games;
  const isLoading = isSearchMode ? searchQuery.isLoading : gridQuery.isLoading;
  const isError = isSearchMode ? searchQuery.isError : gridQuery.isError;

  // Infinite scroll (only for grid mode, not search)
  const sentinelRef = useInfiniteScroll({
    onIntersect: () => {
      if (
        !isSearchMode &&
        gridQuery.hasNextPage &&
        !gridQuery.isFetchingNextPage
      ) {
        gridQuery.fetchNextPage();
      }
    },
    enabled: !isSearchMode && (gridQuery.hasNextPage ?? false),
  });

  // Initial loading state
  if (isLoading) {
    return (
      <div className={styles.gridContainer}>
        <div className={styles.grid}>
          <GameCardSkeleton variant="full" count={20} />
        </div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className={styles.gridContainer}>
        <ErrorState
          message="Failed to load games. Please try again."
          onRetry={() => window.location.reload()}
        />
      </div>
    );
  }

  // Empty state
  if (games.length === 0) {
    const emptyMessage = isSearchMode
      ? {
          title: "No games found",
          subtitle: "Try a different search term",
        }
      : {
          title: "No games found",
          subtitle: "Try adjusting your filters or search query",
        };

    return (
      <div className={styles.gridContainer}>
        <EmptyState
          title={emptyMessage.title}
          subtitle={emptyMessage.subtitle}
          icon="🎰"
        />
      </div>
    );
  }

  // Success state with games
  return (
    <div className={styles.gridContainer}>
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

      {/* Loading more indicator - only in grid mode */}
      {!isSearchMode && gridQuery.isFetchingNextPage && (
        <div className={styles.grid}>
          <GameCardSkeleton variant="full" count={4} />
        </div>
      )}

      {/* End of results message - only in grid mode */}
      {!isSearchMode && !gridQuery.hasNextPage && games.length > 0 && (
        <div className={styles.endMessage}>
          <p>You&apos;ve seen all games</p>
        </div>
      )}

      {/* Infinite scroll sentinel - only in grid mode */}
      {!isSearchMode && (
        <div ref={sentinelRef} className={styles.sentinel} aria-hidden="true" />
      )}
    </div>
  );
}
