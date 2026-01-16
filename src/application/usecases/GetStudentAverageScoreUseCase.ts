// src/application/usecases/GetStudentAverageScoreUseCase.ts
import { IQuizRepository } from "../../core/repositories/IQuizRepository";

export class GetStudentAverageScoreUseCase {
    constructor(private quizRepository: IQuizRepository) { }

    execute(userId: string): number {
        const results = this.quizRepository.getQuizResultsByUserId(userId);

        if (results.length === 0) {
            return 0;
        }

        const totalScore = results.reduce((acc, result) => acc + result.score, 0);
        return Math.round(totalScore / results.length);
    }
}
