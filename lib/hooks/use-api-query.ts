import {
  UseQueryOptions,
  useQuery,
  QueryKey,
  QueryClient,
} from "@tanstack/react-query";
import { AxiosError } from "axios";

// Default cache time in milliseconds (5 minutes)
const DEFAULT_CACHE_TIME = 5 * 60 * 1000;

// Default stale time in milliseconds (1 minute)
const DEFAULT_STALE_TIME = 60 * 1000;

// Default retry attempts
const DEFAULT_RETRY_ATTEMPTS = 2;

// Default retry delay in milliseconds
const DEFAULT_RETRY_DELAY = 1000;

// Define retry condition
const shouldRetry = (error: Error) => {
  // Retry on network errors or 5xx server errors
  if (error instanceof AxiosError) {
    return error.isAxiosError && 
      (!error.response || error.response.status >= 500);
  }
  return true; // Retry on other errors
};

/**
 * Extended options for API queries
 */
export interface UseApiQueryOptions<TData, TError = Error>
  extends Omit<
    UseQueryOptions<TData, TError, TData, QueryKey>,
    "queryKey" | "queryFn"
  > {
  queryKey: string[];
  queryFn: () => Promise<TData>;
  cacheTime?: number;
  staleTime?: number;
  retryAttempts?: number;
  retryDelay?: number;
}

/**
 * Custom hook for API queries with optimized defaults
 */
export function useApiQuery<TData, TError = Error>(
  queryKey: string[],
  queryFn: () => Promise<TData>,
  options?: Omit<UseQueryOptions<TData, TError, TData, QueryKey>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey,
    queryFn,
    staleTime: DEFAULT_STALE_TIME,
    retry: (failureCount, error) => {
      // Retry on network errors or 5xx server errors
      if (error instanceof AxiosError) {
        return failureCount < 2 && 
          (error.isAxiosError && (!error.response || error.response.status >= 500));
      }
      return failureCount < 2;
    },
    refetchOnWindowFocus: false,
    ...options,
  });
}

/**
 * Simplified API hook for common use cases
 */
export function useApi<TData, TError = Error>(
  key: string | string[],
  fetcher: () => Promise<TData>,
  options?: Omit<UseQueryOptions<TData, TError, TData, QueryKey>, "queryKey" | "queryFn">
) {
  const queryKey = Array.isArray(key) ? key : [key];
  return useApiQuery<TData, TError>(queryKey, fetcher, options);
}

/**
 * Prefetch API data
 */
export const prefetchApiQuery = async <TData>(
  queryClient: QueryClient,
  queryKey: string[],
  queryFn: () => Promise<TData>,
  options?: {
    staleTime?: number;
  }
) => {
  return queryClient.prefetchQuery({
    queryKey,
    queryFn,
    staleTime: options?.staleTime ?? DEFAULT_STALE_TIME,
  });
}; 