// src/components/ui/ConfirmDeleteButton.tsx
'use client';

import { useState } from 'react';

interface ConfirmDeleteButtonProps {
  onConfirm: () => void;
  itemName?: string;
  disabled?: boolean;
  className?: string;
  ariaLabel?: string;
}

/**
 * Componente reutilizável para botão de exclusão com confirmação
 * Requer dois cliques para confirmar a exclusão
 */
export function ConfirmDeleteButton({
  onConfirm,
  itemName,
  disabled = false,
  className = '',
  ariaLabel,
}: ConfirmDeleteButtonProps) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (showConfirm && !isDeleting) {
      setIsDeleting(true);
      onConfirm();
      setTimeout(() => {
        setIsDeleting(false);
        setShowConfirm(false);
      }, 500);
    } else {
      setShowConfirm(true);
    }
  };

  const handleCancel = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowConfirm(false);
  };

  if (!showConfirm) {
    const deleteLabel = ariaLabel || (itemName ? `Excluir ${itemName}` : 'Excluir');
    return (
      <button
        onClick={handleDelete}
        disabled={disabled}
        className={`opacity-0 group-hover:opacity-100 p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 ${className}`}
        title={deleteLabel}
        aria-label={deleteLabel}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    );
  }

  return (
    <div 
      className={`flex gap-2 opacity-100 ${className}`}
      role="group"
      aria-label="Confirmação de exclusão"
    >
      <button
        onClick={handleDelete}
        disabled={isDeleting || disabled}
        className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-all disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        title="Confirmar exclusão"
        aria-label={`Confirmar exclusão de ${itemName || 'item'}`}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </button>
      <button
        onClick={handleCancel}
        disabled={isDeleting}
        className="p-1.5 text-gray-600 hover:bg-gray-50 rounded-lg transition-all disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
        title="Cancelar"
        aria-label="Cancelar exclusão"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}
