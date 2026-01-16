/**
 * Entidade de domínio: Plano de Aula
 * 
 * Representa um plano de aula alinhado à BNCC para uma unidade específica.
 * Cada plano de aula contém objetivos, conteúdo, metodologia, recursos e avaliação.
 * 
 * @example
 * ```typescript
 * const plan = createLessonPlan({
 *   unitId: 'unit_123',
 *   title: 'Introdução às Frações',
 *   objective: 'Compreender o conceito de fração',
 *   content: 'Definição de fração, exemplos práticos',
 *   methodology: 'Aula expositiva e exercícios práticos',
 *   resources: ['Quadro', 'Material didático'],
 *   evaluation: 'Participação e resolução de exercícios',
 *   bnccAlignment: 'Habilidades EF06MA06...',
 *   duration: 50
 * });
 * ```
 */
export interface LessonPlan {
  /** Identificador único do plano de aula */
  id: string;
  /** ID da unidade a qual o plano pertence */
  unitId: string;
  /** Título do plano de aula */
  title: string;
  /** Objetivo de aprendizagem da aula */
  objective: string;
  /** Conteúdo que será abordado na aula */
  content: string;
  /** Metodologia de ensino a ser utilizada */
  methodology: string;
  /** Lista de recursos necessários para a aula */
  resources: string[];
  /** Como será avaliado o aprendizado dos alunos */
  evaluation: string;
  /** Alinhamento com as competências da BNCC */
  bnccAlignment: string;
  /** Duração da aula em minutos (padrão: 50) */
  duration: number;
  /** Data de criação no formato ISO 8601 */
  createdAt: string;
  /** Data da última atualização no formato ISO 8601 (opcional) */
  updatedAt?: string;
}

/** Constantes para validação */
const MIN_TITLE_LENGTH = 3;
const MAX_TITLE_LENGTH = 200;
const MIN_OBJECTIVE_LENGTH = 10;
const MAX_OBJECTIVE_LENGTH = 500;
const MIN_CONTENT_LENGTH = 20;
const MAX_CONTENT_LENGTH = 2000;
const MIN_METHODOLOGY_LENGTH = 10;
const MAX_METHODOLOGY_LENGTH = 1000;
const MIN_DURATION = 15; // 15 minutos
const MAX_DURATION = 180; // 3 horas

/**
 * Valida um plano de aula
 * 
 * @param plan - Plano de aula a ser validado (pode ser parcial)
 * @returns `true` se o plano é válido, `false` caso contrário
 * 
 * @example
 * ```typescript
 * if (validateLessonPlan({
 *   unitId: 'unit_123',
 *   title: 'Introdução às Frações',
 *   objective: 'Compreender frações',
 *   content: 'Conteúdo da aula'
 * })) {
 *   // Plano válido
 * }
 * ```
 */
export function validateLessonPlan(plan: Partial<LessonPlan>): boolean {
  if (!plan.unitId || typeof plan.unitId !== 'string' || plan.unitId.trim().length === 0) {
    return false;
  }

  if (!plan.title || typeof plan.title !== 'string') {
    return false;
  }

  const trimmedTitle = plan.title.trim();
  if (trimmedTitle.length < MIN_TITLE_LENGTH || trimmedTitle.length > MAX_TITLE_LENGTH) {
    return false;
  }

  if (!plan.objective || typeof plan.objective !== 'string') {
    return false;
  }

  const trimmedObjective = plan.objective.trim();
  if (
    trimmedObjective.length < MIN_OBJECTIVE_LENGTH ||
    trimmedObjective.length > MAX_OBJECTIVE_LENGTH
  ) {
    return false;
  }

  if (!plan.content || typeof plan.content !== 'string') {
    return false;
  }

  const trimmedContent = plan.content.trim();
  if (trimmedContent.length < MIN_CONTENT_LENGTH || trimmedContent.length > MAX_CONTENT_LENGTH) {
    return false;
  }

  if (plan.methodology && typeof plan.methodology === 'string') {
    const trimmedMethodology = plan.methodology.trim();
    if (
      trimmedMethodology.length > 0 &&
      (trimmedMethodology.length < MIN_METHODOLOGY_LENGTH ||
        trimmedMethodology.length > MAX_METHODOLOGY_LENGTH)
    ) {
      return false;
    }
  }

  if (plan.duration !== undefined) {
    if (
      typeof plan.duration !== 'number' ||
      plan.duration < MIN_DURATION ||
      plan.duration > MAX_DURATION
    ) {
      return false;
    }
  }

  if (plan.resources && !Array.isArray(plan.resources)) {
    return false;
  }

  return true;
}

/**
 * Cria um novo plano de aula
 * 
 * @param data - Dados do plano de aula (sem `id` e `createdAt`)
 * @returns Novo plano de aula criado com ID único e timestamp
 * @throws {Error} Se os dados não forem válidos
 * 
 * @example
 * ```typescript
 * const plan = createLessonPlan({
 *   unitId: 'unit_123',
 *   title: 'Introdução às Frações',
 *   objective: 'Compreender o conceito de fração',
 *   content: 'Definição de fração, exemplos práticos',
 *   methodology: 'Aula expositiva e exercícios práticos',
 *   resources: ['Quadro', 'Material didático'],
 *   evaluation: 'Participação e resolução de exercícios',
 *   bnccAlignment: 'Habilidades EF06MA06...',
 *   duration: 50
 * });
 * ```
 */
export function createLessonPlan(data: Omit<LessonPlan, 'id' | 'createdAt'>): LessonPlan {
  const plan: Partial<LessonPlan> = {
    unitId: data.unitId,
    title: data.title,
    objective: data.objective,
    content: data.content,
    methodology: data.methodology || '',
    resources: data.resources || [],
    evaluation: data.evaluation || '',
    bnccAlignment: data.bnccAlignment || '',
    duration: data.duration || 50,
  };

  if (!validateLessonPlan(plan)) {
    throw new Error('Dados inválidos para criação de plano de aula');
  }

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

/**
 * Atualiza os dados de um plano de aula existente
 * 
 * @param plan - Plano de aula a ser atualizado
 * @param updates - Dados para atualização
 * @returns Plano de aula atualizado com novo `updatedAt`
 * 
 * @example
 * ```typescript
 * const updated = updateLessonPlan(plan, { 
 *   title: 'Frações Avançadas',
 *   content: 'Novo conteúdo atualizado'
 * });
 * ```
 */
export function updateLessonPlan(
  plan: LessonPlan,
  updates: Partial<Omit<LessonPlan, 'id' | 'createdAt' | 'updatedAt'>>
): LessonPlan {
  const updated: LessonPlan = {
    ...plan,
    ...updates,
    title: updates.title?.trim() || plan.title,
    objective: updates.objective?.trim() || plan.objective,
    content: updates.content?.trim() || plan.content,
    methodology: updates.methodology?.trim() ?? plan.methodology,
    evaluation: updates.evaluation?.trim() ?? plan.evaluation,
    bnccAlignment: updates.bnccAlignment?.trim() ?? plan.bnccAlignment,
    resources: updates.resources ?? plan.resources,
    duration: updates.duration ?? plan.duration,
    updatedAt: new Date().toISOString(),
  };

  if (!validateLessonPlan(updated)) {
    throw new Error('Dados inválidos para atualização de plano de aula');
  }

  return updated;
}
