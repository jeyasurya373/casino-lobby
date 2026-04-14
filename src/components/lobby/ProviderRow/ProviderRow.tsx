import styles from "./ProviderRow.module.scss";

const PROVIDERS = [
  { name: "Pragmatic Play", logo: "🎮" },
  { name: "Evolution Gaming", logo: "🎲" },
  { name: "Play'n GO", logo: "🎯" },
  { name: "NetEnt", logo: "⭐" },
  { name: "Relax Gaming", logo: "🎪" },
  { name: "BGaming", logo: "🎨" },
];

/**
 * ProviderRow Component
 *
 * Displays featured game providers in a scrollable horizontal row.
 */
export default function ProviderRow() {
  return (
    <section className={styles.providerRow}>
      <h2 className={styles.title}>Featured Providers</h2>
      <div className={styles.providersContainer}>
        {PROVIDERS.map((provider) => (
          <button
            key={provider.name}
            className={styles.providerCard}
            type="button"
          >
            <div className={styles.logo}>{provider.logo}</div>
            <div className={styles.name}>{provider.name}</div>
          </button>
        ))}
      </div>
    </section>
  );
}
