// src/application/usecases/SaveReusableQuizQuestionUseCase.ts
import { ReusableQuizQuestion } from '../../core/entities/ReusableQuizQuestion';
import { IReusableQuizQuestionRepository } from '../../core/repositories/IReusableQuizQuestionRepository';

/**
 * Caso de uso: Salvar questão de quiz reutilizável
 * Permite que professores salvem questões para reutilizar em diferentes planos
 */
export interface SaveReusableQuizQuestionRequest {
  question: string;
  options: string[]; // Exatamente 4 alternativas
  correctAnswer: number; // Índice 0-3
  justification: string;
  tags?: string[];
  difficulty?: 'facil' | 'medio' | 'dificil';
  subject: string;
  gradeYear?: string;
  createdBy: string; // ID do professor
}

export class SaveReusableQuizQuestionUseCase {
  constructor(private repository: IReusableQuizQuestionRepository) {}

  /**
   * Salva uma questão reutilizável
   */
  execute(request: SaveReusableQuizQuestionRequest): ReusableQuizQuestion {
    // Validações
    if (!request.question || request.question.trim().length === 0) {
      throw new Error('A pergunta é obrigatória');
    }

    if (!request.options || request.options.length !== 4) {
      throw new Error('A questão deve ter exatamente 4 alternativas');
    }

    if (request.options.some(opt => !opt || opt.trim().length === 0)) {
      throw new Error('Todas as alternativas devem ser preenchidas');
    }

    if (typeof request.correctAnswer !== 'number' || request.correctAnswer < 0 || request.correctAnswer > 3) {
      throw new Error('A resposta correta deve ser um número entre 0 e 3');
    }

    if (!request.justification || request.justification.trim().length === 0) {
      throw new Error('A justificativa é obrigatória');
    }

    if (!request.subject || request.subject.trim().length === 0) {
      throw new Error('A disciplina é obrigatória');
    }

    if (!request.createdBy) {
      throw new Error('O ID do criador é obrigatório');
    }

    // Cria a questão
    const question: ReusableQuizQuestion = {
      id: `quiz-question-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
      question: request.question.trim(),
      options: request.options.map(opt => opt.trim()),
      correctAnswer: request.correctAnswer,
      justification: request.justification.trim(),
      tags: request.tags || [],
      difficulty: request.difficulty || 'medio',
      subject: request.subject.trim(),
      gradeYear: request.gradeYear,
      usageCount: 0,
      createdBy: request.createdBy,
      createdAt: new Date(),
    };

    // Salva no repositório
    this.repository.save(question);

    return question;
  }
}
