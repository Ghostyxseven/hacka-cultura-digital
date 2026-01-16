/**
 * DTO para geração de atividade avaliativa
 */
export interface GenerateActivityDTO {
  unitId: string;
  year?: string;
  activityType?: 'exercicio' | 'prova' | 'trabalho' | 'apresentacao' | 'projeto';
  numberOfQuestions?: number;
  additionalContext?: string;
}
