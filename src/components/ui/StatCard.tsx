// src/components/ui/StatCard.tsx

interface StatCardProps {
  title: string;
  value: string | number;
}

export function StatCard({ title, value }: StatCardProps) {
  return (
    <div className="group relative bg-white rounded-xl shadow-md hover:shadow-xl border border-gray-200 hover:border-primary-300 p-6 transition-all duration-300 overflow-hidden">
      {/* Gradiente sutil no hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-50/0 to-primary-100/0 group-hover:from-primary-50/50 group-hover:to-primary-100/30 transition-all duration-300 pointer-events-none" />
      
      <div className="relative">
        <h3 className="text-sm font-medium text-gray-600 uppercase tracking-wide mb-2">
          {title}
        </h3>
        <p className="text-4xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors duration-300">
          {value}
        </p>
      </div>
    </div>
  );
}
