// src/hooks/useEmailValidation.ts
import { useState, useCallback } from 'react';

/**
 * Hook para validação de email
 */
export function useEmailValidation() {
  const [error, setError] = useState<string | undefined>();

  const validate = useCallback((email: string, checkExists?: (email: string) => boolean): boolean => {
    if (!email.trim()) {
      setError('Email é obrigatório');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Email inválido');
      return false;
    }

    if (checkExists && checkExists(email)) {
      setError('Email já cadastrado');
      return false;
    }

    setError(undefined);
    return true;
  }, []);

  const clearError = useCallback(() => {
    setError(undefined);
  }, []);

  return { error, validate, clearError };
}
