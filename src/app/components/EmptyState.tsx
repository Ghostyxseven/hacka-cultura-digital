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
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-lg p-12 text-center border border-gray-200">
      <div className="text-7xl mb-6 animate-pulse">{icon}</div>
      <h3 className="text-2xl font-bold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-600 mb-8 max-w-md mx-auto leading-relaxed">{description}</p>
      <Link
        href={actionHref}
        className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-xl hover:from-indigo-700 hover:to-indigo-800 transition-all shadow-lg hover:shadow-xl font-semibold transform hover:scale-105"
      >
        <span className="mr-2 text-lg">+</span>
        {actionLabel}
      </Link>
    </div>
  );
}
