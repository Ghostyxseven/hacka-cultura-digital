// src/components/ui/Textarea.tsx
// Componente de Textarea reutilizável com validação e feedback visual

import { TextareaHTMLAttributes, forwardRef } from 'react';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
  label?: string;
  helperText?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ error, label, helperText, className = '', ...props }, ref) => {
    const hasError = !!error;
    
    const baseClasses = 'w-full px-4 py-2 border rounded-lg transition-colors focus:outline-none focus:ring-2 resize-y';
    const errorClasses = hasError 
      ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
      : 'border-gray-300 focus:ring-primary-500 focus:border-transparent';
    const disabledClasses = props.disabled ? 'bg-gray-100 cursor-not-allowed opacity-60' : 'bg-white';

    return (
      <div className="w-full">
        {label && (
          <label 
            htmlFor={props.id} 
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          className={`${baseClasses} ${errorClasses} ${disabledClasses} ${className}`}
          aria-invalid={hasError}
          aria-describedby={hasError ? `${props.id}-error` : helperText ? `${props.id}-helper` : undefined}
          {...props}
        />
        {error && (
          <p 
            id={props.id ? `${props.id}-error` : undefined}
            className="mt-1 text-sm text-red-600" 
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

Textarea.displayName = 'Textarea';
