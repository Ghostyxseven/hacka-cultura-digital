'use client';

import Link from 'next/link';

interface ActionButtonProps {
  href?: string;
  onClick?: () => void;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger';
  icon?: string;
  disabled?: boolean;
  type?: 'button' | 'submit';
}

/**
 * Componente de botão de ação reutilizável
 * Suporta link ou botão com diferentes variantes
 */
export function ActionButton({
  href,
  onClick,
  children,
  variant = 'primary',
  icon,
  disabled = false,
  type = 'button',
}: ActionButtonProps) {
  const baseClasses = 'inline-flex items-center px-6 py-3 rounded-lg font-medium transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variantClasses = {
    primary: 'bg-indigo-600 text-white hover:bg-indigo-700',
    secondary: 'bg-gray-200 text-gray-700 hover:bg-gray-300',
    danger: 'bg-red-600 text-white hover:bg-red-700',
  };

  const classes = `${baseClasses} ${variantClasses[variant]}`;

  if (href && !disabled) {
    return (
      <Link href={href} className={classes}>
        {icon && <span className="mr-2">{icon}</span>}
        {children}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={classes}>
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  );
}
