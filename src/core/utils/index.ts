/**
 * Funções utilitárias para a camada Core
 * 
 * Funções auxiliares para manipulação e validação de entidades
 */

/**
 * Verifica se um array está vazio ou é inválido
 * 
 * @param array - Array a ser verificado
 * @returns `true` se o array estiver vazio ou for inválido
 */
export function isEmptyArray<T>(array: T[] | undefined | null): boolean {
  return !array || !Array.isArray(array) || array.length === 0;
}

/**
 * Verifica se uma string está vazia ou é inválida
 * 
 * @param str - String a ser verificada
 * @returns `true` se a string estiver vazia ou for inválida
 */
export function isEmptyString(str: string | undefined | null): boolean {
  return !str || typeof str !== 'string' || str.trim().length === 0;
}

/**
 * Verifica se um número está dentro de um intervalo
 * 
 * @param value - Valor numérico a ser verificado
 * @param min - Valor mínimo (inclusivo)
 * @param max - Valor máximo (inclusivo)
 * @returns `true` se o valor estiver dentro do intervalo
 */
export function isInRange(value: number, min: number, max: number): boolean {
  return typeof value === 'number' && value >= min && value <= max;
}

/**
 * Verifica se um valor é um ID válido de entidade
 * 
 * @param id - ID a ser verificado
 * @param prefix - Prefixo esperado do ID (opcional)
 * @returns `true` se o ID for válido
 */
export function isValidEntityId(id: string | undefined | null, prefix?: string): boolean {
  if (!id || typeof id !== 'string' || id.trim().length === 0) {
    return false;
  }

  if (prefix && !id.startsWith(prefix)) {
    return false;
  }

  // Verifica se tem formato básico de ID (prefix_timestamp_random)
  const parts = id.split('_');
  return parts.length >= 3;
}

/**
 * Remove elementos duplicados de um array mantendo a ordem
 * 
 * @param array - Array com possíveis duplicatas
 * @returns Array sem duplicatas
 */
export function removeDuplicates<T>(array: T[]): T[] {
  if (!array || !Array.isArray(array)) {
    return [];
  }
  return [...new Set(array)];
}

/**
 * Valida se todos os elementos de um array são strings não vazias
 * 
 * @param array - Array a ser validado
 * @returns `true` se todos os elementos forem strings não vazias
 */
export function areAllNonEmptyStrings(array: unknown[]): boolean {
  if (!array || !Array.isArray(array) || array.length === 0) {
    return false;
  }

  return array.every((item) => typeof item === 'string' && item.trim().length > 0);
}

/**
 * Mescla dois objetos parcialmente, preservando valores não-undefined
 * 
 * @param target - Objeto alvo
 * @param source - Objeto fonte
 * @returns Novo objeto mesclado
 */
export function mergeObjects<T extends Record<string, unknown>>(
  target: T,
  source: Partial<T>
): T {
  const result = { ...target };

  for (const key in source) {
    if (source[key] !== undefined) {
      result[key] = source[key] as T[Extract<keyof T, string>];
    }
  }

  return result;
}

/**
 * Valida se um valor está presente em um array de valores permitidos
 * 
 * @param value - Valor a ser verificado
 * @param allowedValues - Array de valores permitidos
 * @returns `true` se o valor estiver no array de valores permitidos
 */
export function isAllowedValue<T>(value: T, allowedValues: readonly T[]): boolean {
  return allowedValues.includes(value);
}
