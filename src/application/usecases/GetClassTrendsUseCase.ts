// src/application/usecases/GetClassTrendsUseCase.ts
import { IAIService } from '../../infrastructure/ai/IAIService';
import { IQuizRepository } from '../../core/repositories/IQuizRepository';
import { QuizResult } from '../../core/entities/QuizResult';

export class GetClassTrendsUseCase {
    constructor(
        private aiService: IAIService,
        private quizRepository: IQuizRepository
    ) { }

    async execute(lessonPlanId: string): Promise<string> {
        const results = await this.quizRepository.getQuizResultsByLessonPlanId(lessonPlanId);

        if (results.length === 0) {
            return "Ainda não há resultados suficientes para gerar uma análise de tendências.";
        }

        const performanceData = results.map((r: QuizResult) => ({
            score: r.score,
            wrongQuestions: r.answers.filter((a: any) => !a.isCorrect).map((a: any) => a.questionId)
        }));

        const prompt = `
Analise os seguintes dados de desempenho de uma turma em um quiz:
${JSON.stringify(performanceData)}

O objetivo é identificar tendências pedagógicas.
Responda em português, de forma concisa e profissional para o professor:
1. Qual o nível geral de compreensão da turma?
2. Quais são os pontos críticos (questões ou temas que a maioria errou)?
3. Sugestão rápida de intervenção pedagógica.

Mantenha a resposta em no máximo 3 parágrafos curtos.
`;

        return await this.aiService.ask(prompt);
    }
}
