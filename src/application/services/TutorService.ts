// src/application/services/TutorService.ts
import { LessonPlan } from '../../core/entities/LessonPlan';
import { GetTutorResponseUseCase, TutorChatRequest } from '../usecases/GetTutorResponseUseCase';

export class TutorService {
    constructor(private getTutorResponseUseCase: GetTutorResponseUseCase) { }

    async getTutorResponse(request: TutorChatRequest, lessonPlan: LessonPlan): Promise<string> {
        return this.getTutorResponseUseCase.execute(request, lessonPlan);
    }
}
