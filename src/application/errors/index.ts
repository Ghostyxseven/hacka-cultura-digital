/**
 * Erros personalizados da camada Application
 * 
 * Erros específicos para casos de uso e serviços de aplicação
 */

/**
 * Erro base para erros da camada Application
 */
export class ApplicationError extends Error {
  constructor(message: string, public code: string) {
    super(message);
    this.name = 'ApplicationError';
  }
}

/**
 * Erro quando uma entidade não é encontrada
 */
export class NotFoundError extends ApplicationError {
  constructor(resource: string, id: string) {
    super(`${resource} com ID "${id}" não encontrado(a)`, 'NOT_FOUND');
    this.name = 'NotFoundError';
  }
}

/**
 * Erro quando dados de entrada são inválidos
 */
export class ValidationError extends ApplicationError {
  constructor(message: string, public field?: string) {
    super(message, 'VALIDATION_ERROR');
    this.name = 'ValidationError';
  }
}

/**
 * Erro quando uma operação não é permitida
 */
export class ForbiddenError extends ApplicationError {
  constructor(message: string) {
    super(message, 'FORBIDDEN');
    this.name = 'ForbiddenError';
  }
}

/**
 * Erro quando um serviço externo (ex: IA) falha
 */
export class ServiceUnavailableError extends ApplicationError {
  constructor(service: string, message?: string) {
    super(
      message || `Serviço ${service} não está disponível no momento`,
      'SERVICE_UNAVAILABLE'
    );
    this.name = 'ServiceUnavailableError';
  }
}
