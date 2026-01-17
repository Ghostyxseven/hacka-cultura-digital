import { Unit, createUnit, validateUnit } from '@/core/entities/Unit';
import { IUnitRepository } from '../interfaces/IUnitRepository';

const STORAGE_KEY = 'units';

/**
 * Erros personalizados do repositório de unidades
 */
class RepositoryError extends Error {
  constructor(message: string, public code: string) {
    super(message);
    this.name = 'RepositoryError';
  }
}

class NotFoundError extends RepositoryError {
  constructor(resource: string, id: string) {
    super(`${resource} com ID "${id}" não encontrado(a)`, 'NOT_FOUND');
    this.name = 'NotFoundError';
  }
}

class ValidationError extends RepositoryError {
  constructor(message: string) {
    super(message, 'VALIDATION_ERROR');
    this.name = 'ValidationError';
  }
}

class StorageError extends RepositoryError {
  constructor(message: string) {
    super(message, 'STORAGE_ERROR');
    this.name = 'StorageError';
  }
}

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
      throw new StorageError(`Falha ao salvar unidade: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
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
      throw new ValidationError('Dados da unidade inválidos');
    }

    try {
      const unit = createUnit(unitData);
      const units = await this.getAllFromStorage();
      units.push(unit);
      await this.saveToStorage(units);

      return unit;
    } catch (error) {
      if (error instanceof ValidationError || error instanceof StorageError) {
        throw error;
      }
      throw new StorageError(`Erro ao criar unidade: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    }
  }

  async update(id: string, updates: Partial<Unit>): Promise<Unit> {
    if (!id || typeof id !== 'string' || id.trim().length === 0) {
      throw new ValidationError('ID inválido para atualização de unidade');
    }

    const units = await this.getAllFromStorage();
    const index = units.findIndex((u) => u.id === id);

    if (index === -1) {
      throw new NotFoundError('Unidade', id);
    }

    const updatedUnit: Unit = {
      ...units[index],
      ...updates,
      id, // Garante que o ID não seja alterado
      updatedAt: new Date().toISOString(),
    };

    if (!validateUnit(updatedUnit)) {
      throw new ValidationError('Dados atualizados da unidade são inválidos');
    }

    try {
      units[index] = updatedUnit;
      await this.saveToStorage(units);

      return updatedUnit;
    } catch (error) {
      if (error instanceof StorageError) {
        throw error;
      }
      throw new StorageError(`Erro ao atualizar unidade: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    }
  }

  async delete(id: string): Promise<void> {
    if (!id || typeof id !== 'string' || id.trim().length === 0) {
      throw new ValidationError('ID inválido para exclusão de unidade');
    }

    const units = await this.getAllFromStorage();
    const filtered = units.filter((u) => u.id !== id);

    if (filtered.length === units.length) {
      throw new NotFoundError('Unidade', id);
    }

    try {
      await this.saveToStorage(filtered);
    } catch (error) {
      if (error instanceof StorageError) {
        throw error;
      }
      throw new StorageError(`Erro ao deletar unidade: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    }
  }
}
