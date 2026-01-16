// src/components/layout/ErrorBoundaryWrapper.tsx
// Wrapper client component para ErrorBoundary
'use client';

import { ErrorBoundary } from '../ui/ErrorBoundary';

export function ErrorBoundaryWrapper({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary>
      {children}
    </ErrorBoundary>
  );
}
