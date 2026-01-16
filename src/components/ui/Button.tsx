// src/components/ui/Button.tsx
import { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
  ariaLabel?: string;
}

export function Button({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  ariaLabel,
  type = 'button',
  ...props
}: ButtonProps) {
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg',
  };

  const baseClasses = `${sizeClasses[size]} rounded-lg transition-colors disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-offset-2`;

  const variantClasses = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500 shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all',
    secondary: 'bg-surface border border-border text-text-main hover:bg-secondary/50 focus:ring-secondary-500 hover:border-gray-400 shadow-sm hover:shadow',
    success: 'bg-success text-white hover:brightness-110 focus:ring-success shadow-md',
    danger: 'bg-error text-white hover:brightness-110 focus:ring-error shadow-md',
    outline: 'bg-transparent border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-500',
    ghost: 'bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-500',
  };

  return (
    <button
      type={type}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      aria-label={ariaLabel || (typeof children === 'string' ? children : undefined)}
      {...props}
    >
      {children}
    </button>
  );
}
