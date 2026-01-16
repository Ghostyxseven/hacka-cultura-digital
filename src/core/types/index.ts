/**
 * Tipos auxiliares e constantes compartilhadas da camada Core
 * 
 * Contém tipos utilitários e constantes usadas por todas as entidades
 */

/**
 * Anos escolares do Ensino Fundamental e Ensino Médio
 * 
 * Cobre do 1º ano do Ensino Fundamental ao 3º ano do Ensino Médio
 * Total: 12 anos escolares (9 do EF + 3 do EM)
 * 
 * @example
 * ```typescript
 * const schoolYear: SchoolYear = '6º ano'; // Ensino Fundamental
 * const highSchoolYear: SchoolYear = '2º ano EM'; // Ensino Médio
 * ```
 */
export type SchoolYear =
  // Ensino Fundamental (1º ao 9º ano)
  | '1º ano'
  | '2º ano'
  | '3º ano'
  | '4º ano'
  | '5º ano'
  | '6º ano'
  | '7º ano'
  | '8º ano'
  | '9º ano'
  // Ensino Médio (1º ao 3º ano)
  | '1º ano EM'
  | '2º ano EM'
  | '3º ano EM';

/**
 * Array com todos os anos escolares do Ensino Fundamental (1º ao 9º ano)
 */
export const ELEMENTARY_SCHOOL_YEARS: SchoolYear[] = [
  '1º ano',
  '2º ano',
  '3º ano',
  '4º ano',
  '5º ano',
  '6º ano',
  '7º ano',
  '8º ano',
  '9º ano',
] as const;

/**
 * Array com todos os anos escolares do Ensino Médio (1º ao 3º ano)
 */
export const HIGH_SCHOOL_YEARS: SchoolYear[] = [
  '1º ano EM',
  '2º ano EM',
  '3º ano EM',
] as const;

/**
 * Array com todos os anos escolares (do 1º ano EF ao 3º ano EM)
 * Total: 12 anos
 */
export const ALL_SCHOOL_YEARS: SchoolYear[] = [
  ...ELEMENTARY_SCHOOL_YEARS,
  ...HIGH_SCHOOL_YEARS,
] as const;

/**
 * Verifica se uma string é um ano escolar válido
 * 
 * @param year - String a ser verificada
 * @returns `true` se for um ano escolar válido
 * 
 * @example
 * ```typescript
 * isValidSchoolYear('6º ano'); // true
 * isValidSchoolYear('2º ano EM'); // true
 * isValidSchoolYear('10º ano'); // false
 * ```
 */
export function isValidSchoolYear(year: string): year is SchoolYear {
  return ALL_SCHOOL_YEARS.includes(year as SchoolYear);
}

/**
 * Retorna se um ano escolar pertence ao Ensino Fundamental
 * 
 * @param year - Ano escolar
 * @returns `true` se for do Ensino Fundamental
 */
export function isElementarySchool(year: SchoolYear): boolean {
  return ELEMENTARY_SCHOOL_YEARS.includes(year);
}

/**
 * Retorna se um ano escolar pertence ao Ensino Médio
 * 
 * @param year - Ano escolar
 * @returns `true` se for do Ensino Médio
 */
export function isHighSchool(year: SchoolYear): boolean {
  return HIGH_SCHOOL_YEARS.includes(year);
}

/**
 * Tipos de atividade avaliativa
 */
export type ActivityType = 'exercicio' | 'prova' | 'trabalho' | 'apresentacao' | 'projeto';

/**
 * Tipos de questão de atividade
 */
export type QuestionType = 'multiple_choice' | 'open' | 'true_false' | 'essay';

/**
 * Constantes para IDs de entidades
 */
export const ENTITY_ID_PREFIXES = {
  SUBJECT: 'subject_',
  UNIT: 'unit_',
  LESSON_PLAN: 'plan_',
  ACTIVITY: 'activity_',
  QUESTION: 'question_',
} as const;

/**
 * Gera um ID único para uma entidade
 * 
 * @param prefix - Prefixo do ID (ex: 'subject_', 'unit_')
 * @returns ID único no formato: prefix_timestamp_randomstring
 * 
 * @example
 * ```typescript
 * const subjectId = generateEntityId(ENTITY_ID_PREFIXES.SUBJECT);
 * // Retorna: "subject_1691234567890_abc123xyz"
 * ```
 */
export function generateEntityId(prefix: string): string {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 11);
  return `${prefix}${timestamp}_${randomString}`;
}

/**
 * Valida se uma string é um formato de data ISO 8601 válido
 * 
 * @param dateString - String a ser validada
 * @returns `true` se for uma data ISO 8601 válida
 */
export function isValidISODate(dateString: string): boolean {
  if (!dateString || typeof dateString !== 'string') {
    return false;
  }

  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date.getTime()) && dateString.includes('T');
}

/**
 * Gera timestamp ISO 8601 atual
 * 
 * @returns String com data/hora atual no formato ISO 8601
 */
export function getCurrentISOTimestamp(): string {
  return new Date().toISOString();
}

/**
 * Trunca uma string para um tamanho máximo
 * 
 * @param str - String a ser truncada
 * @param maxLength - Tamanho máximo
 * @param suffix - Sufixo a adicionar se truncar (padrão: '...')
 * @returns String truncada
 */
export function truncateString(str: string, maxLength: number, suffix = '...'): string {
  if (!str || str.length <= maxLength) {
    return str;
  }
  return str.substring(0, maxLength - suffix.length) + suffix;
}

/**
 * Normaliza uma string (remove espaços extras, converte para lowercase quando necessário)
 * 
 * @param str - String a ser normalizada
 * @param toLowerCase - Se deve converter para lowercase (padrão: false)
 * @returns String normalizada
 */
export function normalizeString(str: string, toLowerCase = false): string {
  if (!str || typeof str !== 'string') {
    return '';
  }
  const normalized = str.trim().replace(/\s+/g, ' ');
  return toLowerCase ? normalized.toLowerCase() : normalized;
}
