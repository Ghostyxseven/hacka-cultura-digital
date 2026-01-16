// src/components/ui/StatCard.tsx
import Link from 'next/link';

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: string;
  className?: string;
}

export function StatCard({ title, value, description, icon, className = '', href }: StatCardProps & { href?: string }) {
  const content = (
    <div className={`group relative bg-surface rounded-xl shadow-sm hover:shadow-lg border border-border hover:border-primary/50 p-6 transition-all duration-300 overflow-hidden ${className}`}>
      {/* Gradiente sutil no hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-primary/0 group-hover:from-primary/5 group-hover:to-primary/10 transition-all duration-300 pointer-events-none" />

      <div className="relative">
        <div className="flex items-center gap-2 mb-2">
          {icon && <span className="text-2xl">{icon}</span>}
          <h3 className="text-sm font-medium text-text-secondary uppercase tracking-wide">
            {title}
          </h3>
        </div>
        <p className="text-4xl font-bold text-text-main group-hover:text-primary transition-colors duration-300">
          {value}
        </p>
        {description && (
          <p className="text-sm text-text-secondary mt-2">
            {description}
          </p>
        )}
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="block transition-transform hover:-translate-y-1">
        {content}
      </Link>
    );
  }

  return content;
}
