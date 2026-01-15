// src/application/usecases/CreateAnnouncementUseCase.ts
import { Announcement } from '../../core/entities/Announcement';
import { IAnnouncementRepository } from '../../core/repositories/IAnnouncementRepository';

export interface CreateAnnouncementRequest {
    professorId: string;
    subjectId?: string;
    title: string;
    content: string;
}

export class CreateAnnouncementUseCase {
    constructor(private announcementRepository: IAnnouncementRepository) { }

    execute(request: CreateAnnouncementRequest): Announcement {
        const announcement: Announcement = {
            id: `ann-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
            professorId: request.professorId,
            subjectId: request.subjectId,
            title: request.title,
            content: request.content,
            createdAt: new Date()
        };

        this.announcementRepository.save(announcement);
        return announcement;
    }
}
