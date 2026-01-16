/**
 * DTO para geração de plano de aula
 */
export interface GenerateLessonPlanDTO {
  unitId: string;
  year?: string;
  additionalContext?: string;
}
