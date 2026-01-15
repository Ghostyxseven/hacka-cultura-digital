// src/lib/gamificationService.ts
import { GamificationService } from '../application/services/GamificationService';
import { LocalStorageProfileRepository } from '../repository/implementations/LocalStorageProfileRepository';
import { LocalStorageQuizRepository } from '../repository/implementations/LocalStorageQuizRepository';
import { ProcessGamificationUseCase } from '../application/usecases/ProcessGamificationUseCase';
import { GetRankingUseCase } from '../application/usecases/GetRankingUseCase';
import { GetStudentProfileUseCase } from '../application/usecases/GetStudentProfileUseCase';

let gamificationServiceInstance: GamificationService | null = null;

/**
 * Factory para o Serviço de Gamificação (Composition Root)
 */
export function getGamificationService(): GamificationService {
    if (!gamificationServiceInstance) {
        const profileRepository = LocalStorageProfileRepository.getInstance();
        const quizRepository = LocalStorageQuizRepository.getInstance();

        const processGamificationUseCase = new ProcessGamificationUseCase(profileRepository, quizRepository);
        const getRankingUseCase = new GetRankingUseCase(profileRepository);
        const getStudentProfileUseCase = new GetStudentProfileUseCase(profileRepository);

        gamificationServiceInstance = new GamificationService(
            processGamificationUseCase,
            getRankingUseCase,
            getStudentProfileUseCase
        );
    }
    return gamificationServiceInstance;
}
