import Image from "next/image";
import { motion } from "framer-motion";
import { useGameStore } from "@/store/useGameStore";
import type { Game } from "@/types/game.types";
import styles from "./GameCard.module.scss";

/**
 * GameCard Component
 *
 * Displays a casino game card with thumbnail, title, and metadata.
 * Used in both lobby rows (compact variant) and grid view (full variant).
 *
 * Features:
 * - Next.js optimized images with blur placeholder
 * - Favorite toggle functionality
 * - Responsive sizing based on variant
 * - Hover animations with glow effect using game's border color
 * - Badges for RTP, Fun Mode availability
 *
 * @param props - Component props
 * @param props.game - Game data object
 * @param props.variant - Display variant ('compact' for lobby, 'full' for grid)
 * @param props.onFavoriteToggle - Optional callback when favorite is toggled
 * @param props.priority - Next.js Image priority flag for above-the-fold content
 */

interface GameCardProps {
  game: Game;
  variant: "compact" | "full";
  onFavoriteToggle?: (slug: string) => void;
  priority?: boolean;
}

export default function GameCard({
  game,
  variant,
  onFavoriteToggle,
  priority = false,
}: GameCardProps) {
  const isFavorite = useGameStore((state) => state.isFavorite);
  const isGameFavorite = isFavorite(game.slug);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    onFavoriteToggle?.(game.slug);
  };

  return (
    <motion.div
      className={`${styles.gameCard} ${styles[variant]}`}
      whileHover={{ scale: 1.04 }}
      transition={{ duration: 0.2 }}
      style={{
        // @ts-expect-error CSS custom property
        "--border-color": game.borderColor,
      }}
    >
      {/* Game Thumbnail */}
      <div className={styles.imageWrapper}>
        <Image
          src={game.thumbnail}
          alt={game.name}
          fill
          sizes={
            variant === "compact"
              ? "130px"
              : "(min-width: 1024px) 170px, (min-width: 768px) 150px, 130px"
          }
          className={styles.image}
          {...(game.thumbnailBlur && {
            placeholder: "blur",
            blurDataURL: game.thumbnailBlur,
          })}
          priority={priority}
        />
      </div>

      {/* Top Badges Row */}
      <div className={styles.badgesTop}>
        {/* FUN Mode Badge - Only in full variant */}
        {variant === "full" && game.hasFunMode && (
          <div className={styles.funBadge}>FUN</div>
        )}

        {/* Favorite Heart - Always on right */}
        <button
          className={`${styles.favoriteButton} ${isGameFavorite ? styles.active : ""}`}
          onClick={handleFavoriteClick}
          aria-label={
            isGameFavorite ? "Remove from favorites" : "Add to favorites"
          }
          type="button"
        >
          {isGameFavorite ? "❤️" : "🤍"}
        </button>
      </div>

      {/* Game Info */}
      <div className={styles.info}>
        <h3 className={styles.title}>{game.name}</h3>

        {/* Metadata - Only in full variant */}
        {variant === "full" && (
          <div className={styles.metadata}>
            <span className={styles.vendor}>{game.vendor}</span>
            {game.theoreticalPayOut > 0 && (
              <span className={styles.rtpBadge}>
                RTP {game.theoreticalPayOut.toFixed(1)}%
              </span>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
