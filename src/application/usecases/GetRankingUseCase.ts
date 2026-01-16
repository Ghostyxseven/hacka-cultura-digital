// src/application/usecases/GetRankingUseCase.ts
import { IStudentProfileRepository } from '@/core/repositories/IStudentProfileRepository';

export interface RankingItem {
    userId: string;
    xp: number;
    level: number;
    badgeCount: number;
    position: number;
}

/**
 * Use Case para buscar o ranking global de alunos
 */
export class GetRankingUseCase {
    constructor(private profileRepository: IStudentProfileRepository) { }

    execute(): RankingItem[] {
        const profiles = this.profileRepository.getAllProfiles();

        return profiles
            .sort((a, b) => b.xp - a.xp)
            .map((profile, index) => ({
                userId: profile.userId,
                xp: profile.xp,
                level: profile.level,
                badgeCount: profile.badges.length,
                position: index + 1
            }));
    }
}
