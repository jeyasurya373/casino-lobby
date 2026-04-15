import { motion } from "framer-motion";
import Image from "next/image";
import styles from "./HeroBanner.module.scss";

/**
 * HeroBanner Component
 *
 * Promotional banner showcasing featured campaigns.
 * Centered on mobile, left-aligned on desktop (35% width).
 * Displays with animated gradient background and fade-in animation.
 */
export default function HeroBanner() {
  return (
    <div className={styles.bannerContainer}>
      <motion.div
        className={styles.heroBanner}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Image
          src="/header_banner.png"
          alt="banner image"
          fill
          className={styles.bannerImage}
          style={{ objectFit: "cover" }}
          priority
        />
      </motion.div>
    </div>
  );
}
