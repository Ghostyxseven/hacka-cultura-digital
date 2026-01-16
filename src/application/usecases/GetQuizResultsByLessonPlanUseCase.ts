// src/application/usecases/GetQuizResultsByLessonPlanUseCase.ts
import { QuizResult } from '../../core/entities/QuizResult';
import { IQuizRepository } from '../../core/repositories/IQuizRepository';

export interface GetQuizResultsRequest {
    lessonPlanId: string;
}

export class GetQuizResultsByLessonPlanUseCase {
    constructor(private quizRepository: IQuizRepository) { }

    execute(request: GetQuizResultsRequest): QuizResult[] {
        return this.quizRepository.getQuizResultsByLessonPlanId(request.lessonPlanId)
            .sort((a, b) => b.completedAt.getTime() - a.completedAt.getTime());
    }
}
