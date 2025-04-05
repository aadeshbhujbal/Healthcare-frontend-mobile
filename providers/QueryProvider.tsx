import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React, { ReactNode, useState } from "react";
import { Platform } from "react-native";

interface QueryProviderProps {
  children: ReactNode;
}

export function QueryProvider({ children }: QueryProviderProps) {
  // Create a client instance that persists across renders but is unique per component instance
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Optimized settings for better performance and UX
            staleTime: 60 * 1000, // 1 minute before data is considered stale
            retry: 2, // Retry failed queries twice
            retryDelay: (attemptIndex) =>
              Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
            networkMode: "always", // Always try to fetch even if offline (will be handled by retry logic)
            refetchOnWindowFocus: Platform.OS === "web", // Only refetch on focus for web
            refetchOnReconnect: true, // Refetch when reconnecting
            refetchOnMount: true, // Refetch when component mounts if data is stale
          },
          mutations: {
            // Mutation settings
            retry: 1, // Only retry mutations once
            networkMode: "always", // Always try to send even if offline
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
