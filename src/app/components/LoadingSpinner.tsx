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
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className={`inline-block animate-spin rounded-full border-b-2 border-indigo-600 ${sizeClasses[size]} mb-4`}></div>
      <p className="text-gray-600">{message}</p>
    </div>
  );
}
