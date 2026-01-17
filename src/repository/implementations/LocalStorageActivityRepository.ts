import { Activity, createActivity, validateActivity } from '@/core/entities/Activity';
import { IActivityRepository } from '../interfaces/IActivityRepository';

const STORAGE_KEY = 'activities';

/**
 * Erros personalizados do repositório de atividades
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
 * Implementação do repositório de atividades avaliativas usando localStorage
 */
export class LocalStorageActivityRepository implements IActivityRepository {
  private getStorageKey(): string {
    return STORAGE_KEY;
  }

  private async getAllFromStorage(): Promise<Activity[]> {
    if (typeof window === 'undefined') {
      return [];
    }

    try {
      const data = localStorage.getItem(this.getStorageKey());
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Erro ao ler atividades do localStorage:', error);
      return [];
    }
  }

  private async saveToStorage(activities: Activity[]): Promise<void> {
    if (typeof window === 'undefined') {
      return;
    }

    try {
      localStorage.setItem(this.getStorageKey(), JSON.stringify(activities));
    } catch (error) {
      console.error('Erro ao salvar atividades no localStorage:', error);
      throw new StorageError(`Falha ao salvar atividade: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    }
  }

  async findAll(): Promise<Activity[]> {
    return this.getAllFromStorage();
  }

  async findByUnitId(unitId: string): Promise<Activity | null> {
    const activities = await this.getAllFromStorage();
    // Retorna apenas atividades não arquivadas por padrão
    return activities.find((a) => a.unitId === unitId && !a.archived) || null;
  }

  async findById(id: string): Promise<Activity | null> {
    const activities = await this.getAllFromStorage();
    return activities.find((a) => a.id === id) || null;
  }

  async create(activityData: Omit<Activity, 'id' | 'createdAt'>): Promise<Activity> {
    if (!validateActivity(activityData)) {
      throw new ValidationError('Dados da atividade inválidos');
    }

    // Verifica se já existe uma atividade para esta unidade
    const existingActivity = await this.findByUnitId(activityData.unitId);
    if (existingActivity) {
      throw new ValidationError('Já existe uma atividade para esta unidade');
    }

    try {
      const activity = createActivity(activityData);
      const activities = await this.getAllFromStorage();
      activities.push(activity);
      await this.saveToStorage(activities);

      return activity;
    } catch (error) {
      if (error instanceof ValidationError || error instanceof StorageError) {
        throw error;
      }
      throw new StorageError(`Erro ao criar atividade: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    }
  }

  async update(id: string, updates: Partial<Activity>): Promise<Activity> {
    if (!id || typeof id !== 'string' || id.trim().length === 0) {
      throw new ValidationError('ID inválido para atualização de atividade');
    }

    const activities = await this.getAllFromStorage();
    const index = activities.findIndex((a) => a.id === id);

    if (index === -1) {
      throw new NotFoundError('Atividade', id);
    }

    const updatedActivity: Activity = {
      ...activities[index],
      ...updates,
      id, // Garante que o ID não seja alterado
      updatedAt: new Date().toISOString(),
    };

    if (!validateActivity(updatedActivity)) {
      throw new ValidationError('Dados atualizados da atividade são inválidos');
    }

    try {
      activities[index] = updatedActivity;
      await this.saveToStorage(activities);

      return updatedActivity;
    } catch (error) {
      if (error instanceof StorageError) {
        throw error;
      }
      throw new StorageError(`Erro ao atualizar atividade: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    }
  }

  async delete(id: string): Promise<void> {
    if (!id || typeof id !== 'string' || id.trim().length === 0) {
      throw new ValidationError('ID inválido para exclusão de atividade');
    }

    const activities = await this.getAllFromStorage();
    const filtered = activities.filter((a) => a.id !== id);

    if (filtered.length === activities.length) {
      throw new NotFoundError('Atividade', id);
    }

    try {
      await this.saveToStorage(filtered);
    } catch (error) {
      if (error instanceof StorageError) {
        throw error;
      }
      throw new StorageError(`Erro ao deletar atividade: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    }
  }
}
