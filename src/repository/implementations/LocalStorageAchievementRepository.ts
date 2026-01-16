// src/repository/implementations/LocalStorageAchievementRepository.ts
import { Achievement, AchievementProgress } from '@/core/entities/Achievement';
import { IAchievementRepository } from '@/core/repositories/IAchievementRepository';
import { StorageKeys } from '@/core/constants/StorageKeys';
import { parseJSONWithDates } from '@/utils/dateUtils';

/**
 * Implementação do repositório de conquistas usando LocalStorage
 */
export class LocalStorageAchievementRepository implements IAchievementRepository {
    private static instance: LocalStorageAchievementRepository;

    private constructor() { }

    public static getInstance(): LocalStorageAchievementRepository {
        if (!LocalStorageAchievementRepository.instance) {
            LocalStorageAchievementRepository.instance = new LocalStorageAchievementRepository();
        }
        return LocalStorageAchievementRepository.instance;
    }

    save(achievement: Achievement): void {
        const achievements = this.getAll();
        const index = achievements.findIndex(a => a.id === achievement.id);

        if (index >= 0) {
            achievements[index] = achievement;
        } else {
            achievements.push(achievement);
        }

        localStorage.setItem(StorageKeys.ACHIEVEMENTS, JSON.stringify(achievements));
    }

    getAll(): Achievement[] {
        if (typeof window === 'undefined') return [];
        const data = localStorage.getItem(StorageKeys.ACHIEVEMENTS);
        return parseJSONWithDates<Achievement>(data);
    }

    getById(id: string): Achievement | undefined {
        return this.getAll().find(a => a.id === id);
    }

    findByCategory(category: Achievement['category']): Achievement[] {
        return this.getAll().filter(a => a.category === category);
    }

    saveProgress(progress: AchievementProgress): void {
        const allProgress = this.getAllProgress();
        const index = allProgress.findIndex(
            p => p.achievementId === progress.achievementId && p.userId === progress.userId
        );

        if (index >= 0) {
            allProgress[index] = progress;
        } else {
            allProgress.push(progress);
        }

        localStorage.setItem(StorageKeys.ACHIEVEMENT_PROGRESS, JSON.stringify(allProgress));
    }

    getProgressByUser(userId: string): AchievementProgress[] {
        return this.getAllProgress().filter(p => p.userId === userId);
    }

    getProgress(userId: string, achievementId: string): AchievementProgress | undefined {
        return this.getAllProgress().find(
            p => p.userId === userId && p.achievementId === achievementId
        );
    }

    getUnlockedByUser(userId: string): Achievement[] {
        const progress = this.getProgressByUser(userId);
        const unlockedIds = progress
            .filter(p => p.isUnlocked)
            .map(p => p.achievementId);

        return this.getAll().filter(a => unlockedIds.includes(a.id));
    }

    delete(id: string): void {
        const achievements = this.getAll().filter(a => a.id !== id);
        localStorage.setItem(StorageKeys.ACHIEVEMENTS, JSON.stringify(achievements));
    }

    private getAllProgress(): AchievementProgress[] {
        if (typeof window === 'undefined') return [];
        const data = localStorage.getItem(StorageKeys.ACHIEVEMENT_PROGRESS);
        return parseJSONWithDates<AchievementProgress>(data);
    }
}
