import styles from "./ErrorState.module.scss";

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

/**
 * Error state component displayed when content fails to load.
 * Shows an error message and optional retry button.
 *
 * @param props.message - Error message to display
 * @param props.onRetry - Optional callback to retry the failed operation
 */
export default function ErrorState({
  message = "Something went wrong. Please try again.",
  onRetry,
}: ErrorStateProps) {
  return (
    <div className={styles.errorState}>
      <div className={styles.icon}>⚠️</div>
      <h2 className={styles.title}>Error</h2>
      <p className={styles.message}>{message}</p>
      {onRetry && (
        <button className={styles.retryButton} onClick={onRetry}>
          Try Again
        </button>
      )}
    </div>
  );
}
