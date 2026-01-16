'use client';

interface LoadingSpinnerProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Componente de loading reutilizável
 * Exibe spinner de carregamento com mensagem opcional
 */
export function LoadingSpinner({ message = 'Carregando...', size = 'md' }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-6 w-6 border-2',
    md: 'h-10 w-10 border-3',
    lg: 'h-16 w-16 border-4',
  };

  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className={`relative ${sizeClasses[size]}`}>
        <div className={`absolute inset-0 rounded-full border-transparent border-t-indigo-600 border-r-purple-600 animate-spin ${sizeClasses[size]}`}></div>
        <div className={`absolute inset-0 rounded-full border-transparent border-t-purple-600 border-r-indigo-600 animate-spin ${sizeClasses[size]}`} style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
      </div>
      <p className="text-gray-700 font-medium mt-6 text-base animate-pulse">{message}</p>
    </div>
  );
}
