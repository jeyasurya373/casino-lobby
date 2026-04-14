import { useGameRow } from "@/hooks/useGameRow";
import { useGameStore } from "@/store/useGameStore";
import GameCard from "@/components/game/GameCard/GameCard";
import GameCardSkeleton from "@/components/game/GameCardSkeleton/GameCardSkeleton";
import ErrorState from "@/components/ui/ErrorState/ErrorState";
import type { GameCategory } from "@/types/game.types";
import styles from "./GameRow.module.scss";

interface GameRowProps {
  title: string;
  category: GameCategory;
  icon?: string;
  onViewAll: () => void;
}

/**
 * GameRow Component
 *
 * Displays a horizontal scrolling row of games for a specific category.
 * Used in lobby view to showcase different game categories.
 *
 * Features:
 * - Fetches 10 games for the specified category
 * - Horizontal scroll with peek effect (2.5 cards on mobile, 6 on desktop)
 * - Loading skeleton state matching final card dimensions
 * - Error handling with retry functionality
 * - "View All" button to navigate to full grid view
 */
export default function GameRow({
  title,
  category,
  icon,
  onViewAll,
}: GameRowProps) {
  const { games, isLoading, isError } = useGameRow(category);
  const toggleFavorite = useGameStore((state) => state.toggleFavorite);

  // Loading state
  if (isLoading) {
    return (
      <section className={styles.gameRow}>
        <div className={styles.header}>
          <h2 className={styles.title}>
            {icon && <span className={styles.icon}>{icon}</span>}
            {title}
          </h2>
        </div>
        <div className={styles.cardsContainer}>
          <GameCardSkeleton variant="compact" count={6} />
        </div>
      </section>
    );
  }

  // Error state
  if (isError) {
    return (
      <section className={styles.gameRow}>
        <div className={styles.header}>
          <h2 className={styles.title}>
            {icon && <span className={styles.icon}>{icon}</span>}
            {title}
          </h2>
        </div>
        <ErrorState
          message="Failed to load games for this category."
          onRetry={() => window.location.reload()}
        />
      </section>
    );
  }

  // Success state
  return (
    <section className={styles.gameRow}>
      <div className={styles.header}>
        <h2 className={styles.title}>
          {icon && <span className={styles.icon}>{icon}</span>}
          {title}
        </h2>
        <button className={styles.viewAllButton} onClick={onViewAll}>
          View All →
        </button>
      </div>

      <div className={styles.cardsContainer}>
        {games.map((game, index) => (
          <GameCard
            key={game.slug}
            game={game}
            variant="compact"
            onFavoriteToggle={toggleFavorite}
            priority={index < 3}
          />
        ))}
      </div>
    </section>
  );
}
