// src/components/layout/Header.tsx
import Link from 'next/link';
import { ReactNode } from 'react';

interface HeaderProps {
  title: string;
  subtitle?: string;
  backHref?: string;
  backLabel?: string;
}

export function Header({ title, subtitle, backHref, backLabel = '← Voltar' }: HeaderProps) {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {backHref && (
          <Link href={backHref} className="text-primary-600 hover:text-primary-700">
            {backLabel}
          </Link>
        )}
        <h1 className="text-2xl font-bold text-gray-900 mt-2">{title}</h1>
        {subtitle && (
          <p className="text-sm text-gray-600 mt-1">{subtitle}</p>
        )}
      </div>
    </header>
  );
}
