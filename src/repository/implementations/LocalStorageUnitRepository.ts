import { Unit, createUnit, validateUnit } from '@/core/entities/Unit';
import { IUnitRepository } from '../interfaces/IUnitRepository';

const STORAGE_KEY = 'units';

/**
 * Implementação do repositório de unidades de ensino usando localStorage
 */
export class LocalStorageUnitRepository implements IUnitRepository {
  private getStorageKey(): string {
    return STORAGE_KEY;
  }

  private async getAllFromStorage(): Promise<Unit[]> {
    if (typeof window === 'undefined') {
      return [];
    }

    try {
      const data = localStorage.getItem(this.getStorageKey());
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Erro ao ler unidades do localStorage:', error);
      return [];
    }
  }

  private async saveToStorage(units: Unit[]): Promise<void> {
    if (typeof window === 'undefined') {
      return;
    }

    try {
      localStorage.setItem(this.getStorageKey(), JSON.stringify(units));
    } catch (error) {
      console.error('Erro ao salvar unidades no localStorage:', error);
      throw new Error('Falha ao salvar unidade');
    }
  }

  async findAll(): Promise<Unit[]> {
    return this.getAllFromStorage();
  }

  async findBySubjectId(subjectId: string): Promise<Unit[]> {
    const units = await this.getAllFromStorage();
    return units.filter((u) => u.subjectId === subjectId);
  }

  async findById(id: string): Promise<Unit | null> {
    const units = await this.getAllFromStorage();
    return units.find((u) => u.id === id) || null;
  }

  async create(unitData: Omit<Unit, 'id' | 'createdAt'>): Promise<Unit> {
    if (!validateUnit(unitData)) {
      throw new Error('Dados da unidade inválidos');
    }

    const unit = createUnit(unitData);
    const units = await this.getAllFromStorage();
    units.push(unit);
    await this.saveToStorage(units);

    return unit;
  }

  async update(id: string, updates: Partial<Unit>): Promise<Unit> {
    const units = await this.getAllFromStorage();
    const index = units.findIndex((u) => u.id === id);

    if (index === -1) {
      throw new Error('Unidade não encontrada');
    }

    const updatedUnit: Unit = {
      ...units[index],
      ...updates,
      id, // Garante que o ID não seja alterado
      updatedAt: new Date().toISOString(),
    };

    if (!validateUnit(updatedUnit)) {
      throw new Error('Dados atualizados da unidade são inválidos');
    }

    units[index] = updatedUnit;
    await this.saveToStorage(units);

    return updatedUnit;
  }

  async delete(id: string): Promise<void> {
    const units = await this.getAllFromStorage();
    const filtered = units.filter((u) => u.id !== id);

    if (filtered.length === units.length) {
      throw new Error('Unidade não encontrada');
    }

    await this.saveToStorage(filtered);
  }
}
