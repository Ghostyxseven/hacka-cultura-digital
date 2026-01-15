// src/repository/implementations/LocalStorageProfileRepository.ts
import { StudentProfile } from '@/core/entities/StudentProfile';
import { IStudentProfileRepository } from '@/core/repositories/IStudentProfileRepository';
import { StorageKeys } from '@/core/constants/StorageKeys';
import { parseJSONWithDates } from '@/utils/dateUtils';

/**
 * Implementação do repositório de perfis de alunos usando LocalStorage
 */
export class LocalStorageProfileRepository implements IStudentProfileRepository {
    private static instance: LocalStorageProfileRepository;

    private constructor() { }

    public static getInstance(): LocalStorageProfileRepository {
        if (!LocalStorageProfileRepository.instance) {
            LocalStorageProfileRepository.instance = new LocalStorageProfileRepository();
        }
        return LocalStorageProfileRepository.instance;
    }

    getProfileByUserId(userId: string): StudentProfile | undefined {
        return this.getAllProfiles().find(p => p.userId === userId);
    }

    saveProfile(profile: StudentProfile): void {
        const profiles = this.getAllProfiles();
        const index = profiles.findIndex(p => p.userId === profile.userId);

        if (index >= 0) {
            profiles[index] = {
                ...profile,
                updatedAt: new Date()
            };
        } else {
            profiles.push({
                ...profile,
                updatedAt: new Date()
            });
        }

        localStorage.setItem(StorageKeys.STUDENT_PROFILES, JSON.stringify(profiles));
    }

    public getAllProfiles(): StudentProfile[] {
        if (typeof window === 'undefined') return [];
        const data = localStorage.getItem(StorageKeys.STUDENT_PROFILES);
        return parseJSONWithDates<StudentProfile>(data);
    }
}
