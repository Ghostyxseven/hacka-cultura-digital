// src/core/entities/Unit.ts
import { SchoolYear } from "./LessonPlan";

/**
 * Unidade de Ensino (Aula)
 * 
 * Representa uma aula específica dentro de uma disciplina.
 * Cada unidade possui um tema e pode ter um plano de aula e atividade associados.
 * 
 * RF02 - Criação manual de unidades
 * RF03 - Sugestão automática de unidades via IA
 */
export interface Unit {
  id: string;
  subjectId: string;          // ID da disciplina à qual pertence
  gradeYear: SchoolYear;      // Ano/série escolar
  topic: string;              // Tema da unidade/aula (ex: "Equações do 2º grau")
  description?: string;        // Descrição opcional da unidade
  
  // Referências aos materiais gerados
  lessonPlanId?: string;     // ID do plano de aula gerado (RF04)
  activityId?: string;        // ID da atividade avaliativa gerada (RF05)
  
  // Metadados
  isSuggestedByAI: boolean;   // Indica se foi sugerida automaticamente (RF03)
  createdAt: Date;
  updatedAt?: Date;
}
