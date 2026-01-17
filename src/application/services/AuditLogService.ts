/**
 * Serviço de Aplicação: Logs de Auditoria
 * 
 * Gerencia logs de ações importantes do sistema:
 * - Arquivamento/desarquivamento
 * - Exclusão permanente
 * - Geração de materiais
 * - Restauração da lixeira
 * 
 * Clean Architecture: Application Layer - Serviço de Aplicação
 */

import { AuditLog, AuditActionType } from '@/core/entities/AuditLog';
import { IAuditLogRepository } from '@/repository/interfaces/IAuditLogRepository';

export interface LogActionParams {
  action: AuditActionType;
  entityType: AuditLog['entityType'];
  entityId: string;
  entityName: string;
  userId?: string;
  metadata?: Record<string, any>;
}

export class AuditLogService {
  constructor(private readonly auditLogRepository: IAuditLogRepository) {}

  /**
   * Registra uma ação no log de auditoria
   */
  async log(params: LogActionParams): Promise<AuditLog> {
    return this.auditLogRepository.create({
      action: params.action,
      entityType: params.entityType,
      entityId: params.entityId,
      entityName: params.entityName,
      userId: params.userId,
      metadata: params.metadata,
    });
  }

  /**
   * Busca todos os logs de auditoria
   */
  async findAll(): Promise<AuditLog[]> {
    return this.auditLogRepository.findAll();
  }

  /**
   * Busca logs por tipo de ação
   */
  async findByAction(action: AuditActionType): Promise<AuditLog[]> {
    return this.auditLogRepository.findByAction(action);
  }

  /**
   * Busca logs por tipo de entidade
   */
  async findByEntityType(entityType: AuditLog['entityType']): Promise<AuditLog[]> {
    return this.auditLogRepository.findByEntityType(entityType);
  }

  /**
   * Busca logs por ID de entidade
   */
  async findByEntityId(entityId: string): Promise<AuditLog[]> {
    return this.auditLogRepository.findByEntityId(entityId);
  }

  /**
   * Limpa logs antigos (mais de N dias)
   */
  async cleanOldLogs(days: number = 90): Promise<number> {
    return this.auditLogRepository.deleteOlderThan(days);
  }
}
