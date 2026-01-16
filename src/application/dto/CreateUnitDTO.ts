/**
 * DTO para criação de unidade
 */
export interface CreateUnitDTO {
  subjectId: string;
  title: string;
  theme: string;
  isAIGenerated?: boolean;
}
