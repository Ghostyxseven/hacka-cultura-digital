/**
 * Entidade de domínio: Unidade de Ensino (Aula)
 * 
 * Representa uma aula específica dentro de uma disciplina.
 * Cada unidade pode gerar materiais didáticos como plano de aula e atividades.
 * 
 * @example
 * ```typescript
 * const unit = createUnit({
 *   subjectId: 'subject_123',
 *   title: 'Introdução às Frações',
 *   theme: 'Frações e Proporções',
 *   isAIGenerated: false
 * });
 * ```
 */
export interface Unit {
  /** Identificador único da unidade */
  id: string;
  /** ID da disciplina a qual a unidade pertence */
  subjectId: string;
  /** Título da unidade (nome da aula) */
  title: string;
  /** Tema da aula (ex: "Introdução à Álgebra", "Frações e Proporções") */
  theme: string;
  /** Data de criação no formato ISO 8601 */
  createdAt: string;
  /** Data da última atualização no formato ISO 8601 (opcional) */
  updatedAt?: string;
  /** Indica se foi criada manualmente ou sugerida pela IA (padrão: false) */
  isAIGenerated?: boolean;
}

/** Constantes para validação */
const MIN_TITLE_LENGTH = 3;
const MAX_TITLE_LENGTH = 200;
const MIN_THEME_LENGTH = 3;
const MAX_THEME_LENGTH = 300;

/**
 * Valida uma unidade de ensino
 * 
 * @param unit - Unidade a ser validada (pode ser parcial)
 * @returns `true` se a unidade é válida, `false` caso contrário
 * 
 * @example
 * ```typescript
 * if (validateUnit({ 
 *   subjectId: 'subject_123', 
 *   title: 'Introdução às Frações',
 *   theme: 'Frações'
 * })) {
 *   // Unidade válida
 * }
 * ```
 */
export function validateUnit(unit: Partial<Unit>): boolean {
  if (!unit.subjectId || typeof unit.subjectId !== 'string' || unit.subjectId.trim().length === 0) {
    return false;
  }

  if (!unit.title || typeof unit.title !== 'string') {
    return false;
  }

  const trimmedTitle = unit.title.trim();
  if (trimmedTitle.length < MIN_TITLE_LENGTH || trimmedTitle.length > MAX_TITLE_LENGTH) {
    return false;
  }

  if (!unit.theme || typeof unit.theme !== 'string') {
    return false;
  }

  const trimmedTheme = unit.theme.trim();
  if (trimmedTheme.length < MIN_THEME_LENGTH || trimmedTheme.length > MAX_THEME_LENGTH) {
    return false;
  }

  return true;
}

/**
 * Cria uma nova unidade de ensino com valores padrão
 * 
 * @param data - Dados da unidade (sem `id` e `createdAt`)
 * @returns Nova unidade criada com ID único e timestamp
 * @throws {Error} Se os dados não forem válidos
 * 
 * @example
 * ```typescript
 * const unit = createUnit({
 *   subjectId: 'subject_123',
 *   title: 'Introdução às Frações',
 *   theme: 'Frações e Proporções',
 *   isAIGenerated: false
 * });
 * ```
 */
export function createUnit(data: Omit<Unit, 'id' | 'createdAt'>): Unit {
  const unit: Partial<Unit> = {
    subjectId: data.subjectId,
    title: data.title,
    theme: data.theme,
    isAIGenerated: data.isAIGenerated ?? false,
  };

  if (!validateUnit(unit)) {
    throw new Error('Dados inválidos para criação de unidade');
  }

  return {
    id: `unit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    subjectId: data.subjectId,
    title: data.title.trim(),
    theme: data.theme.trim(),
    isAIGenerated: data.isAIGenerated ?? false,
    createdAt: new Date().toISOString(),
  };
}

/**
 * Atualiza os dados de uma unidade existente
 * 
 * @param unit - Unidade a ser atualizada
 * @param updates - Dados para atualização
 * @returns Unidade atualizada com novo `updatedAt`
 * 
 * @example
 * ```typescript
 * const updated = updateUnit(unit, { 
 *   title: 'Frações Avançadas',
 *   theme: 'Operações com Frações'
 * });
 * ```
 */
export function updateUnit(
  unit: Unit,
  updates: Partial<Omit<Unit, 'id' | 'createdAt' | 'updatedAt'>>
): Unit {
  const updated: Unit = {
    ...unit,
    ...updates,
    title: updates.title?.trim() || unit.title,
    theme: updates.theme?.trim() || unit.theme,
    updatedAt: new Date().toISOString(),
  };

  if (!validateUnit(updated)) {
    throw new Error('Dados inválidos para atualização de unidade');
  }

  return updated;
}
