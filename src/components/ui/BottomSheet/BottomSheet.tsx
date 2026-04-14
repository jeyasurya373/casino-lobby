import { useEffect } from "react";
import { motion, PanInfo } from "framer-motion";
import styles from "./BottomSheet.module.scss";

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
}

/**
 * BottomSheet Component
 *
 * Mobile modal that slides up from the bottom with drag-to-dismiss.
 * Used for filter panel on mobile devices.
 *
 * Features:
 * - Slides up animation using Framer Motion
 * - Dark overlay backdrop
 * - Drag down to dismiss
 * - Prevents body scroll when open
 * - Handle bar for visual affordance
 */
export default function BottomSheet({
  isOpen,
  onClose,
  children,
  title,
}: BottomSheetProps) {
  // Prevent body scroll when sheet is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleDragEnd = (
    event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo,
  ) => {
    // Close if dragged down more than 100px
    if (info.offset.y > 100) {
      onClose();
    }
  };

  return (
    <div className={styles.bottomSheetContainer}>
      {/* Overlay */}
      <motion.div
        className={styles.overlay}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />

      {/* Bottom Sheet */}
      <motion.div
        className={styles.bottomSheet}
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={0.2}
        onDragEnd={handleDragEnd}
      >
        {/* Handle bar */}
        <div className={styles.handleBar} />

        {/* Header */}
        {title && (
          <div className={styles.header}>
            <h2 className={styles.title}>{title}</h2>
            <button
              className={styles.closeButton}
              onClick={onClose}
              aria-label="Close"
              type="button"
            >
              ×
            </button>
          </div>
        )}

        {/* Content */}
        <div className={styles.content}>{children}</div>
      </motion.div>
    </div>
  );
}
