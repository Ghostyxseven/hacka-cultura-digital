// src/lib/announcementService.ts
import { AnnouncementService } from '../application/services/AnnouncementService';
import { CreateAnnouncementUseCase } from '../application/usecases/CreateAnnouncementUseCase';
import { GetAnnouncementsUseCase } from '../application/usecases/GetAnnouncementsUseCase';
import { DeleteAnnouncementUseCase } from '../application/usecases/DeleteAnnouncementUseCase';
import { LocalStorageAnnouncementRepository } from '../repository/implementations/LocalStorageAnnouncementRepository';

let announcementServiceInstance: AnnouncementService | null = null;

/**
 * Obtém instância singleton do AnnouncementService
 */
export function getAnnouncementService(): AnnouncementService {
    if (!announcementServiceInstance) {
        const repository = LocalStorageAnnouncementRepository.getInstance();

        const createAnnouncementUseCase = new CreateAnnouncementUseCase(repository);
        const getAnnouncementsUseCase = new GetAnnouncementsUseCase(repository);
        const deleteAnnouncementUseCase = new DeleteAnnouncementUseCase(repository);

        announcementServiceInstance = new AnnouncementService(
            createAnnouncementUseCase,
            getAnnouncementsUseCase,
            deleteAnnouncementUseCase
        );
    }
    return announcementServiceInstance;
}
