import SearchBar from "@/components/ui/SearchBar/SearchBar";
import styles from "./Header.module.scss";

/**
 * Header Component
 *
 * Main navigation header with logo, search, and auth buttons.
 * Sticky positioned at top of viewport.
 *
 * Layout:
 * - Desktop: Logo left, SearchBar center, Auth buttons right
 * - Mobile: Logo and auth on first row, SearchBar on second row
 */
export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.topRow}>
        {/* Logo */}
        <div className={styles.logo}>
          <span className={styles.logoIcon}>🎰</span>
          <span className={styles.logoText}>JACKPOT</span>
        </div>

        {/* Search Bar - Desktop only in top row */}
        <div className={styles.searchDesktop}>
          <SearchBar />
        </div>

        {/* Auth Buttons */}
        <div className={styles.authButtons}>
          <button className={styles.loginButton}>Login</button>
          <button className={styles.registerButton}>Register</button>
        </div>
      </div>

      {/* Search Bar - Mobile only in second row */}
      <div className={styles.searchMobile}>
        <SearchBar />
      </div>
    </header>
  );
}
