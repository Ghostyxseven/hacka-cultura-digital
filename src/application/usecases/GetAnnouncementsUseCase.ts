// src/application/usecases/GetAnnouncementsUseCase.ts
import { Announcement } from '../../core/entities/Announcement';
import { IAnnouncementRepository } from '../../core/repositories/IAnnouncementRepository';

export interface GetAnnouncementsRequest {
    professorId?: string;
    subjectId?: string;
}

export class GetAnnouncementsUseCase {
    constructor(private announcementRepository: IAnnouncementRepository) { }

    execute(request: GetAnnouncementsRequest): Announcement[] {
        let announcements = this.announcementRepository.getAll();

        if (request.professorId) {
            announcements = announcements.filter(a => a.professorId === request.professorId);
        }

        if (request.subjectId) {
            announcements = announcements.filter(a => a.subjectId === request.subjectId);
        }

        return announcements.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    }
}
