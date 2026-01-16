// src/application/usecases/IdentifyAtRiskStudentsUseCase.ts
import { IQuizRepository } from '../../core/repositories/IQuizRepository';
import { IStudentProfileRepository } from '../../core/repositories/IStudentProfileRepository';
import { Alert } from '../../core/entities/Alert';
import { IAlertRepository } from '../../core/repositories/IAlertRepository';

/**
 * Critérios para identificar alunos em risco
 */
export interface RiskCriteria {
  minScore?: number; // Nota mínima considerada em risco (padrão: 50)
  minQuizzes?: number; // Número mínimo de quizzes para análise (padrão: 3)
  consecutiveLowScores?: number; // Número de notas baixas consecutivas (padrão: 2)
  missingActivities?: boolean; // Se deve considerar atividades não feitas
}

/**
 * Aluno identificado como em risco
 */
export interface AtRiskStudent {
  studentId: string;
  studentName: string;
  riskLevel: 'low' | 'medium' | 'high';
  reasons: string[]; // Razões que levaram à identificação
  averageScore: number;
  totalQuizzes: number;
  lowScoreCount: number;
  missingActivitiesCount?: number;
}

export interface IdentifyAtRiskStudentsRequest {
  subjectId?: string; // Opcional: filtrar por disciplina
  classId?: string; // Opcional: filtrar por turma
  criteria?: RiskCriteria;
}

/**
 * Caso de uso: Identificar alunos em risco
 * Analisa desempenho e identifica alunos que precisam de atenção
 */
export class IdentifyAtRiskStudentsUseCase {
  constructor(
    private quizRepository: IQuizRepository,
    private studentProfileRepository: IStudentProfileRepository,
    private alertRepository: IAlertRepository
  ) {}

  execute(request: IdentifyAtRiskStudentsRequest = {}): AtRiskStudent[] {
    const criteria: RiskCriteria = {
      minScore: 50,
      minQuizzes: 3,
      consecutiveLowScores: 2,
      missingActivities: true,
      ...request.criteria,
    };

    // Busca todos os perfis de alunos
    const allProfiles = this.studentProfileRepository.getAll();
    
    // Filtra por disciplina/turma se especificado
    let profiles = allProfiles;
    if (request.subjectId) {
      // Assumindo que StudentProfile tem informações de disciplinas
      profiles = profiles.filter(p => {
        // Implementar lógica de filtro se necessário
        return true;
      });
    }

    const atRiskStudents: AtRiskStudent[] = [];

    for (const profile of profiles) {
      // Busca resultados de quiz do aluno
      const quizResults = this.quizRepository.getQuizResultsByUserId(profile.userId);

      if (quizResults.length < (criteria.minQuizzes || 3)) {
        continue; // Não tem quizzes suficientes para análise
      }

      // Calcula estatísticas
      const scores = quizResults.map(r => r.score);
      const averageScore = scores.reduce((a, b) => a + b, 0) / scores.length;
      const lowScoreCount = scores.filter(s => s < (criteria.minScore || 50)).length;

      // Verifica notas baixas consecutivas
      let consecutiveLow = 0;
      let maxConsecutiveLow = 0;
      for (const score of scores) {
        if (score < (criteria.minScore || 50)) {
          consecutiveLow++;
          maxConsecutiveLow = Math.max(maxConsecutiveLow, consecutiveLow);
        } else {
          consecutiveLow = 0;
        }
      }

      // Identifica razões de risco
      const reasons: string[] = [];
      let riskLevel: 'low' | 'medium' | 'high' = 'low';

      if (averageScore < (criteria.minScore || 50)) {
        reasons.push(`Média de notas abaixo de ${criteria.minScore || 50}%`);
        riskLevel = 'medium';
      }

      if (maxConsecutiveLow >= (criteria.consecutiveLowScores || 2)) {
        reasons.push(`${maxConsecutiveLow} notas baixas consecutivas`);
        riskLevel = 'high';
      }

      if (lowScoreCount > scores.length * 0.6) {
        reasons.push(`${Math.round((lowScoreCount / scores.length) * 100)}% das notas estão baixas`);
        riskLevel = riskLevel === 'low' ? 'medium' : 'high';
      }

      // Se identificou riscos, adiciona à lista
      if (reasons.length > 0) {
        atRiskStudents.push({
          studentId: profile.userId,
          studentName: profile.name || 'Aluno',
          riskLevel,
          reasons,
          averageScore: Math.round(averageScore),
          totalQuizzes: quizResults.length,
          lowScoreCount,
        });
      }
    }

    // Ordena por nível de risco (high primeiro)
    atRiskStudents.sort((a, b) => {
      const riskOrder = { high: 3, medium: 2, low: 1 };
      return riskOrder[b.riskLevel] - riskOrder[a.riskLevel];
    });

    return atRiskStudents;
  }

  /**
   * Identifica alunos em risco e cria alertas automaticamente
   */
  executeAndCreateAlerts(request: IdentifyAtRiskStudentsRequest = {}): Alert[] {
    const atRiskStudents = this.execute(request);
    const alerts: Alert[] = [];

    for (const student of atRiskStudents) {
      // Verifica se já existe alerta não resolvido para este aluno
      const existingAlerts = this.alertRepository.findByStudent(student.studentId);
      const hasUnresolvedAlert = existingAlerts.some(
        a => a.type === 'student_at_risk' && a.status !== 'resolved' && a.status !== 'dismissed'
      );

      if (hasUnresolvedAlert) {
        continue; // Já existe alerta ativo
      }

      // Cria novo alerta
      const alert: Alert = {
        id: `alert-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
        type: 'student_at_risk',
        severity: student.riskLevel === 'high' ? 'critical' : student.riskLevel === 'medium' ? 'warning' : 'info',
        priority: student.riskLevel === 'high' ? 'urgent' : student.riskLevel === 'medium' ? 'high' : 'medium',
        title: `Aluno em Risco: ${student.studentName}`,
        message: `Aluno identificado como em risco (${student.riskLevel === 'high' ? 'Alto' : student.riskLevel === 'medium' ? 'Médio' : 'Baixo'})`,
        description: `Razões: ${student.reasons.join(', ')}. Média: ${student.averageScore}%`,
        studentId: student.studentId,
        subjectId: request.subjectId,
        classId: request.classId,
        suggestedInterventions: this.generateInterventions(student),
        status: 'new',
        createdAt: new Date(),
      };

      this.alertRepository.save(alert);
      alerts.push(alert);
    }

    return alerts;
  }

  private generateInterventions(student: AtRiskStudent): string[] {
    const interventions: string[] = [];

    if (student.averageScore < 50) {
      interventions.push('Revisar conteúdo básico da disciplina');
      interventions.push('Oferecer reforço individualizado');
    }

    if (student.lowScoreCount > student.totalQuizzes * 0.6) {
      interventions.push('Acompanhamento mais próximo do desempenho');
      interventions.push('Conversa com o aluno para identificar dificuldades');
    }

    interventions.push('Sugerir materiais de apoio adicionais');
    interventions.push('Acompanhar próximas avaliações de perto');

    return interventions;
  }
}
