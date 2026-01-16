// src/application/services/AuditService.ts
import { AuditLog, AuditActionType, AuditSeverity } from '../../core/entities/AuditLog';
import { IAuditLogRepository } from '../../core/repositories/IAuditLogRepository';
import { IUserRepository } from '../../core/repositories/IUserRepository';

/**
 * Serviço de auditoria
 * Centraliza a criação e gerenciamento de logs de auditoria
 */
export class AuditService {
  constructor(
    private auditRepository: IAuditLogRepository,
    private userRepository: IUserRepository
  ) {}

  /**
   * Registra uma ação no log de auditoria
   */
  log(
    action: AuditActionType,
    userId: string,
    description: string,
    options: {
      severity?: AuditSeverity;
      resourceType?: string;
      resourceId?: string;
      details?: Record<string, any>;
    } = {}
  ): void {
    // Busca informações do usuário
    const user = this.userRepository.getById(userId);

    const log: AuditLog = {
      id: `audit-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
      action,
      severity: options.severity || 'info',
      userId,
      userEmail: user?.email,
      userRole: user?.role,
      description,
      details: options.details,
      resourceType: options.resourceType,
      resourceId: options.resourceId,
      timestamp: new Date(),
    };

    // Captura informações do navegador (se disponível)
    if (typeof window !== 'undefined') {
      // IP não está disponível no cliente, mas pode ser adicionado no servidor
      log.userAgent = navigator.userAgent;
    }

    this.auditRepository.save(log);
  }

  /**
   * Métodos auxiliares para ações comuns
   */
  logLessonPlanCreated(userId: string, lessonPlanId: string, title: string): void {
    this.log(
      'lesson_plan_created',
      userId,
      `Plano de aula criado: ${title}`,
      {
        resourceType: 'LessonPlan',
        resourceId: lessonPlanId,
        details: { title },
      }
    );
  }

  logLessonPlanUpdated(userId: string, lessonPlanId: string, title: string): void {
    this.log(
      'lesson_plan_updated',
      userId,
      `Plano de aula atualizado: ${title}`,
      {
        resourceType: 'LessonPlan',
        resourceId: lessonPlanId,
        details: { title },
      }
    );
  }

  logLessonPlanDeleted(userId: string, lessonPlanId: string, title: string): void {
    this.log(
      'lesson_plan_deleted',
      userId,
      `Plano de aula excluído: ${title}`,
      {
        severity: 'warning',
        resourceType: 'LessonPlan',
        resourceId: lessonPlanId,
        details: { title },
      }
    );
  }

  logSubjectCreated(userId: string, subjectId: string, name: string): void {
    this.log(
      'subject_created',
      userId,
      `Disciplina criada: ${name}`,
      {
        resourceType: 'Subject',
        resourceId: subjectId,
        details: { name },
      }
    );
  }

  logSubjectDeleted(userId: string, subjectId: string, name: string): void {
    this.log(
      'subject_deleted',
      userId,
      `Disciplina excluída: ${name}`,
      {
        severity: 'warning',
        resourceType: 'Subject',
        resourceId: subjectId,
        details: { name },
      }
    );
  }

  logGradeUpdated(userId: string, quizResultId: string, oldScore: number, newScore: number): void {
    this.log(
      'grade_updated',
      userId,
      `Nota atualizada: ${oldScore}% → ${newScore}%`,
      {
        severity: 'warning',
        resourceType: 'QuizResult',
        resourceId: quizResultId,
        details: { oldScore, newScore },
      }
    );
  }

  logUserCreated(adminId: string, newUserId: string, email: string): void {
    this.log(
      'user_created',
      adminId,
      `Usuário criado: ${email}`,
      {
        resourceType: 'User',
        resourceId: newUserId,
        details: { email },
      }
    );
  }

  logUserDeleted(adminId: string, deletedUserId: string, email: string): void {
    this.log(
      'user_deleted',
      adminId,
      `Usuário excluído: ${email}`,
      {
        severity: 'critical',
        resourceType: 'User',
        resourceId: deletedUserId,
        details: { email },
      }
    );
  }
}
