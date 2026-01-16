// src/repository/implementations/LocalStorageMaterialRepository.ts
import { Material } from '../../core/entities/Material';
import { IMaterialRepository } from '../../core/repositories/IMaterialRepository';

export class LocalStorageMaterialRepository implements IMaterialRepository {
    private static instance: LocalStorageMaterialRepository;
    private readonly STORAGE_KEY = '@hacka-cultura:materials';

    private constructor() { }

    public static getInstance(): LocalStorageMaterialRepository {
        if (!LocalStorageMaterialRepository.instance) {
            LocalStorageMaterialRepository.instance = new LocalStorageMaterialRepository();
        }
        return LocalStorageMaterialRepository.instance;
    }

    private getStoredMaterials(): Material[] {
        if (typeof window === 'undefined') return [];
        const stored = localStorage.getItem(this.STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    }

    save(material: Material): void {
        const materials = this.getStoredMaterials();
        const index = materials.findIndex(m => m.id === material.id);
        if (index >= 0) {
            materials[index] = material;
        } else {
            materials.push(material);
        }
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(materials));
    }

    getByUnitId(unitId: string): Material[] {
        return this.getStoredMaterials().filter(m => m.unitId === unitId);
    }

    delete(id: string): void {
        const materials = this.getStoredMaterials();
        const filtered = materials.filter(m => m.id !== id);
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filtered));
    }
}
