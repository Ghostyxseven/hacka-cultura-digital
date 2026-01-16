// src/components/ui/Input.tsx
// Componente de Input reutilizável com validação e feedback visual

import { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  label?: string;
  helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ error, label, helperText, className = '', ...props }, ref) => {
    const hasError = !!error;

    const baseClasses = 'w-full px-4 py-2 border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 text-text-main';
    const errorClasses = hasError
      ? 'border-error focus:ring-error/20 focus:border-error bg-red-50/10'
      : 'border-border bg-surface hover:border-gray-400 focus:ring-primary-500/20 focus:border-primary-500 shadow-sm';
    const disabledClasses = props.disabled ? 'bg-secondary/50 cursor-not-allowed opacity-60' : '';

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={props.id}
            className="block text-sm font-medium text-text-secondary mb-2"
          >
            {label}
            {props.required && <span className="text-error ml-1">*</span>}
          </label>
        )}
        <input
          ref={ref}
          className={`${baseClasses} ${errorClasses} ${disabledClasses} ${className}`}
          aria-invalid={hasError}
          aria-describedby={hasError ? `${props.id}-error` : helperText ? `${props.id}-helper` : undefined}
          {...props}
        />
        {error && (
          <p
            id={props.id ? `${props.id}-error` : undefined}
            className="mt-1 text-sm text-error font-medium"
            role="alert"
          >
            {error}
          </p>
        )}
        {helperText && !error && (
          <p
            id={props.id ? `${props.id}-helper` : undefined}
            className="mt-1 text-sm text-gray-500"
          >
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
