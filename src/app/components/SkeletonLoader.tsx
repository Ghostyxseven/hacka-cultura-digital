'use client';

/**
 * Componente Skeleton Loader para estados de carregamento
 * Fornece feedback visual durante o carregamento de dados
 */

interface SkeletonLoaderProps {
  /** Número de itens skeleton a exibir */
  count?: number;
  /** Altura do skeleton (ex: 'h-20', 'h-32') */
  height?: string;
  /** Classe CSS adicional */
  className?: string;
}

/**
 * Skeleton loader simples (barra animada)
 */
export function SkeletonLoader({ count = 1, height = 'h-20', className = '' }: SkeletonLoaderProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className={`bg-gray-200 rounded-lg animate-pulse ${height} ${className}`}
          aria-hidden="true"
        />
      ))}
    </>
  );
}

/**
 * Skeleton loader para cards de disciplinas
 */
export function SubjectCardSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 animate-pulse">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-gray-300 rounded-lg"></div>
        <div className="flex-1 space-y-3">
          <div className="h-6 bg-gray-300 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          <div className="flex gap-2 mt-4">
            <div className="h-6 bg-gray-200 rounded-full w-16"></div>
            <div className="h-6 bg-gray-200 rounded-full w-20"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Skeleton loader para cards de unidades
 */
export function UnitCardSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 animate-pulse">
      <div className="space-y-3">
        <div className="h-6 bg-gray-300 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="flex gap-2 mt-4">
          <div className="h-8 bg-gray-200 rounded w-24"></div>
          <div className="h-8 bg-gray-200 rounded w-24"></div>
        </div>
      </div>
    </div>
  );
}

/**
 * Skeleton loader para listas
 */
export function ListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="bg-white rounded-lg p-4 border border-gray-200 animate-pulse">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
            <div className="flex-1 space-y-2">
              <div className="h-5 bg-gray-300 rounded w-2/3"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Skeleton loader para grid de cards
 */
export function GridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <SubjectCardSkeleton key={index} />
      ))}
    </div>
  );
}
