// src/application/usecases/ReviewAuditLogUseCase.ts
import { IAuditLogRepository } from '../../core/repositories/IAuditLogRepository';

export interface ReviewAuditLogRequest {
  logId: string;
  reviewedBy: string; // ID do admin
  notes?: string;
}

/**
 * Caso de uso: Revisar log de auditoria
 * Permite que admins marquem logs como revisados
 */
export class ReviewAuditLogUseCase {
  constructor(private repository: IAuditLogRepository) {}

  execute(request: ReviewAuditLogRequest): void {
    if (!request.logId) {
      throw new Error('ID do log é obrigatório');
    }

    if (!request.reviewedBy) {
      throw new Error('ID do revisor é obrigatório');
    }

    const log = this.repository.getById(request.logId);

    if (!log) {
      throw new Error('Log não encontrado');
    }

    if (log.reviewed) {
      throw new Error('Log já foi revisado');
    }

    this.repository.markAsReviewed(request.logId, request.reviewedBy, request.notes);
  }
}
