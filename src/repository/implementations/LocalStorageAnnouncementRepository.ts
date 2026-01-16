// src/repository/implementations/LocalStorageAnnouncementRepository.ts
import { Announcement } from '@/core/entities/Announcement';
import { IAnnouncementRepository } from '@/core/repositories/IAnnouncementRepository';
import { StorageKeys } from '@/core/constants/StorageKeys';
import { parseJSONWithDates } from '@/utils/dateUtils';

/**
 * Implementação do repositório de avisos usando LocalStorage
 */
export class LocalStorageAnnouncementRepository implements IAnnouncementRepository {
    private static instance: LocalStorageAnnouncementRepository;

    private constructor() { }

    public static getInstance(): LocalStorageAnnouncementRepository {
        if (!LocalStorageAnnouncementRepository.instance) {
            LocalStorageAnnouncementRepository.instance = new LocalStorageAnnouncementRepository();
        }
        return LocalStorageAnnouncementRepository.instance;
    }

    save(announcement: Announcement): void {
        const announcements = this.getAll();
        const index = announcements.findIndex(a => a.id === announcement.id);

        if (index >= 0) {
            announcements[index] = announcement;
        } else {
            announcements.push(announcement);
        }

        localStorage.setItem(StorageKeys.ANNOUNCEMENTS, JSON.stringify(announcements));
    }

    delete(id: string): void {
        const announcements = this.getAll().filter(a => a.id !== id);
        localStorage.setItem(StorageKeys.ANNOUNCEMENTS, JSON.stringify(announcements));
    }

    getByProfessorId(professorId: string): Announcement[] {
        return this.getAll().filter(a => a.professorId === professorId);
    }

    getBySubjectId(subjectId: string): Announcement[] {
        return this.getAll().filter(a => a.subjectId === subjectId);
    }

    public getAll(): Announcement[] {
        if (typeof window === 'undefined') return [];
        const data = localStorage.getItem(StorageKeys.ANNOUNCEMENTS);
        return parseJSONWithDates<Announcement>(data);
    }

    getById(id: string): Announcement | undefined {
        return this.getAll().find(a => a.id === id);
    }
}
