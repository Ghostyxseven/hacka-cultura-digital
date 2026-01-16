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
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {statCards.map((stat) => (
        <div
          key={stat.label}
          className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-all border border-gray-200 group"
        >
          <div className="flex items-center justify-between">
            <span className="text-4xl">{stat.icon}</span>
            <div className="text-right">
              <h3 className="text-gray-700 text-xs font-bold uppercase tracking-wide mb-2">
                {stat.label}
              </h3>
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
