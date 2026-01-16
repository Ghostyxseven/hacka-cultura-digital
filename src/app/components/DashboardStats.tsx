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
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {statCards.map((stat) => (
        <div
          key={stat.label}
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-all border border-gray-100 hover:border-indigo-200"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-4xl">{stat.icon}</span>
            <div className="text-right">
              <h3 className="text-gray-600 text-sm font-medium mb-1">{stat.label}</h3>
              <p className="text-3xl font-bold text-indigo-600">
                {loading ? '...' : stat.value}
              </p>
              <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
