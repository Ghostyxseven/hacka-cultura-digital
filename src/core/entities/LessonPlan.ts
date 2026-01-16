/**
 * Entidade de domínio: Plano de Aula
 * Representa um plano de aula alinhado à BNCC para uma unidade específica
 */
export interface LessonPlan {
  id: string;
  unitId: string;
  title: string;
  objective: string; // Objetivo de aprendizagem
  content: string; // Conteúdo da aula
  methodology: string; // Metodologia de ensino
  resources: string[]; // Recursos necessários
  evaluation: string; // Como será avaliado
  bnccAlignment: string; // Alinhamento com BNCC
  duration: number; // Duração em minutos
  createdAt: string;
  updatedAt?: string;
}

/**
 * Valida um plano de aula
 */
export function validateLessonPlan(plan: Partial<LessonPlan>): boolean {
  if (!plan.unitId || plan.unitId.trim().length === 0) {
    return false;
  }
  if (!plan.title || plan.title.trim().length === 0) {
    return false;
  }
  if (!plan.objective || plan.objective.trim().length === 0) {
    return false;
  }
  if (!plan.content || plan.content.trim().length === 0) {
    return false;
  }
  return true;
}

/**
 * Cria um novo plano de aula
 */
export function createLessonPlan(data: Omit<LessonPlan, 'id' | 'createdAt'>): LessonPlan {
  return {
    id: `plan_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    unitId: data.unitId,
    title: data.title.trim(),
    objective: data.objective.trim(),
    content: data.content.trim(),
    methodology: data.methodology?.trim() || '',
    resources: data.resources || [],
    evaluation: data.evaluation?.trim() || '',
    bnccAlignment: data.bnccAlignment?.trim() || '',
    duration: data.duration || 50,
    createdAt: new Date().toISOString(),
  };
}
