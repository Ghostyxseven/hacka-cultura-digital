// src/application/usecases/UploadMaterialUseCase.ts
import { Material } from '../../core/entities/Material';
import { IMaterialRepository } from '../../core/repositories/IMaterialRepository';

export interface UploadMaterialRequest {
    unitId: string;
    fileName: string;
    fileType: string;
    content: string;
}

export class UploadMaterialUseCase {
    constructor(private repository: IMaterialRepository) { }

    execute(request: UploadMaterialRequest): Material {
        const material: Material = {
            id: `mat-${Date.now()}`,
            unitId: request.unitId,
            fileName: request.fileName,
            fileType: request.fileType,
            content: request.content,
            createdAt: new Date().toISOString()
        };

        this.repository.save(material);
        return material;
    }
}
