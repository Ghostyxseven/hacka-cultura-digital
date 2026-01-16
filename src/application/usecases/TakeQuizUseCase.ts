// src/application/usecases/TakeQuizUseCase.ts
import { QuizResult, QuizAnswer } from '@/core/entities/QuizResult';
import { LessonPlan } from '@/core/entities/LessonPlan';
import { IQuizRepository } from '@/core/repositories/IQuizRepository';
import { ILessonRepository } from '@/core/repositories/ILessonRepository';

export interface TakeQuizRequest {
  lessonPlanId: string;
  userId: string;
  answers: Array<{
    questionId: string;
    selectedAnswer: number;
  }>;
  timeSpent?: number;
}

/**
 * Use Case para processar o quiz realizado por um aluno
 * Calcula a pontuação e salva o resultado
 */
export class TakeQuizUseCase {
  constructor(
    private quizRepository: IQuizRepository,
    private lessonRepository: ILessonRepository
  ) {}

  execute(request: TakeQuizRequest): QuizResult {
    // Validações
    if (!request.lessonPlanId || !request.userId) {
      throw new Error('lessonPlanId e userId são obrigatórios');
    }

    if (!request.answers || request.answers.length === 0) {
      throw new Error('É necessário fornecer pelo menos uma resposta');
    }

    // Busca o plano de aula
    const lessonPlan = this.lessonRepository.getLessonPlanById(request.lessonPlanId);
    if (!lessonPlan) {
      throw new Error('Plano de aula não encontrado');
    }

    if (!lessonPlan.quiz || lessonPlan.quiz.length === 0) {
      throw new Error('Este plano de aula não possui quiz');
    }

    // Valida se todas as questões foram respondidas
    if (request.answers.length !== lessonPlan.quiz.length) {
      throw new Error(`É necessário responder todas as ${lessonPlan.quiz.length} questões`);
    }

    // Processa as respostas e calcula a pontuação
    const processedAnswers: QuizAnswer[] = [];
    let correctCount = 0;

    for (const answer of request.answers) {
      const question = lessonPlan.quiz.find(q => q.id === answer.questionId);
      
      if (!question) {
        throw new Error(`Questão ${answer.questionId} não encontrada`);
      }

      const isCorrect = question.correctAnswer === answer.selectedAnswer;
      if (isCorrect) {
        correctCount++;
      }

      processedAnswers.push({
        questionId: answer.questionId,
        selectedAnswer: answer.selectedAnswer,
        isCorrect,
      });
    }

    // Calcula a pontuação (0-100)
    const totalQuestions = lessonPlan.quiz.length;
    const score = Math.round((correctCount / totalQuestions) * 100);

    // Cria o resultado do quiz
    const quizResult: QuizResult = {
      id: `quiz-result-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
      lessonPlanId: request.lessonPlanId,
      userId: request.userId,
      answers: processedAnswers,
      score,
      totalQuestions,
      correctAnswers: correctCount,
      completedAt: new Date(),
      timeSpent: request.timeSpent,
    };

    // Salva o resultado
    this.quizRepository.saveQuizResult(quizResult);

    return quizResult;
  }
}
