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
  className = '',
}: ActionButtonProps & { className?: string }) {
  const baseClasses = 'inline-flex items-center justify-center px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]';
  
  const variantClasses = {
    primary: 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white hover:from-indigo-700 hover:to-indigo-800',
    secondary: 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 hover:from-gray-200 hover:to-gray-300 border border-gray-300',
    danger: 'bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800',
  };

  const classes = `${baseClasses} ${variantClasses[variant]} ${className}`;

  if (href && !disabled) {
    return (
      <Link 
        href={href} 
        className={classes}
        aria-label={typeof children === 'string' ? children : undefined}
        role="button"
        tabIndex={disabled ? -1 : 0}
      >
        {icon && <span className="mr-2 text-lg" aria-hidden="true">{icon}</span>}
        {children}
      </Link>
    );
  }

  return (
    <button 
      type={type} 
      onClick={onClick} 
      disabled={disabled} 
      className={classes}
      aria-label={typeof children === 'string' ? children : undefined}
      aria-disabled={disabled}
    >
      {icon && <span className="mr-2 text-lg" aria-hidden="true">{icon}</span>}
      {children}
    </button>
  );
}
