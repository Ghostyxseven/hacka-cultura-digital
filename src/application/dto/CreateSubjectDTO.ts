/**
 * DTO para criação de disciplina
 * 
 * Representa os dados necessários para criar uma nova disciplina.
 * 
 * @example
 * ```typescript
 * const dto: CreateSubjectDTO = {
 *   name: 'Matemática',
 *   description: 'Disciplina de Matemática do Ensino Fundamental',
 *   schoolYears: ['6º ano', '7º ano', '8º ano']
 * };
 * ```
 */
export interface CreateSubjectDTO {
  /** Nome da disciplina (obrigatório, 2-100 caracteres) */
  name: string;
  /** Descrição detalhada da disciplina (opcional, max 500 caracteres) */
  description: string;
  /** Séries/anos escolares associados (obrigatório, pelo menos 1 ano) */
  schoolYears: string[];
}

/**
 * Valida um DTO de criação de disciplina
 * 
 * @param dto - DTO a ser validado
 * @returns `true` se o DTO for válido, `false` caso contrário
 */
export function validateCreateSubjectDTO(dto: Partial<CreateSubjectDTO>): boolean {
  if (!dto.name || typeof dto.name !== 'string' || dto.name.trim().length < 2 || dto.name.trim().length > 100) {
    return false;
  }

  if (dto.description !== undefined && typeof dto.description !== 'string' && dto.description.length > 500) {
    return false;
  }

  if (!dto.schoolYears || !Array.isArray(dto.schoolYears) || dto.schoolYears.length === 0) {
    return false;
  }

  return true;
}
