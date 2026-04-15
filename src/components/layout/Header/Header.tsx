import Image from "next/image";
import styles from "./Header.module.scss";
import Link from "next/link";

/**
 * Header Component
 *
 * Main navigation header with logo, icons, and auth buttons.
 * Sticky positioned at top of viewport.
 *
 * Layout:
 * - Logo left (responsive: desktop vs mobile logo)
 * - Search and chat icon buttons center
 * - Login (outline) and Register (solid purple) buttons right
 * - Mobile: logo left, auth buttons right (smaller)
 */
export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        {/* Logo - Responsive */}
        <div className={styles.logo}>
          {/* Desktop Logo */}
          <Link href="/">
            <Image
              src="/desktop_logo.png"
              alt="JACKPOT"
              width={120}
              height={40}
              className={styles.logoDesktop}
              priority
            />
          </Link>

          {/* Mobile Logo */}
          <Image
            src="/mobile_logo.png"
            alt="JACKPOT"
            width={80}
            height={32}
            className={styles.logoMobile}
            priority
          />
        </div>

        {/* Auth Buttons */}
        <div className={styles.authButtons}>
          <button className={styles.loginButton}>Login</button>
          <button className={styles.registerButton}>Register</button>
        </div>
      </div>
    </header>
  );
}
