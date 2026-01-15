// src/application/services/GamificationService.ts
import { ProcessGamificationUseCase, GamificationResult } from '../usecases/ProcessGamificationUseCase';
import { GetRankingUseCase, RankingItem } from '../usecases/GetRankingUseCase';
import { GetStudentProfileUseCase } from '../usecases/GetStudentProfileUseCase';
import { QuizResult } from '@/core/entities/QuizResult';
import { StudentProfile } from '@/core/entities/StudentProfile';

/**
 * Serviço de Gamificação
 * Coordenam os casos de uso de engajamento e recompensas
 */
export class GamificationService {
    constructor(
        private processGamificationUseCase: ProcessGamificationUseCase,
        private getRankingUseCase: GetRankingUseCase,
        private getStudentProfileUseCase: GetStudentProfileUseCase
    ) { }

    /**
     * Processa o resultado de um quiz para atualizar XP e Medalhas
     */
    processQuizCompletion(quizResult: QuizResult): GamificationResult {
        return this.processGamificationUseCase.execute(quizResult);
    }

    /**
     * Retorna o ranking global de alunos
     */
    getLeaderboard(): RankingItem[] {
        return this.getRankingUseCase.execute();
    }

    /**
     * Busca o perfil de um aluno específico
     */
    getStudentProfile(userId: string): StudentProfile {
        return this.getStudentProfileUseCase.execute(userId);
    }
}
