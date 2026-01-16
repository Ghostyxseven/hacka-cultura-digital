// src/components/ui/StatCard.tsx

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: string;
  className?: string;
}

export function StatCard({ title, value, description, icon, className = '' }: StatCardProps) {
  return (
    <div className={`group relative bg-white rounded-xl shadow-md hover:shadow-xl border border-gray-200 hover:border-primary-300 p-6 transition-all duration-300 overflow-hidden ${className}`}>
      {/* Gradiente sutil no hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-50/0 to-primary-100/0 group-hover:from-primary-50/50 group-hover:to-primary-100/30 transition-all duration-300 pointer-events-none" />
      
      <div className="relative">
        <div className="flex items-center gap-2 mb-2">
          {icon && <span className="text-2xl">{icon}</span>}
          <h3 className="text-sm font-medium text-gray-600 uppercase tracking-wide">
            {title}
          </h3>
        </div>
        <p className="text-4xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors duration-300">
          {value}
        </p>
        {description && (
          <p className="text-sm text-gray-500 mt-2">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}
