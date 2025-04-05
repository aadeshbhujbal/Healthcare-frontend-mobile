import React, { ReactNode } from "react";
import { AuthProvider } from "./AuthProvider";
import { QueryProvider } from "./QueryProvider";

interface AppProvidersProps {
  children: ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <QueryProvider>
      <AuthProvider>{children}</AuthProvider>
    </QueryProvider>
  );
}

export { AuthProvider, useAuth } from "./AuthProvider";
export { QueryProvider } from "./QueryProvider";
