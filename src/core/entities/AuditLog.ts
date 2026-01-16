// src/core/entities/AuditLog.ts

/**
 * Tipos de ações que podem ser auditadas
 */
export type AuditActionType =
  | 'lesson_plan_created'
  | 'lesson_plan_updated'
  | 'lesson_plan_deleted'
  | 'lesson_plan_shared'
  | 'lesson_plan_refined'
  | 'subject_created'
  | 'subject_updated'
  | 'subject_deleted'
  | 'unit_created'
  | 'unit_updated'
  | 'unit_deleted'
  | 'quiz_result_updated'
  | 'grade_updated'
  | 'user_created'
  | 'user_updated'
  | 'user_deleted'
  | 'announcement_created'
  | 'announcement_deleted'
  | 'material_uploaded'
  | 'material_deleted'
  | 'system_config_changed';

/**
 * Níveis de severidade do log
 */
export type AuditSeverity = 'info' | 'warning' | 'error' | 'critical';

/**
 * Entidade que representa um log de auditoria
 * Registra ações importantes do sistema para transparência e rastreabilidade
 */
export interface AuditLog {
  id: string;
  
  // Informações da ação
  action: AuditActionType;
  severity: AuditSeverity;
  
  // Usuário que realizou a ação
  userId: string;
  userEmail?: string;
  userRole?: 'admin' | 'professor' | 'aluno';
  
  // Contexto da ação
  description: string; // Descrição legível da ação
  details?: Record<string, any>; // Detalhes adicionais em JSON
  
  // Recursos afetados
  resourceType?: string; // Tipo de recurso (ex: 'LessonPlan', 'Subject')
  resourceId?: string; // ID do recurso afetado
  
  // Metadados
  ipAddress?: string; // IP de origem (se disponível)
  userAgent?: string; // User agent do navegador
  timestamp: Date;
  
  // Status
  reviewed?: boolean; // Se foi revisado por admin
  reviewedBy?: string; // ID do admin que revisou
  reviewedAt?: Date;
  notes?: string; // Notas adicionais do admin
}
