// src/lib/tutorService.ts
import { TutorService } from '../application/services/TutorService';
import { GetTutorResponseUseCase } from '../application/usecases/GetTutorResponseUseCase';
import { GeminiService } from '../infrastructure/ai/GeminiService';

let tutorServiceInstance: TutorService | null = null;

export function getTutorService(): TutorService {
    if (!tutorServiceInstance) {
        const aiService = new GeminiService();
        const getTutorResponseUseCase = new GetTutorResponseUseCase(aiService);
        tutorServiceInstance = new TutorService(getTutorResponseUseCase);
    }
    return tutorServiceInstance;
}
