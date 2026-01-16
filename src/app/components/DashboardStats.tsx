'use client';

interface DashboardStatsProps {
  stats: {
    totalSubjects: number;
    totalUnits: number;
    totalPlans: number;
  };
  loading?: boolean;
}

/**
 * Componente de estatísticas do dashboard
 * Exibe informações resumidas das disciplinas, unidades e planos
 * 
 * Características:
 * - Cards visuais com ícones intuitivos
 * - Estatísticas em tempo real
 * - Layout responsivo e minimalista
 */
export function DashboardStats({ stats, loading }: DashboardStatsProps) {
  const statCards = [
    {
      label: 'Disciplinas',
      value: stats.totalSubjects,
      icon: '📚',
      color: 'indigo',
      description: 'Cadastradas',
    },
    {
      label: 'Unidades/Aulas',
      value: stats.totalUnits,
      icon: '📖',
      color: 'blue',
      description: 'Criadas',
    },
    {
      label: 'Planos de Aula',
      value: stats.totalPlans,
      icon: '📋',
      color: 'purple',
      description: 'Gerados',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {statCards.map((stat) => (
        <div
          key={stat.label}
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-all border border-gray-200"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">{stat.icon}</span>
                <h3 className="text-gray-700 text-sm font-semibold uppercase tracking-wide">
                  {stat.label}
                </h3>
              </div>
              <p className="text-4xl font-bold text-gray-900 mb-1">
                {loading ? '...' : stat.value}
              </p>
              <p className="text-xs text-gray-500">{stat.description}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
