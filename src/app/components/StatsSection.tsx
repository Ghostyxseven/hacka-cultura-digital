// src/app/components/StatsSection.tsx
// Componente reutilizável para seção de estatísticas
import { StatCard } from '@/components/ui/StatCard';

interface Stat {
  title: string;
  value: number;
  href?: string;
  icon?: string;
  description?: string;
}

interface StatsSectionProps {
  stats: Stat[];
}

export function StatsSection({ stats }: StatsSectionProps) {
  const icons = ['📚', '📖', '📝', '👥'];
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats.map((stat, index) => (
        <StatCard 
          key={index} 
          title={stat.title} 
          value={stat.value} 
          href={stat.href}
          icon={stat.icon || icons[index % icons.length]}
          description={stat.description}
        />
      ))}
    </div>
  );
}
