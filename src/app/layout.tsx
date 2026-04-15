"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";
import "./globals.scss";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  return (
    <html lang="en">
      <head>
        <title>Jackpot.bet | Jeyasurya </title>
        <meta
          name="description"
          content="Explore our extensive casino lobby featuring slots, table games, live dealers, and more. Play now and win big!"
        />
      </head>
      <body>
        <QueryClientProvider client={queryClient}>
          {children}
          {process.env.NODE_ENV === "development" && <ReactQueryDevtools />}
        </QueryClientProvider>
      </body>
    </html>
  );
}
