// src/application/usecases/AnalyzePerformanceUseCase.ts
import { IAIService } from "@/infrastructure/ai/IAIService";
import { IQuizRepository } from "@/core/repositories/IQuizRepository";
import { ILessonRepository } from "@/core/repositories/ILessonRepository";
import { QuizResult } from "@/core/entities/QuizResult";

export interface AnalyzePerformanceRequest {
    quizResultId: string;
}

/**
 * Use Case para analisar o desempenho de um aluno usando IA
 */
export class AnalyzePerformanceUseCase {
    constructor(
        private aiService: IAIService,
        private quizRepository: IQuizRepository,
        private lessonRepository: ILessonRepository
    ) { }

    async execute(request: AnalyzePerformanceRequest): Promise<QuizResult> {
        const { quizResultId } = request;

        // 1. Busca o resultado do quiz
        const result = this.quizRepository.getQuizResultById(quizResultId);
        if (!result) {
            throw new Error(`Resultado de quiz ${quizResultId} não encontrado`);
        }

        // 2. Se já tiver feedback e não for forçado, retorna o existente
        if (result.aiFeedback) {
            return result;
        }

        // 3. Busca o plano de aula para contexto
        const lessonPlan = this.lessonRepository.getLessonPlanById(result.lessonPlanId);
        if (!lessonPlan) {
            throw new Error(`Plano de aula ${result.lessonPlanId} não encontrado para o resultado ${quizResultId}`);
        }

        // 4. Solicita análise da IA
        const feedback = await this.aiService.analyzePerformance(result, lessonPlan);

        // 5. Atualiza o resultado com o feedback
        const updatedResult: QuizResult = {
            ...result,
            aiFeedback: feedback
        };

        // 6. Salva o resultado atualizado
        this.quizRepository.saveQuizResult(updatedResult);

        return updatedResult;
    }
}
