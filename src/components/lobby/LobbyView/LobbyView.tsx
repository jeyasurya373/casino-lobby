"use client";

import { useRouter } from "next/navigation";
import GameRow from "@/components/lobby/GameRow/GameRow";
import styles from "./LobbyView.module.scss";

/**
 * LobbyView Component
 *
 * Displays all game rows in the lobby layout.
 * Pure composition - no state management.
 * Each row's "View All" navigates to category grid via URL.
 */
export default function LobbyView() {
  const router = useRouter();

  const handleViewAll = (category: string) => {
    router.push(`/?category=${category}`);
  };

  return (
    <main className={styles.lobby}>
      <GameRow
        title="Jackpot Originals"
        category="original"
        icon="/mobile_logo.png"
        onViewAll={() => handleViewAll("original")}
      />

      <GameRow
        title="Slots"
        category="slots"
        icon="/slot.png"
        onViewAll={() => handleViewAll("slots")}
      />

      <GameRow
        title="Table Games"
        category="table"
        icon="/table_game.png"
        onViewAll={() => handleViewAll("table")}
      />
    </main>
  );
}
