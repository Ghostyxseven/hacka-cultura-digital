// src/app/components/StatsSection.tsx
// Componente reutilizável para seção de estatísticas
import { StatCard } from '@/components/ui/StatCard';

interface Stat {
  title: string;
  value: number;
}

interface StatsSectionProps {
  stats: Stat[];
}

export function StatsSection({ stats }: StatsSectionProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {stats.map((stat, index) => (
        <StatCard key={index} title={stat.title} value={stat.value} />
      ))}
    </div>
  );
}
