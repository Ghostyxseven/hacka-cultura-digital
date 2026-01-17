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
  /** Tema da aula (obrigatório, 3-300 caracteres) */
  theme: string;
  /** Indica se foi gerada automaticamente por IA (opcional, padrão: false) */
  isAIGenerated?: boolean;
}

/**
 * Valida um DTO de criação de unidade
 * 
 * @param dto - DTO a ser validado
 * @returns `true` se o DTO for válido, `false` caso contrário
 */
export function validateCreateUnitDTO(dto: Partial<CreateUnitDTO>): boolean {
  if (!dto.subjectId || typeof dto.subjectId !== 'string' || dto.subjectId.trim().length === 0) {
    return false;
  }

  if (!dto.title || typeof dto.title !== 'string' || dto.title.trim().length < 3 || dto.title.trim().length > 200) {
    return false;
  }

  if (!dto.theme || typeof dto.theme !== 'string' || dto.theme.trim().length < 3 || dto.theme.trim().length > 300) {
    return false;
  }

  return true;
}
