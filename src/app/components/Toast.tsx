'use client';

import { useEffect } from 'react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastProps {
  message: string;
  type?: ToastType;
  duration?: number;
  onClose: () => void;
}

/**
 * Componente de notificação Toast
 * Exibe mensagens de feedback temporárias
 * 
 * @example
 * <Toast message="Salvo com sucesso!" type="success" onClose={() => setShowToast(false)} />
 */
export function Toast({ message, type = 'info', duration = 4000, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const typeStyles = {
    success: 'bg-gradient-to-r from-green-500 to-emerald-600 text-white border-green-400',
    error: 'bg-gradient-to-r from-red-500 to-red-600 text-white border-red-400',
    info: 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white border-blue-400',
    warning: 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-yellow-400',
  };

  const typeIcons = {
    success: '✅',
    error: '❌',
    info: 'ℹ️',
    warning: '⚠️',
  };

  return (
    <div
      className={`
        fixed top-4 right-4 z-50 min-w-[300px] max-w-md
        ${typeStyles[type]}
        rounded-xl shadow-2xl p-4
        flex items-center gap-3
        animate-in slide-in-from-right
        border-2
      `}
      role="alert"
    >
      <span className="text-2xl flex-shrink-0">{typeIcons[type]}</span>
      <p className="flex-1 font-semibold text-sm leading-relaxed">{message}</p>
      <button
        onClick={onClose}
        className="flex-shrink-0 hover:opacity-80 transition-opacity text-lg font-bold"
        aria-label="Fechar notificação"
      >
        ×
      </button>
    </div>
  );
}

interface ToastContainerProps {
  toasts: Array<{ id: string; message: string; type?: ToastType }>;
  onRemove: (id: string) => void;
}

/**
 * Container para gerenciar múltiplos toasts
 */
export function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => onRemove(toast.id)}
          />
        </div>
      ))}
    </div>
  );
}
