// src/application/usecases/GenerateFormativeFeedbackUseCase.ts
import { IAIService } from '../../core/interfaces/services/IAIService';
import { IQuizRepository } from '../../core/repositories/IQuizRepository';
import { ILessonRepository } from '../../core/repositories/ILessonRepository';
import { QuizResult } from '../../core/entities/QuizResult';
import { LessonPlan } from '../../core/entities/LessonPlan';

/**
 * Feedback formativo detalhado por competência
 */
export interface FormativeFeedback {
  overallFeedback: string; // Feedback geral
  competencyFeedback: CompetencyFeedback[]; // Feedback por competência BNCC
  strengths: string[]; // Pontos fortes identificados
  weaknesses: string[]; // Pontos que precisam reforço
  suggestions: string[]; // Sugestões de estudo/reforço
}

export interface CompetencyFeedback {
  competency: string; // Competência BNCC
  performance: 'excellent' | 'good' | 'needs_improvement';
  feedback: string; // Feedback específico
  questionsRelated: string[]; // IDs das questões relacionadas
}

export interface GenerateFormativeFeedbackRequest {
  quizResultId: string;
}

/**
 * Caso de uso: Gerar feedback formativo detalhado
 * Fornece feedback não apenas por nota, mas por competência e área de conhecimento
 */
export class GenerateFormativeFeedbackUseCase {
  constructor(
    private aiService: IAIService,
    private quizRepository: IQuizRepository,
    private lessonRepository: ILessonRepository
  ) { }

  async execute(request: GenerateFormativeFeedbackRequest): Promise<FormativeFeedback> {
    const { quizResultId } = request;

    // Busca o resultado do quiz
    const result = this.quizRepository.getQuizResultById(quizResultId);
    if (!result) {
      throw new Error(`Resultado de quiz ${quizResultId} não encontrado`);
    }

    // Busca o plano de aula para contexto
    const lessonPlan = this.lessonRepository.getLessonPlanById(result.lessonPlanId);
    if (!lessonPlan) {
      throw new Error(`Plano de aula ${result.lessonPlanId} não encontrado`);
    }

    // Gera feedback formativo usando IA
    const feedback = await this.generateFeedbackWithAI(result, lessonPlan);

    return feedback;
  }

  private async generateFeedbackWithAI(
    result: QuizResult,
    lessonPlan: LessonPlan
  ): Promise<FormativeFeedback> {
    // Identifica questões erradas e suas justificativas
    const wrongAnswers = result.answers.filter(a => !a.isCorrect);
    const wrongQuestions = wrongAnswers.map(answer => {
      const question = lessonPlan.quiz.find(q => q.id === answer.questionId);
      return question ? {
        question: question.question,
        justification: question.justification,
        selectedAnswer: question.options[answer.selectedAnswer],
        correctAnswer: question.options[question.correctAnswer]
      } : null;
    }).filter(q => q !== null);

    const prompt = `
Você é um especialista em avaliação formativa e pedagogia.
Analise o desempenho de um aluno e forneça um feedback formativo detalhado e construtivo.

CONTEXTO:
- Disciplina: ${lessonPlan.subject}
- Tema: ${lessonPlan.title}
- Ano: ${lessonPlan.gradeYear}
- Competências BNCC: ${lessonPlan.bnccCompetencies.join(', ')}

DESEMPENHO:
- Nota: ${result.score}%
- Acertos: ${result.correctAnswers} de ${result.totalQuestions}
- Questões erradas: ${wrongQuestions.length}

QUESTÕES ERRADAS:
${wrongQuestions.map((q, i) => `
${i + 1}. Pergunta: ${q?.question}
   Resposta do aluno: ${q?.selectedAnswer}
   Resposta correta: ${q?.correctAnswer}
   Justificativa: ${q?.justification}
`).join('\n')}

INSTRUÇÕES:
1. Forneça um feedback geral motivador e construtivo (máximo 200 caracteres)
2. Analise o desempenho por competência BNCC relacionada
3. Identifique 2-3 pontos fortes do aluno
4. Identifique 2-3 pontos que precisam de reforço
5. Forneça 2-3 sugestões específicas de estudo ou reforço

RETORNE APENAS UM JSON NO SEGUINTE FORMATO:
{
  "overallFeedback": "Feedback geral...",
  "competencyFeedback": [
    {
      "competency": "Competência BNCC 1",
      "performance": "excellent|good|needs_improvement",
      "feedback": "Feedback específico...",
      "questionsRelated": ["quiz-1", "quiz-2"]
    }
  ],
  "strengths": ["Ponto forte 1", "Ponto forte 2"],
  "weaknesses": ["Ponto fraco 1", "Ponto fraco 2"],
  "suggestions": ["Sugestão 1", "Sugestão 2"]
}
`;

    try {
      const response = await this.aiService.ask(prompt);
      const cleanedText = response.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      const parsed = JSON.parse(cleanedText);

      return parsed as FormativeFeedback;
    } catch (error) {
      console.error('Erro ao gerar feedback formativo:', error);

      // Fallback: feedback básico
      return {
        overallFeedback: result.score >= 70
          ? 'Parabéns! Você demonstrou bom domínio do conteúdo.'
          : result.score >= 50
            ? 'Continue estudando! Você está no caminho certo.'
            : 'Não desista! Revise o conteúdo e tente novamente.',
        competencyFeedback: [],
        strengths: [],
        weaknesses: wrongQuestions.map((_, i) => `Questão ${i + 1}`),
        suggestions: ['Revise o conteúdo da aula', 'Pratique mais exercícios similares']
      };
    }
  }
}
