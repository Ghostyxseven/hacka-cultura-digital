// src/hooks/useFormValidation.ts
// Hook customizado para validação de formulários

import { useState, useCallback } from 'react';

export interface ValidationRule {
  validator: (value: any) => boolean;
  message: string;
}

export interface FieldValidation {
  [key: string]: ValidationRule[];
}

export interface FormErrors {
  [key: string]: string | undefined;
}

/**
 * Hook para validação de formulários
 * @param validationRules - Regras de validação por campo
 */
export function useFormValidation(validationRules: FieldValidation) {
  const [errors, setErrors] = useState<FormErrors>({});

  /**
   * Valida um campo específico
   */
  const validateField = useCallback((fieldName: string, value: any): string | undefined => {
    const rules = validationRules[fieldName];
    if (!rules) return undefined;

    for (const rule of rules) {
      if (!rule.validator(value)) {
        return rule.message;
      }
    }

    return undefined;
  }, [validationRules]);

  /**
   * Valida todos os campos do formulário
   */
  const validateForm = useCallback((formData: Record<string, any>): boolean => {
    const newErrors: FormErrors = {};

    Object.keys(validationRules).forEach((fieldName) => {
      const error = validateField(fieldName, formData[fieldName]);
      if (error) {
        newErrors[fieldName] = error;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [validationRules, validateField]);

  /**
   * Valida um campo e atualiza os erros
   */
  const validateAndSetError = useCallback((fieldName: string, value: any) => {
    const error = validateField(fieldName, value);
    setErrors((prev) => ({
      ...prev,
      [fieldName]: error,
    }));
    return !error;
  }, [validateField]);

  /**
   * Limpa os erros de um campo
   */
  const clearError = useCallback((fieldName: string) => {
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[fieldName];
      return newErrors;
    });
  }, []);

  /**
   * Limpa todos os erros
   */
  const clearAllErrors = useCallback(() => {
    setErrors({});
  }, []);

  /**
   * Retorna o erro de um campo
   */
  const getError = useCallback((fieldName: string): string | undefined => {
    return errors[fieldName];
  }, [errors]);

  return {
    errors,
    validateField,
    validateForm,
    validateAndSetError,
    clearError,
    clearAllErrors,
    getError,
  };
}
