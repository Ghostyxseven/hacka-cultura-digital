// src/application/usecases/ProcessGamificationUseCase.ts
import { IStudentProfileRepository } from '@/core/repositories/IStudentProfileRepository';
import { IQuizRepository } from '@/core/repositories/IQuizRepository';
import { QuizResult } from '@/core/entities/QuizResult';
import { StudentProfile } from '@/core/entities/StudentProfile';
import { Badge } from '@/core/entities/Badge';
import { INITIAL_BADGES } from '@/core/constants/Badges';

export interface GamificationResult {
    profile: StudentProfile;
    newBadges: Badge[];
    leveledUp: boolean;
    xpGained: number;
}

/**
 * Use Case para processar o ganho de XP e conquistas de um aluno
 */
export class ProcessGamificationUseCase {
    constructor(
        private profileRepository: IStudentProfileRepository,
        private quizRepository: IQuizRepository
    ) { }

    execute(quizResult: QuizResult): GamificationResult {
        const { userId, score, timeSpent } = quizResult;

        // 1. Busca ou cria o perfil do aluno
        let profile = this.profileRepository.getProfileByUserId(userId);
        if (!profile) {
            profile = {
                userId,
                xp: 0,
                level: 1,
                badges: [],
                updatedAt: new Date()
            };
        }

        const previousLevel = profile.level;
        const newBadges: Badge[] = [];

        // 2. Calcula Ganho de XP
        // Regra: Nota * 10 + Bônus de Perfeição (50 se nota 100)
        let xpGain = score * 10;
        if (score === 100) xpGain += 50;

        const xpGained = xpGain;
        profile.xp += xpGain;

        // 3. Verifica Level Up
        // Regra simples: cada 1000 XP sobe um nível
        profile.level = Math.floor(profile.xp / 1000) + 1;
        const leveledUp = profile.level > previousLevel;

        // 4. Verifica Medalhas (Badges)
        const allUserResults = this.quizRepository.getQuizResultsByUserId(userId);

        INITIAL_BADGES.forEach(badge => {
            // Pula se já tiver a medalha
            if (profile!.badges.includes(badge.id)) return;

            let achieved = false;

            switch (badge.type) {
                case 'quiz_score':
                    if (score >= badge.criteriaValue) achieved = true;
                    break;
                case 'participation':
                    if (allUserResults.length >= badge.criteriaValue) achieved = true;
                    break;
                case 'speed':
                    // Nota mínima de 70% para ganhar medalha de velocidade
                    if (score >= 70 && timeSpent && timeSpent <= badge.criteriaValue) achieved = true;
                    break;
            }

            if (achieved) {
                profile!.badges.push(badge.id);
                newBadges.push(badge);
            }
        });

        // 5. Salva perfil atualizado
        this.profileRepository.saveProfile(profile);

        return {
            profile,
            newBadges,
            leveledUp,
            xpGained
        };
    }
}
