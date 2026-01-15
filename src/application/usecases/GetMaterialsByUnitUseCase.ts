// src/application/usecases/GetMaterialsByUnitUseCase.ts
import { Material } from '../../core/entities/Material';
import { IMaterialRepository } from '../../core/repositories/IMaterialRepository';

export class GetMaterialsByUnitUseCase {
    constructor(private repository: IMaterialRepository) { }

    execute(unitId: string): Material[] {
        return this.repository.getByUnitId(unitId);
    }
}
