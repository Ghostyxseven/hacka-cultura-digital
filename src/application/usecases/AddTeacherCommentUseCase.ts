// src/application/usecases/AddTeacherCommentUseCase.ts
import { QuizResult } from '../../core/entities/QuizResult';
import { IQuizRepository } from '../../core/repositories/IQuizRepository';

export interface AddTeacherCommentRequest {
    quizResultId: string;
    comment: string;
}

export class AddTeacherCommentUseCase {
    constructor(private quizRepository: IQuizRepository) { }

    execute(request: AddTeacherCommentRequest): QuizResult {
        const result = this.quizRepository.getQuizResultById(request.quizResultId);

        if (!result) {
            throw new Error('Resultado do quiz não encontrado');
        }

        const updatedResult: QuizResult = {
            ...result,
            teacherComments: request.comment
        };

        this.quizRepository.saveQuizResult(updatedResult);
        return updatedResult;
    }
}
