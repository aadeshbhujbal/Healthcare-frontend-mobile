import {
  UseMutationOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { AxiosError } from "axios";

/**
 * Interface for structured API errors
 */
export interface ApiError {
  message: string;
  statusCode: number;
  errors?: Record<string, string[]>;
}

/**
 * Enhanced mutation hook with better error handling and optimized defaults
 */
export function useApiMutation<TData, TVariables, TContext = unknown>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  options?: Omit<
    UseMutationOptions<TData, AxiosError<ApiError>, TVariables, TContext>,
    "mutationFn"
  >
) {
  return useMutation({
    mutationFn,
    onError: (error, variables, context) => {
      // Log error for debugging
      console.error('[API Mutation Error]', error.response?.data || error.message);
      
      // Call the original onError if provided
      if (options?.onError) {
        options.onError(error, variables, context as TContext);
      }
    },
    ...options,
  });
}

/**
 * Helper to extract error message from API error
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof AxiosError && error.response?.data) {
    const apiError = error.response.data as ApiError;
    if (apiError.message) {
      return apiError.message;
    }
    
    // Check for validation errors
    if (apiError.errors) {
      const firstError = Object.values(apiError.errors)[0];
      if (firstError?.length) {
        return firstError[0];
      }
    }
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  return 'An unexpected error occurred';
}

/**
 * Enhanced mutation hook that automatically invalidates related queries
 */
export function useApiMutationWithInvalidation<TData, TVariables>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  invalidateQueries: string[],
  options?: Omit<
    UseMutationOptions<TData, AxiosError<ApiError>, TVariables, unknown>,
    "mutationFn"
  >
) {
  const queryClient = useQueryClient();
  
  // Create a new options object with modified onSuccess
  const enhancedOptions = {
    ...options,
    onSuccess: async (data: TData, variables: TVariables, context: unknown) => {
      // Call the original onSuccess if provided
      if (options?.onSuccess) {
        await options.onSuccess(data, variables, context);
      }
      
      // Invalidate all related queries
      await Promise.all(
        invalidateQueries.map(queryKey => 
          queryClient.invalidateQueries({ queryKey: [queryKey] })
        )
      );
    },
  };
  
  return useApiMutation<TData, TVariables, unknown>(
    mutationFn,
    enhancedOptions
  );
} 