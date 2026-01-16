/**
 * Entidade de domínio: Atividade Avaliativa
 * Representa uma atividade ou tarefa avaliativa relacionada a uma unidade
 */
export interface Activity {
  id: string;
  unitId: string;
  title: string;
  description: string;
  type: 'exercicio' | 'prova' | 'trabalho' | 'apresentacao' | 'projeto';
  questions: ActivityQuestion[]; // Lista de questões
  instructions: string; // Instruções para o aluno
  evaluationCriteria: string; // Critérios de avaliação
  createdAt: string;
  updatedAt?: string;
}

/**
 * Questão de uma atividade
 */
export interface ActivityQuestion {
  id: string;
  question: string;
  type: 'multiple_choice' | 'open' | 'true_false' | 'essay';
  options?: string[]; // Para questões de múltipla escolha
  correctAnswer?: string; // Resposta correta (se aplicável)
  points: number; // Pontuação da questão
}

/**
 * Valida uma atividade avaliativa
 */
export function validateActivity(activity: Partial<Activity>): boolean {
  if (!activity.unitId || activity.unitId.trim().length === 0) {
    return false;
  }
  if (!activity.title || activity.title.trim().length === 0) {
    return false;
  }
  if (!activity.description || activity.description.trim().length === 0) {
    return false;
  }
  if (!activity.type) {
    return false;
  }
  return true;
}

/**
 * Cria uma nova atividade avaliativa
 */
export function createActivity(data: Omit<Activity, 'id' | 'createdAt'>): Activity {
  return {
    id: `activity_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    unitId: data.unitId,
    title: data.title.trim(),
    description: data.description.trim(),
    type: data.type,
    questions: data.questions || [],
    instructions: data.instructions?.trim() || '',
    evaluationCriteria: data.evaluationCriteria?.trim() || '',
    createdAt: new Date().toISOString(),
  };
}
