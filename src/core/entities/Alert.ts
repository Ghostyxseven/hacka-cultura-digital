// src/core/entities/Alert.ts

/**
 * Entidade que representa um alerta do sistema
 * Usado para notificar coordenadores e diretores sobre situações importantes
 */
export interface Alert {
  id: string;
  type: 'student_at_risk' | 'low_performance' | 'missing_activities' | 'system' | 'pedagogical';
  severity: 'info' | 'warning' | 'critical';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  
  // Conteúdo
  title: string;
  message: string;
  description?: string; // Descrição detalhada
  
  // Contexto
  studentId?: string; // Aluno relacionado (se aplicável)
  subjectId?: string; // Disciplina relacionada (se aplicável)
  classId?: string; // Turma relacionada (se aplicável)
  
  // Sugestões de intervenção
  suggestedInterventions?: string[]; // Sugestões geradas pela IA
  
  // Status
  status: 'new' | 'acknowledged' | 'resolved' | 'dismissed';
  acknowledgedBy?: string; // ID do usuário que reconheceu
  acknowledgedAt?: Date;
  resolvedAt?: Date;
  
  // Metadados
  createdAt: Date;
  updatedAt?: Date;
  expiresAt?: Date; // Data de expiração (opcional)
}
