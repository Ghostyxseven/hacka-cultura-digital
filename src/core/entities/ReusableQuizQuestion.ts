// src/core/entities/ReusableQuizQuestion.ts

/**
 * Entidade que representa uma questão de quiz reutilizável
 * Permite que professores salvem e reaproveitem questões em diferentes planos
 */
export interface ReusableQuizQuestion {
  id: string;
  question: string;
  options: string[]; // Exatamente 4 alternativas
  correctAnswer: number; // Índice da resposta correta (0-3)
  justification: string; // Explicação pedagógica da resposta correta
  
  // Metadados para organização
  tags: string[]; // Tags para busca (ex: ["fracoes", "matematica", "basico"])
  difficulty: 'facil' | 'medio' | 'dificil';
  subject: string; // Disciplina relacionada
  gradeYear?: string; // Ano escolar opcional
  
  // Rastreamento de uso
  usageCount: number; // Quantas vezes foi reutilizada
  lastUsedAt?: Date; // Última vez que foi usada
  
  // Metadados do criador
  createdBy: string; // ID do professor que criou
  createdAt: Date;
  updatedAt?: Date;
}
