import type { AuditLog } from '@/core/entities/AuditLog';

/**
 * Interface do repositório de logs de auditoria
 */
export interface IAuditLogRepository {
  /** Busca todos os logs de auditoria */
  findAll(): Promise<AuditLog[]>;
  /** Busca logs por tipo de ação */
  findByAction(action: AuditLog['action']): Promise<AuditLog[]>;
  /** Busca logs por tipo de entidade */
  findByEntityType(entityType: AuditLog['entityType']): Promise<AuditLog[]>;
  /** Busca logs por ID de entidade */
  findByEntityId(entityId: string): Promise<AuditLog[]>;
  /** Cria um novo log de auditoria */
  create(log: Omit<AuditLog, 'id' | 'timestamp'>): Promise<AuditLog>;
  /** Deleta logs antigos (limpeza) */
  deleteOlderThan(days: number): Promise<number>;
}
