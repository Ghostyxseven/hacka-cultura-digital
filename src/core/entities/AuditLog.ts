/**
 * Entidade de Domínio: Log de Auditoria (Audit Log)
 * 
 * Registra ações importantes do sistema para auditoria e histórico:
 * - Arquivamento/desarquivamento
 * - Exclusão permanente
 * - Modificações críticas
 * 
 * Clean Architecture: Core Layer - Entidade de Domínio
 */

export type AuditActionType =
  | 'ARCHIVE_SUBJECT'
  | 'UNARCHIVE_SUBJECT'
  | 'ARCHIVE_UNIT'
  | 'UNARCHIVE_UNIT'
  | 'ARCHIVE_LESSON_PLAN'
  | 'UNARCHIVE_LESSON_PLAN'
  | 'ARCHIVE_ACTIVITY'
  | 'UNARCHIVE_ACTIVITY'
  | 'DELETE_SUBJECT'
  | 'DELETE_UNIT'
  | 'DELETE_LESSON_PLAN'
  | 'DELETE_ACTIVITY'
  | 'CREATE_SUBJECT'
  | 'CREATE_UNIT'
  | 'GENERATE_LESSON_PLAN'
  | 'GENERATE_ACTIVITY'
  | 'GENERATE_SLIDES'
  | 'RESTORE_FROM_TRASH';

export interface AuditLog {
  /** Identificador único do log */
  id: string;
  /** Tipo de ação realizada */
  action: AuditActionType;
  /** Tipo de entidade afetada */
  entityType: 'subject' | 'unit' | 'lessonPlan' | 'activity' | 'slide';
  /** ID da entidade afetada */
  entityId: string;
  /** Nome/título da entidade afetada */
  entityName: string;
  /** ID do usuário que realizou a ação (opcional para futuro) */
  userId?: string;
  /** Informações adicionais sobre a ação */
  metadata?: Record<string, any>;
  /** Data e hora da ação no formato ISO 8601 */
  timestamp: string;
}

/**
 * Cria um novo log de auditoria
 */
export function createAuditLog(data: Omit<AuditLog, 'id' | 'timestamp'>): AuditLog {
  return {
    id: `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    action: data.action,
    entityType: data.entityType,
    entityId: data.entityId,
    entityName: data.entityName,
    userId: data.userId,
    metadata: data.metadata,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Valida um log de auditoria
 */
export function validateAuditLog(log: Partial<AuditLog>): boolean {
  if (!log.action || !log.entityType || !log.entityId || !log.entityName) {
    return false;
  }

  const validEntityTypes = ['subject', 'unit', 'lessonPlan', 'activity', 'slide'];
  if (!validEntityTypes.includes(log.entityType)) {
    return false;
  }

  return true;
}
