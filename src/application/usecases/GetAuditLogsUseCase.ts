// src/application/usecases/GetAuditLogsUseCase.ts
import { AuditLog, AuditActionType, AuditSeverity } from '../../core/entities/AuditLog';
import { IAuditLogRepository } from '../../core/repositories/IAuditLogRepository';

export interface GetAuditLogsRequest {
  action?: AuditActionType;
  severity?: AuditSeverity;
  userId?: string;
  resourceType?: string;
  resourceId?: string;
  startDate?: Date;
  endDate?: Date;
  unreviewedOnly?: boolean;
  limit?: number; // Limite de resultados
  offset?: number; // Paginação
}

/**
 * Caso de uso: Buscar logs de auditoria
 * Permite filtrar e buscar logs com diversos critérios
 */
export class GetAuditLogsUseCase {
  constructor(private repository: IAuditLogRepository) {}

  execute(request: GetAuditLogsRequest = {}): AuditLog[] {
    let logs: AuditLog[];

    // Busca base
    if (request.unreviewedOnly) {
      logs = this.repository.getUnreviewed();
    } else if (request.action) {
      logs = this.repository.findByAction(request.action);
    } else if (request.severity) {
      logs = this.repository.findBySeverity(request.severity);
    } else if (request.userId) {
      logs = this.repository.findByUser(request.userId);
    } else if (request.resourceType && request.resourceId) {
      logs = this.repository.findByResource(request.resourceType, request.resourceId);
    } else if (request.startDate && request.endDate) {
      logs = this.repository.findByDateRange(request.startDate, request.endDate);
    } else {
      logs = this.repository.getAll();
    }

    // Aplica filtros adicionais
    if (request.action && !request.unreviewedOnly) {
      logs = logs.filter(log => log.action === request.action);
    }

    if (request.severity && !request.unreviewedOnly) {
      logs = logs.filter(log => log.severity === request.severity);
    }

    if (request.userId && !request.userId) {
      logs = logs.filter(log => log.userId === request.userId);
    }

    // Ordena por data (mais recentes primeiro)
    logs.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

    // Aplica paginação
    const offset = request.offset || 0;
    const limit = request.limit || 100;

    return logs.slice(offset, offset + limit);
  }
}
