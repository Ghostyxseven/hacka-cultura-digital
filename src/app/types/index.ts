// src/app/types/index.ts
// DTOs (Data Transfer Objects) e ViewModels para a camada de apresentação
// A camada Presentation não deve conhecer as entidades do Core diretamente

/**
 * ViewModel para Subject na camada de apresentação
 */
export interface SubjectViewModel {
  id: string;
  name: string;
  description?: string;
  color?: string;
  icon?: string;
  gradeYears?: string[];
  createdAt: Date;
}

/**
 * ViewModel para Unit na camada de apresentação
 */
export interface UnitViewModel {
  id: string;
  subjectId: string;
  gradeYear: string;
  topic: string;
  description?: string;
  lessonPlanId?: string;
  activityId?: string;
  isSuggestedByAI: boolean;
  createdAt: Date;
  updatedAt?: Date;
}

/**
 * ViewModel para LessonPlan na camada de apresentação
 */
export interface QuizQuestionViewModel {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  justification: string;
}

export interface LessonPlanViewModel {
  id: string;
  title: string;
  subject: string;
  gradeYear: string;
  unitId?: string;
  objectives: string[];
  methodology: string;
  duration: string;
  bnccCompetencies: string[];
  content: string;
  quiz: QuizQuestionViewModel[];
  metadata: {
    aiModel: string;
    promptVersion: string;
    isFavorite: boolean;
  };
  createdAt: Date;
}

/**
 * Tipo para SchoolYear na camada de apresentação
 */
export type SchoolYearViewModel = 
  | '6º Ano' | '7º Ano' | '8º Ano' | '9º Ano' 
  | '1º Ano EM' | '2º Ano EM' | '3º Ano EM';
