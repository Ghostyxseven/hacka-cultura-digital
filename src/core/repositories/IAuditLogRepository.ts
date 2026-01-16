// src/core/repositories/IAuditLogRepository.ts
import { AuditLog, AuditActionType, AuditSeverity } from '../entities/AuditLog';

/**
 * Interface para repositório de logs de auditoria
 */
export interface IAuditLogRepository {
  /**
   * Salva um log de auditoria
   */
  save(log: AuditLog): void;

  /**
   * Busca todos os logs
   */
  getAll(): AuditLog[];

  /**
   * Busca um log por ID
   */
  getById(id: string): AuditLog | undefined;

  /**
   * Busca logs por tipo de ação
   */
  findByAction(action: AuditActionType): AuditLog[];

  /**
   * Busca logs por severidade
   */
  findBySeverity(severity: AuditSeverity): AuditLog[];

  /**
   * Busca logs por usuário
   */
  findByUser(userId: string): AuditLog[];

  /**
   * Busca logs por recurso
   */
  findByResource(resourceType: string, resourceId: string): AuditLog[];

  /**
   * Busca logs por período
   */
  findByDateRange(startDate: Date, endDate: Date): AuditLog[];

  /**
   * Busca logs não revisados
   */
  getUnreviewed(): AuditLog[];

  /**
   * Marca um log como revisado
   */
  markAsReviewed(logId: string, reviewedBy: string, notes?: string): void;

  /**
   * Exclui logs antigos (mais de X dias)
   */
  deleteOldLogs(daysToKeep: number): number; // Retorna quantidade excluída
}
