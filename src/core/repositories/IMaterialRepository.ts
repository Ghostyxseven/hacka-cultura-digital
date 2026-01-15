// src/core/repositories/IMaterialRepository.ts
import { Material } from '../entities/Material';

export interface IMaterialRepository {
    save(material: Material): void;
    getByUnitId(unitId: string): Material[];
    delete(id: string): void;
}
