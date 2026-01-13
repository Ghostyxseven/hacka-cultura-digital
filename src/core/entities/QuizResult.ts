// src/core/entities/QuizResult.ts

/**
 * Entidade que representa o resultado de um quiz realizado por um aluno
 */
export interface QuizResult {
  id: string;
  lessonPlanId: string;
  userId: string; // ID do aluno que fez o quiz
  answers: QuizAnswer[]; // Respostas dadas pelo aluno
  score: number; // Pontuação (0-100)
  totalQuestions: number;
  correctAnswers: number;
  completedAt: Date;
  timeSpent?: number; // Tempo gasto em segundos (opcional)
}

export interface QuizAnswer {
  questionId: string;
  selectedAnswer: number; // Índice da resposta selecionada (0-3)
  isCorrect: boolean;
  timeSpent?: number; // Tempo gasto nesta questão em segundos (opcional)
}
