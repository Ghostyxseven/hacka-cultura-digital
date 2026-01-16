// src/application/services/AnnouncementService.ts
import { Announcement } from '../../core/entities/Announcement';
import { CreateAnnouncementUseCase, CreateAnnouncementRequest } from '../usecases/CreateAnnouncementUseCase';
import { GetAnnouncementsUseCase, GetAnnouncementsRequest } from '../usecases/GetAnnouncementsUseCase';
import { DeleteAnnouncementUseCase, DeleteAnnouncementRequest } from '../usecases/DeleteAnnouncementUseCase';

/**
 * Serviço de Avisos (Mural do Professor)
 * Orquestra a comunicação direta do professor para os alunos.
 */
export class AnnouncementService {
    constructor(
        private createAnnouncementUseCase: CreateAnnouncementUseCase,
        private getAnnouncementsUseCase: GetAnnouncementsUseCase,
        private deleteAnnouncementUseCase: DeleteAnnouncementUseCase
    ) { }

    createAnnouncement(request: CreateAnnouncementRequest): Announcement {
        return this.createAnnouncementUseCase.execute(request);
    }

    getAnnouncements(request: GetAnnouncementsRequest = {}): Announcement[] {
        return this.getAnnouncementsUseCase.execute(request);
    }

    deleteAnnouncement(id: string): void {
        this.deleteAnnouncementUseCase.execute({ id });
    }
}
