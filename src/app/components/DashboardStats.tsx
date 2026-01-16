'use client';

import type { Subject } from '@/application/viewmodels';

interface DashboardStatsProps {
  subjects: Subject[];
  loading?: boolean;
}

/**
 * Componente de estatísticas do dashboard
 * Exibe informações resumidas das disciplinas, unidades e planos
 */
export function DashboardStats({ subjects, loading }: DashboardStatsProps) {
  // TODO: Calcular unidades e planos reais quando houver acesso aos dados
  const totalSubjects = subjects.length;
  const totalUnits = 0; // Será calculado quando houver acesso aos dados
  const totalPlans = 0; // Será calculado quando houver acesso aos dados

  const stats = [
    {
      label: 'Disciplinas',
      value: totalSubjects,
      icon: '📚',
    },
    {
      label: 'Unidades',
      value: totalUnits,
      icon: '📖',
    },
    {
      label: 'Planos de Aula',
      value: totalPlans,
      icon: '📋',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {stats.map((stat) => (
        <div key={stat.label} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-gray-600 text-sm font-medium mb-2">{stat.label}</h3>
              <p className="text-3xl font-bold text-indigo-600">
                {loading ? '...' : stat.value}
              </p>
            </div>
            <span className="text-4xl">{stat.icon}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
