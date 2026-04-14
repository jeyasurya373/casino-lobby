import styles from "./GameCardSkeleton.module.scss";

interface GameCardSkeletonProps {
  variant: "compact" | "full";
  count?: number;
}

/**
 * Skeleton loading placeholder for GameCard component.
 * Matches exact dimensions of GameCard to prevent layout shift.
 *
 * @param props.variant - Display variant matching GameCard
 * @param props.count - Number of skeleton cards to render (default: 10)
 */
export default function GameCardSkeleton({
  variant,
  count = 10,
}: GameCardSkeletonProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className={`${styles.skeleton} ${styles[variant]}`}
          aria-label="Loading game card"
        >
          <div className={styles.imageArea} />
          <div className={styles.infoArea}>
            <div className={styles.titleLine} />
            {variant === "full" && <div className={styles.metadataLine} />}
          </div>
        </div>
      ))}
    </>
  );
}
