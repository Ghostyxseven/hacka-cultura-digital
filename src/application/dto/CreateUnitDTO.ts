/**
 * DTO para criação de unidade de ensino
 * 
 * Representa os dados necessários para criar uma nova unidade (aula).
 * 
 * @example
 * ```typescript
 * const dto: CreateUnitDTO = {
 *   subjectId: 'subject_123',
 *   title: 'Introdução às Frações',
 *   theme: 'Frações e Proporções',
 *   isAIGenerated: false
 * };
 * ```
 */
export interface CreateUnitDTO {
  /** ID da disciplina à qual a unidade pertence (obrigatório) */
  subjectId: string;
  /** Título da unidade (obrigatório, 3-200 caracteres) */
  title: string;
  /** Tema da aula (obrigatório, 3-1000 caracteres) */
  theme: string;
  /** Indica se foi gerada automaticamente por IA (opcional, padrão: false) */
  isAIGenerated?: boolean;
}

/**
 * Valida um DTO de criação de unidade
 * 
 * @param dto - DTO a ser validado
 * @returns Objeto com resultado da validação e mensagens de erro específicas
 */
export function validateCreateUnitDTO(dto: Partial<CreateUnitDTO>): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!dto.subjectId || typeof dto.subjectId !== 'string' || dto.subjectId.trim().length === 0) {
    errors.push('Disciplina é obrigatória');
  }

  if (!dto.title || typeof dto.title !== 'string') {
    errors.push('Título é obrigatório');
  } else {
    const trimmedTitle = dto.title.trim();
    if (trimmedTitle.length < 3) {
      errors.push('Título deve ter pelo menos 3 caracteres');
    } else if (trimmedTitle.length > 200) {
      errors.push('Título não pode ter mais de 200 caracteres');
    }
  }

  if (!dto.theme || typeof dto.theme !== 'string') {
    errors.push('Tema é obrigatório');
  } else {
    const trimmedTheme = dto.theme.trim();
    if (trimmedTheme.length < 3) {
      errors.push('Tema deve ter pelo menos 3 caracteres');
    } else if (trimmedTheme.length > 1000) {
      errors.push('Tema não pode ter mais de 1000 caracteres');
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
