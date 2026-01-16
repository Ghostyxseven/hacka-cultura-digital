/**
 * Entidade de domínio: Unidade de Ensino (Aula)
 * Representa uma aula específica dentro de uma disciplina
 */
export interface Unit {
  id: string;
  subjectId: string;
  title: string;
  theme: string; // Tema da aula (ex: "Introdução à Álgebra")
  createdAt: string;
  updatedAt?: string;
  // Indica se foi criada manualmente ou sugerida pela IA
  isAIGenerated?: boolean;
}

/**
 * Valida uma unidade de ensino
 */
export function validateUnit(unit: Partial<Unit>): boolean {
  if (!unit.subjectId || unit.subjectId.trim().length === 0) {
    return false;
  }
  if (!unit.title || unit.title.trim().length === 0) {
    return false;
  }
  if (!unit.theme || unit.theme.trim().length === 0) {
    return false;
  }
  return true;
}

/**
 * Cria uma nova unidade de ensino com valores padrão
 */
export function createUnit(data: Omit<Unit, 'id' | 'createdAt'>): Unit {
  return {
    id: `unit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    subjectId: data.subjectId,
    title: data.title.trim(),
    theme: data.theme.trim(),
    isAIGenerated: data.isAIGenerated || false,
    createdAt: new Date().toISOString(),
  };
}
