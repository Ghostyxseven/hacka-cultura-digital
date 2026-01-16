// src/components/ui/Skeleton.tsx
// Componente de skeleton loading para melhorar UX

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
  lines?: number;
}

export function Skeleton({ 
  className = '', 
  variant = 'rectangular',
  width,
  height,
  lines
}: SkeletonProps) {
  const baseClasses = 'animate-pulse bg-gray-200 rounded';
  
  const variantClasses = {
    text: 'h-4',
    circular: 'rounded-full',
    rectangular: 'rounded-lg'
  };

  const style: React.CSSProperties = {};
  if (width) style.width = typeof width === 'number' ? `${width}px` : width;
  if (height) style.height = typeof height === 'number' ? `${height}px` : height;

  if (lines && variant === 'text') {
    return (
      <div className={className}>
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={`${baseClasses} ${variantClasses[variant]} ${i < lines - 1 ? 'mb-2' : ''}`}
            style={i === lines - 1 ? { width: '75%' } : style}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      style={style}
    />
  );
}

// Skeleton específico para cards
export function CardSkeleton() {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6">
      <div className="flex items-start gap-4">
        <Skeleton variant="circular" width={48} height={48} />
        <div className="flex-1">
          <Skeleton variant="text" width="60%" height={24} className="mb-3" />
          <Skeleton variant="text" lines={2} />
        </div>
      </div>
    </div>
  );
}

// Skeleton para lista de cards
export function CardListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}

// Skeleton para página completa
export function PageSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton variant="rectangular" width="100%" height={200} className="mb-6" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Skeleton variant="rectangular" width="100%" height={120} />
        <Skeleton variant="rectangular" width="100%" height={120} />
        <Skeleton variant="rectangular" width="100%" height={120} />
      </div>
      <CardListSkeleton count={5} />
    </div>
  );
}
