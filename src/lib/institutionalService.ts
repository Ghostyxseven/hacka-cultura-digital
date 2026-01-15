// src/lib/institutionalService.ts
import { InstitutionalService } from '../application/services/InstitutionalService';
import { GetInstitutionalOverviewUseCase } from '../application/usecases/GetInstitutionalOverviewUseCase';
import { LocalStorageQuizRepository } from '../repository/implementations/LocalStorageQuizRepository';
import { LocalStorageRepository } from '../repository/implementations/LocalStorageRepository';
import { LocalStorageUserRepository } from '../repository/implementations/LocalStorageUserRepository';

let institutionalServiceInstance: InstitutionalService | null = null;

export function getInstitutionalService(): InstitutionalService {
    if (!institutionalServiceInstance) {
        const quizRepository = LocalStorageQuizRepository.getInstance();
        const lessonRepository = LocalStorageRepository.getInstance();
        const userRepository = LocalStorageUserRepository.getInstance();

        const getInstitutionalOverviewUseCase = new GetInstitutionalOverviewUseCase(
            quizRepository,
            lessonRepository,
            userRepository
        );

        institutionalServiceInstance = new InstitutionalService(getInstitutionalOverviewUseCase);
    }
    return institutionalServiceInstance;
}
