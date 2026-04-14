import { useEffect, useRef } from "react";

interface UseInfiniteScrollOptions {
  onIntersect: () => void;
  enabled: boolean;
}

/**
 * IntersectionObserver hook that calls a callback when
 * a sentinel element enters the viewport.
 * Used to trigger fetchNextPage in GameGrid.
 *
 * @param options - Configuration options
 * @param options.onIntersect - Callback to fire when sentinel intersects viewport
 * @param options.enabled - Whether the observer should be active
 * @returns Ref to attach to the sentinel element
 */
export function useInfiniteScroll({
  onIntersect,
  enabled,
}: UseInfiniteScrollOptions) {
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!enabled) return;

    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          onIntersect();
        }
      },
      {
        threshold: 0.1,
      },
    );

    observer.observe(sentinel);

    return () => {
      observer.disconnect();
    };
  }, [enabled, onIntersect]);

  return sentinelRef;
}
