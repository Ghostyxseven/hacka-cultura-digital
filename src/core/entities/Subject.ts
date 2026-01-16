/**
 * Entidade de domínio: Disciplina
 * Representa uma disciplina escolar (ex: Matemática, Ciências, História)
 */
export interface Subject {
  id: string;
  name: string;
  description: string;
  schoolYears: string[]; // Ex: ["6º ano", "7º ano", "8º ano"]
  createdAt: string;
  updatedAt?: string;
}

/**
 * Valida uma disciplina
 */
export function validateSubject(subject: Partial<Subject>): boolean {
  if (!subject.name || subject.name.trim().length === 0) {
    return false;
  }
  if (!subject.schoolYears || subject.schoolYears.length === 0) {
    return false;
  }
  return true;
}

/**
 * Cria uma nova disciplina com valores padrão
 */
export function createSubject(data: Omit<Subject, 'id' | 'createdAt'>): Subject {
  return {
    id: `subject_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    name: data.name.trim(),
    description: data.description?.trim() || '',
    schoolYears: data.schoolYears,
    createdAt: new Date().toISOString(),
  };
}
