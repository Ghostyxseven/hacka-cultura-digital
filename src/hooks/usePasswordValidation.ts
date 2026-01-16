// src/hooks/usePasswordValidation.ts
import { useState, useCallback } from 'react';

interface PasswordValidationOptions {
  minLength?: number;
  requireConfirmation?: boolean;
  confirmationPassword?: string;
}

/**
 * Hook para validação de senha
 */
export function usePasswordValidation(options: PasswordValidationOptions = {}) {
  const { minLength = 4, requireConfirmation = false, confirmationPassword = '' } = options;
  const [error, setError] = useState<string | undefined>();
  const [confirmationError, setConfirmationError] = useState<string | undefined>();

  const validate = useCallback((password: string): boolean => {
    if (!password) {
      setError('Senha é obrigatória');
      return false;
    }

    if (password.length < minLength) {
      setError(`Senha deve ter pelo menos ${minLength} caracteres`);
      return false;
    }

    if (requireConfirmation && confirmationPassword && password !== confirmationPassword) {
      setConfirmationError('Senhas não coincidem');
      return false;
    }

    setError(undefined);
    setConfirmationError(undefined);
    return true;
  }, [minLength, requireConfirmation, confirmationPassword]);

  const validateConfirmation = useCallback((password: string, confirmation: string): boolean => {
    if (!confirmation) {
      setConfirmationError('Confirmação de senha é obrigatória');
      return false;
    }

    if (password !== confirmation) {
      setConfirmationError('Senhas não coincidem');
      return false;
    }

    setConfirmationError(undefined);
    return true;
  }, []);

  const clearErrors = useCallback(() => {
    setError(undefined);
    setConfirmationError(undefined);
  }, []);

  return { error, confirmationError, validate, validateConfirmation, clearErrors };
}
