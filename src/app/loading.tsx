import GameCardSkeleton from "@/components/game/GameCardSkeleton/GameCardSkeleton";
import styles from "./loading.module.scss";

export default function Loading() {
  return (
    <div className={styles.loading}>
      {/* Header Skeleton */}
      <div className={styles.header}>
        <div className={styles.logo} />
        <div className={styles.searchBar} />
        <div className={styles.authButtons}>
          <div className={styles.button} />
          <div className={styles.button} />
        </div>
      </div>

      {/* Category Nav Skeleton */}
      <div className={styles.categoryNav}>
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className={styles.categoryTab} />
        ))}
      </div>

      {/* Hero Banner Skeleton */}
      <div className={styles.heroBanner} />

      {/* Game Rows Skeleton */}
      <div className={styles.gameRows}>
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className={styles.gameRow}>
            <div className={styles.rowTitle} />
            <div className={styles.cards}>
              <GameCardSkeleton variant="compact" count={6} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
