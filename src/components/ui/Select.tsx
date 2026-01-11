// src/components/ui/Select.tsx
// Componente de Select reutilizável com validação e feedback visual

import { SelectHTMLAttributes, forwardRef } from 'react';

interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  error?: string;
  label?: string;
  helperText?: string;
  options: SelectOption[];
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ error, label, helperText, options, placeholder, className = '', ...props }, ref) => {
    const hasError = !!error;
    
    const baseClasses = 'w-full px-4 py-2 border rounded-lg transition-colors focus:outline-none focus:ring-2 bg-white';
    const errorClasses = hasError 
      ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
      : 'border-gray-300 focus:ring-primary-500 focus:border-transparent';
    const disabledClasses = props.disabled ? 'bg-gray-100 cursor-not-allowed opacity-60' : '';

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
        <select
          ref={ref}
          className={`${baseClasses} ${errorClasses} ${disabledClasses} ${className}`}
          aria-invalid={hasError}
          aria-describedby={hasError ? `${props.id}-error` : helperText ? `${props.id}-helper` : undefined}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option 
              key={option.value} 
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </option>
          ))}
        </select>
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

Select.displayName = 'Select';
