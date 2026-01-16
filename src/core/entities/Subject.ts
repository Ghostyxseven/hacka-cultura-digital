/**
 * Entidade de domínio: Disciplina
 * 
 * Representa uma disciplina escolar (ex: Matemática, Ciências, História).
 * Esta entidade é a raiz do agregado de matérias pedagógicas.
 * 
 * @example
 * ```typescript
 * const subject = createSubject({
 *   name: 'Matemática',
 *   description: 'Disciplina de Matemática do Ensino Fundamental',
 *   schoolYears: ['6º ano', '7º ano', '8º ano']
 * });
 * ```
 */
export interface Subject {
  /** Identificador único da disciplina */
  id: string;
  /** Nome da disciplina */
  name: string;
  /** Descrição detalhada da disciplina */
  description: string;
  /** Séries/anos escolares associados (ex: ["6º ano", "7º ano", "8º ano"]) */
  schoolYears: string[];
  /** Data de criação no formato ISO 8601 */
  createdAt: string;
  /** Data da última atualização no formato ISO 8601 (opcional) */
  updatedAt?: string;
  /** Indica se a disciplina está arquivada (padrão: false) */
  archived?: boolean;
  /** Data de arquivamento no formato ISO 8601 (opcional) */
  archivedAt?: string;
}

/** Constantes para validação */
const MIN_NAME_LENGTH = 2;
const MAX_NAME_LENGTH = 100;
const MIN_DESCRIPTION_LENGTH = 0;
const MAX_DESCRIPTION_LENGTH = 500;

/**
 * Valida uma disciplina
 * 
 * @param subject - Disciplina a ser validada (pode ser parcial)
 * @returns `true` se a disciplina é válida, `false` caso contrário
 * 
 * @example
 * ```typescript
 * if (validateSubject({ name: 'Matemática', schoolYears: ['6º ano'] })) {
 *   // Disciplina válida
 * }
 * ```
 */
export function validateSubject(subject: Partial<Subject>): boolean {
  if (!subject.name || typeof subject.name !== 'string') {
    return false;
  }

  const trimmedName = subject.name.trim();
  if (trimmedName.length < MIN_NAME_LENGTH || trimmedName.length > MAX_NAME_LENGTH) {
    return false;
  }

  if (!subject.schoolYears || !Array.isArray(subject.schoolYears)) {
    return false;
  }

  if (subject.schoolYears.length === 0) {
    return false;
  }

  if (
    subject.description !== undefined &&
    (typeof subject.description !== 'string' ||
      subject.description.length > MAX_DESCRIPTION_LENGTH)
  ) {
    return false;
  }

  return true;
}

/**
 * Cria uma nova disciplina com valores padrão
 * 
 * @param data - Dados da disciplina (sem `id` e `createdAt`)
 * @returns Nova disciplina criada com ID único e timestamp
 * @throws {Error} Se os dados não forem válidos
 * 
 * @example
 * ```typescript
 * const subject = createSubject({
 *   name: 'Matemática',
 *   description: 'Disciplina de Matemática',
 *   schoolYears: ['6º ano', '7º ano']
 * });
 * ```
 */
export function createSubject(data: Omit<Subject, 'id' | 'createdAt'>): Subject {
  const subject: Partial<Subject> = {
    name: data.name,
    description: data.description || '',
    schoolYears: data.schoolYears || [],
    archived: data.archived ?? false,
  };

  if (!validateSubject(subject)) {
    throw new Error('Dados inválidos para criação de disciplina');
  }

  return {
    id: `subject_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    name: data.name.trim(),
    description: data.description?.trim() || '',
    schoolYears: data.schoolYears,
    archived: data.archived ?? false,
    createdAt: new Date().toISOString(),
  };
}

/**
 * Atualiza os dados de uma disciplina existente
 * 
 * @param subject - Disciplina a ser atualizada
 * @param updates - Dados para atualização
 * @returns Disciplina atualizada com novo `updatedAt`
 * 
 * @example
 * ```typescript
 * const updated = updateSubject(subject, { 
 *   name: 'Matemática Avançada',
 *   description: 'Nova descrição'
 * });
 * ```
 */
export function updateSubject(
  subject: Subject,
  updates: Partial<Omit<Subject, 'id' | 'createdAt' | 'updatedAt'>>
): Subject {
  const updated: Subject = {
    ...subject,
    ...updates,
    name: updates.name?.trim() || subject.name,
    description: updates.description?.trim() ?? subject.description,
    updatedAt: new Date().toISOString(),
  };

  if (!validateSubject(updated)) {
    throw new Error('Dados inválidos para atualização de disciplina');
  }

  return updated;
}
