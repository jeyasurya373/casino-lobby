import { motion } from "framer-motion";
import styles from "./HeroBanner.module.scss";

/**
 * HeroBanner Component
 *
 * Promotional banner showcasing featured campaigns.
 * Displays with animated gradient background and fade-in animation.
 */
export default function HeroBanner() {
  return (
    <motion.div
      className={styles.heroBanner}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className={styles.content}>
        <div className={styles.label}>Coming Soon</div>
        <h1 className={styles.title}>$JACKPOT AIRDROP</h1>
        <p className={styles.subtitle}>
          Be ready for the biggest casino rewards event of the year
        </p>
        <button className={styles.ctaButton}>Learn More</button>
      </div>
      <div className={styles.gradient} />
    </motion.div>
  );
}
