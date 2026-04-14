"use client";

import { useEffect } from "react";
import ErrorState from "@/components/ui/ErrorState/ErrorState";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    if (process.env.NODE_ENV === "development") {
      console.error("Page error:", error);
    }
  }, [error]);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#0e0e1a",
      }}
    >
      <ErrorState
        message="Something went wrong loading this page."
        onRetry={reset}
      />
    </div>
  );
}
