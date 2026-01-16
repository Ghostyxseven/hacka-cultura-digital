// src/components/layout/PageContainer.tsx
import { ReactNode } from 'react';

interface PageContainerProps {
  children: ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '7xl';
  className?: string;
}

const maxWidthClasses = {
  sm: 'max-w-sm',
  md: 'max-w-4xl',
  lg: 'max-w-5xl',
  xl: 'max-w-6xl',
  '2xl': 'max-w-2xl',
  '7xl': 'max-w-7xl',
};

export function PageContainer({ children, maxWidth = '7xl', className = '' }: PageContainerProps) {
  return (
    <main className={`${maxWidthClasses[maxWidth]} mx-auto px-4 sm:px-6 lg:px-8 py-8 ${className}`}>
      {children}
    </main>
  );
}
