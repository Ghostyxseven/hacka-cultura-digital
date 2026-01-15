// src/application/usecases/DeleteAnnouncementUseCase.ts
import { IAnnouncementRepository } from '../../core/repositories/IAnnouncementRepository';

export interface DeleteAnnouncementRequest {
    id: string;
}

export class DeleteAnnouncementUseCase {
    constructor(private announcementRepository: IAnnouncementRepository) { }

    execute(request: DeleteAnnouncementRequest): void {
        this.announcementRepository.delete(request.id);
    }
}
