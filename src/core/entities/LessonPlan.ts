// src/core/entities/LessonPlan.ts

/**
 * Tipagem para garantir que o sistema siga os anos escolares brasileiros.
 * Isso evita erros na camada de Presentation e Infrastructure.
 */
export type SchoolYear =
  | '6º Ano' | '7º Ano' | '8º Ano' | '9º Ano'
  | '1º Ano EM' | '2º Ano EM' | '3º Ano EM';

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;   // Índice da resposta (0 a 3)
  justification: string;   // Explicação pedagógica da resposta correta
}

export interface SlideStructure {
  title: string;
  content: string[];
}

export interface SupportMaterial {
  type: 'slide' | 'link' | 'video';
  title: string;
  url?: string;
  slides?: SlideStructure[]; // Para tipo 'slide'
  content?: string; // Descrição ou resumo
}

export interface LessonPlan {
  id: string;
  title: string;           // Tema da unidade 
  subject: string;         // Disciplina (Ex: Matemática, História)
  gradeYear: SchoolYear;   // Ano escolar tipado
  unitId?: string;         // ID da unidade à qual pertence (RF04/05)

  // Seção Pedagógica (O que a banca quer ver)
  objectives: string[];    // Objetivos de aprendizagem
  methodology: string;     // Como o professor deve aplicar a aula
  duration: string;        // Tempo estimado (Ex: "2 aulas de 50min")
  bnccCompetencies: string[]; // Códigos/Descrições da BNCC (Cultura Digital)

  content: string;         // Desenvolvimento do conteúdo da aula 
  quiz: QuizQuestion[];    // Atividade avaliativa estruturada 

  supportMaterials?: SupportMaterial[]; // Materiais extras (Fase 4)
  teacherNote?: string;    // Nota interna do professor

  metadata: {
    aiModel: string;       // Qual IA gerou? (Ex: Gemini-1.5-Flash)
    promptVersion: string; // Versão das instruções usadas
    isFavorite: boolean;   // Campo para UI (favoritar aula)
  };

  createdAt: Date;
}