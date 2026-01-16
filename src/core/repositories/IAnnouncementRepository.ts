// src/core/repositories/IAnnouncementRepository.ts
import { Announcement } from '../entities/Announcement';

export interface IAnnouncementRepository {
    save(announcement: Announcement): void;
    getAll(): Announcement[];
    getById(id: string): Announcement | undefined;
    delete(id: string): void;
}
