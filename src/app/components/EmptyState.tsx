'use client';

import Link from 'next/link';

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel: string;
  actionHref: string;
  icon?: string;
}

/**
 * Componente de estado vazio reutilizável
 * Usado quando não há dados para exibir
 */
export function EmptyState({ title, description, actionLabel, actionHref, icon = '📋' }: EmptyStateProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-12 text-center">
      <div className="text-6xl mb-4">{icon}</div>
      <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-600 mb-6">{description}</p>
      <Link
        href={actionHref}
        className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-md"
      >
        {actionLabel}
      </Link>
    </div>
  );
}
