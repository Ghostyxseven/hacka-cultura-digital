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

/** Constantes para validação */
const MIN_TITLE_LENGTH = 3;
const MAX_TITLE_LENGTH = 200;
const MIN_DESCRIPTION_LENGTH = 10;
const MAX_DESCRIPTION_LENGTH = 2000;
const MIN_QUESTION_TEXT_LENGTH = 5;
const MAX_QUESTION_TEXT_LENGTH = 1000;
const MIN_POINTS = 1;
const MAX_POINTS = 100;

/** Tipos válidos de atividades */
export const VALID_ACTIVITY_TYPES: Activity['type'][] = [
  'exercicio',
  'prova',
  'trabalho',
  'apresentacao',
  'projeto',
];

/** Tipos válidos de questões */
export const VALID_QUESTION_TYPES: ActivityQuestion['type'][] = [
  'multiple_choice',
  'open',
  'true_false',
  'essay',
];

/**
 * Valida uma questão de atividade
 * 
 * @param question - Questão a ser validada
 * @returns `true` se a questão é válida, `false` caso contrário
 */
export function validateActivityQuestion(question: Partial<ActivityQuestion>): boolean {
  if (!question.question || typeof question.question !== 'string') {
    return false;
  }

  const trimmedQuestion = question.question.trim();
  if (
    trimmedQuestion.length < MIN_QUESTION_TEXT_LENGTH ||
    trimmedQuestion.length > MAX_QUESTION_TEXT_LENGTH
  ) {
    return false;
  }

  if (!question.type || !VALID_QUESTION_TYPES.includes(question.type)) {
    return false;
  }

  if (typeof question.points !== 'number' || question.points < MIN_POINTS || question.points > MAX_POINTS) {
    return false;
  }

  // Validação específica para múltipla escolha
  if (question.type === 'multiple_choice') {
    if (!question.options || !Array.isArray(question.options) || question.options.length < 2) {
      return false;
    }
  }

  return true;
}

/**
 * Valida uma atividade avaliativa
 * 
 * @param activity - Atividade a ser validada (pode ser parcial)
 * @returns `true` se a atividade é válida, `false` caso contrário
 * 
 * @example
 * ```typescript
 * if (validateActivity({
 *   unitId: 'unit_123',
 *   title: 'Avaliação de Frações',
 *   description: 'Atividade sobre frações',
 *   type: 'exercicio',
 *   questions: []
 * })) {
 *   // Atividade válida
 * }
 * ```
 */
export function validateActivity(activity: Partial<Activity>): boolean {
  if (!activity.unitId || typeof activity.unitId !== 'string' || activity.unitId.trim().length === 0) {
    return false;
  }

  if (!activity.title || typeof activity.title !== 'string') {
    return false;
  }

  const trimmedTitle = activity.title.trim();
  if (trimmedTitle.length < MIN_TITLE_LENGTH || trimmedTitle.length > MAX_TITLE_LENGTH) {
    return false;
  }

  if (!activity.description || typeof activity.description !== 'string') {
    return false;
  }

  const trimmedDescription = activity.description.trim();
  if (
    trimmedDescription.length < MIN_DESCRIPTION_LENGTH ||
    trimmedDescription.length > MAX_DESCRIPTION_LENGTH
  ) {
    return false;
  }

  if (!activity.type || !VALID_ACTIVITY_TYPES.includes(activity.type)) {
    return false;
  }

  // Validação de questões se existirem
  if (activity.questions && Array.isArray(activity.questions)) {
    for (const question of activity.questions) {
      if (!validateActivityQuestion(question)) {
        return false;
      }
    }
  }

  return true;
}

/**
 * Cria uma nova atividade avaliativa
 * 
 * @param data - Dados da atividade (sem `id` e `createdAt`)
 * @returns Nova atividade criada com ID único e timestamp
 * @throws {Error} Se os dados não forem válidos
 * 
 * @example
 * ```typescript
 * const activity = createActivity({
 *   unitId: 'unit_123',
 *   title: 'Avaliação de Frações',
 *   description: 'Atividade sobre frações e proporções',
 *   type: 'exercicio',
 *   questions: [],
 *   instructions: 'Responda todas as questões',
 *   evaluationCriteria: 'Será avaliado o entendimento do conceito'
 * });
 * ```
 */
export function createActivity(data: Omit<Activity, 'id' | 'createdAt'>): Activity {
  const activity: Partial<Activity> = {
    unitId: data.unitId,
    title: data.title,
    description: data.description,
    type: data.type,
    questions: data.questions || [],
    instructions: data.instructions || '',
    evaluationCriteria: data.evaluationCriteria || '',
  };

  if (!validateActivity(activity)) {
    throw new Error('Dados inválidos para criação de atividade');
  }

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

/**
 * Cria uma nova questão de atividade
 * 
 * @param data - Dados da questão (sem `id`)
 * @returns Nova questão criada com ID único
 * @throws {Error} Se os dados não forem válidos
 * 
 * @example
 * ```typescript
 * const question = createActivityQuestion({
 *   question: 'Qual é 2 + 2?',
 *   type: 'multiple_choice',
 *   options: ['3', '4', '5', '6'],
 *   correctAnswer: '4',
 *   points: 10
 * });
 * ```
 */
export function createActivityQuestion(
  data: Omit<ActivityQuestion, 'id'>
): ActivityQuestion {
  const question: Partial<ActivityQuestion> = {
    ...data,
    options: data.options || [],
  };

  if (!validateActivityQuestion(question)) {
    throw new Error('Dados inválidos para criação de questão');
  }

  return {
    id: `question_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    question: data.question.trim(),
    type: data.type,
    options: data.options,
    correctAnswer: data.correctAnswer?.trim(),
    points: data.points,
  };
}
