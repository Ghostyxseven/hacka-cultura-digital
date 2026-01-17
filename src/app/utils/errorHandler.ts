/**
 * Utilitário para tratamento centralizado de erros
 * 
 * Fornece funções auxiliares para converter erros da Application layer
 * em mensagens amigáveis para o usuário e tipos apropriados para Toast
 */

import {
  NotFoundError,
  ValidationError,
  ServiceUnavailableError,
  ApplicationError,
} from '@/application/errors';
import { ArchivePolicyError } from '@/core/policies';

/**
 * Obtém uma mensagem de erro amigável para o usuário
 * 
 * @param error - Erro capturado
 * @returns Mensagem formatada para exibição ao usuário
 * 
 * @example
 * ```typescript
 * try {
 *   await someOperation();
 * } catch (error) {
 *   const message = getErrorMessage(error);
 *   showToast(message, 'error');
 * }
 * ```
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof NotFoundError) {
    return `Não encontrado: ${error.message}`;
  }

  if (error instanceof ValidationError) {
    return `Validação: ${error.message}`;
  }

  if (error instanceof ArchivePolicyError) {
    return error.message;
  }

  if (error instanceof ServiceUnavailableError) {
    return `Serviço indisponível: ${error.message}`;
  }

  if (error instanceof ApplicationError) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message || 'Erro desconhecido';
  }

  return 'Erro desconhecido. Tente novamente.';
}

/**
 * Determina o tipo de Toast apropriado para o erro
 * 
 * @param error - Erro capturado
 * @returns Tipo de Toast ('error', 'warning' ou 'info')
 * 
 * @example
 * ```typescript
 * const toastType = getErrorToastType(error);
 * showToast(getErrorMessage(error), toastType);
 * ```
 */
export function getErrorToastType(error: unknown): 'error' | 'warning' | 'info' {
  if (error instanceof NotFoundError) {
    return 'warning';
  }

  if (error instanceof ValidationError) {
    return 'error';
  }

  if (error instanceof ArchivePolicyError) {
    return 'warning'; // Aviso para regras de bloqueio
  }

  if (error instanceof ServiceUnavailableError) {
    return 'warning';
  }

  return 'error';
}

/**
 * Verifica se um erro é recuperável (pode ser tentado novamente)
 * 
 * @param error - Erro capturado
 * @returns `true` se o erro é recuperável, `false` caso contrário
 * 
 * @example
 * ```typescript
 * if (isRetryableError(error)) {
 *   // Mostrar botão "Tentar novamente"
 * }
 * ```
 */
export function isRetryableError(error: unknown): boolean {
  return error instanceof ServiceUnavailableError;
}

/**
 * Extrai informações detalhadas do erro para logging
 * 
 * @param error - Erro capturado
 * @returns Objeto com informações detalhadas do erro
 */
export function getErrorDetails(error: unknown): {
  message: string;
  type: string;
  code?: string;
  field?: string;
} {
  if (error instanceof ApplicationError) {
    return {
      message: error.message,
      type: error.constructor.name,
      code: error.code,
      ...(error instanceof ValidationError && error.field ? { field: error.field } : {}),
    };
  }

  if (error instanceof Error) {
    return {
      message: error.message,
      type: error.constructor.name,
    };
  }

  return {
    message: 'Erro desconhecido',
    type: 'Unknown',
  };
}
