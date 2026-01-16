'use client';

import { InputHTMLAttributes, TextareaHTMLAttributes, forwardRef } from 'react';

interface BaseFieldProps {
  label: string;
  error?: string;
  hint?: string;
  icon?: string;
  required?: boolean;
}

interface InputProps extends BaseFieldProps, InputHTMLAttributes<HTMLInputElement> {
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';
  textarea?: false;
}

interface TextareaProps extends BaseFieldProps, TextareaHTMLAttributes<HTMLTextAreaElement> {
  textarea: true;
}

type FormFieldProps = InputProps | TextareaProps;

/**
 * Componente de campo de formulário reutilizável com validação visual
 * Suporta input e textarea com feedback visual de erros
 * 
 * @example
 * <FormField
 *   label="Nome"
 *   value={name}
 *   onChange={(e) => setName(e.target.value)}
 *   error={errors.name}
 *   hint="Digite seu nome completo"
 *   required
 * />
 */
export const FormField = forwardRef<HTMLInputElement | HTMLTextAreaElement, FormFieldProps>(
  ({ label, error, hint, icon, required, textarea, className = '', ...props }, ref) => {
    const baseInputClasses = `
      w-full px-4 py-3 border rounded-xl
      focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
      shadow-sm hover:border-gray-400 transition-colors
      disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-gray-300
      ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300'}
    `;

    const labelClasses = `
      block text-sm font-semibold text-gray-700 mb-3
      flex items-center gap-2
      ${required ? '' : ''}
    `;

    if (textarea) {
      const { textarea: _, ...textareaProps } = props as TextareaProps;
      return (
        <div className="mb-6">
          <label htmlFor={textareaProps.id} className={labelClasses}>
            {icon && <span className="text-lg">{icon}</span>}
            {label}
            {required && <span className="text-red-500">*</span>}
            {!required && (
              <span className="text-gray-500 font-normal text-xs">(opcional)</span>
            )}
          </label>
          <textarea
            ref={ref as React.Ref<HTMLTextAreaElement>}
            className={`${baseInputClasses} ${className}`}
            {...textareaProps}
          />
          {error && (
            <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
              <span>⚠️</span>
              {error}
            </p>
          )}
          {hint && !error && (
            <p className="mt-2 text-xs text-gray-500 leading-relaxed">{hint}</p>
          )}
        </div>
      );
    }

    const inputProps = props as InputProps;
    return (
      <div className="mb-6">
        <label htmlFor={inputProps.id} className={labelClasses}>
          {icon && <span className="text-lg">{icon}</span>}
          {label}
          {required && <span className="text-red-500">*</span>}
          {!required && (
            <span className="text-gray-500 font-normal text-xs">(opcional)</span>
          )}
        </label>
        <input
          ref={ref as React.Ref<HTMLInputElement>}
          className={`${baseInputClasses} ${className}`}
          {...inputProps}
        />
        {error && (
          <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
            <span>⚠️</span>
            {error}
          </p>
        )}
        {hint && !error && (
          <p className="mt-2 text-xs text-gray-500 leading-relaxed">{hint}</p>
        )}
      </div>
    );
  }
);

FormField.displayName = 'FormField';
