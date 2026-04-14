import styles from "./EmptyState.module.scss";

interface EmptyStateProps {
  title?: string;
  subtitle?: string;
  icon?: string;
}

/**
 * Empty state component displayed when no content is available.
 * Used for empty search results or empty categories.
 *
 * @param props.title - Main heading text
 * @param props.subtitle - Optional subtitle/description text
 * @param props.icon - Optional icon (emoji or text)
 */
export default function EmptyState({
  title = "No games found",
  subtitle = "Try a different search",
  icon = "🎰",
}: EmptyStateProps) {
  return (
    <div className={styles.emptyState}>
      {icon && <div className={styles.icon}>{icon}</div>}
      <h2 className={styles.title}>{title}</h2>
      {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
    </div>
  );
}
