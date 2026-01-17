import { LessonPlan, createLessonPlan, validateLessonPlan } from '@/core/entities/LessonPlan';
import { ILessonPlanRepository } from '../interfaces/ILessonPlanRepository';

const STORAGE_KEY = 'lessonPlans';

/**
 * Erros personalizados do repositório de planos de aula
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
 * Implementação do repositório de planos de aula usando localStorage
 */
export class LocalStorageLessonPlanRepository implements ILessonPlanRepository {
  private getStorageKey(): string {
    return STORAGE_KEY;
  }

  private async getAllFromStorage(): Promise<LessonPlan[]> {
    if (typeof window === 'undefined') {
      return [];
    }

    try {
      const data = localStorage.getItem(this.getStorageKey());
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Erro ao ler planos de aula do localStorage:', error);
      return [];
    }
  }

  private async saveToStorage(plans: LessonPlan[]): Promise<void> {
    if (typeof window === 'undefined') {
      return;
    }

    try {
      localStorage.setItem(this.getStorageKey(), JSON.stringify(plans));
    } catch (error) {
      console.error('Erro ao salvar planos de aula no localStorage:', error);
      throw new Error('Falha ao salvar plano de aula');
    }
  }

  async findAll(): Promise<LessonPlan[]> {
    return this.getAllFromStorage();
  }

  async findByUnitId(unitId: string): Promise<LessonPlan | null> {
    const plans = await this.getAllFromStorage();
    // Retorna apenas planos não arquivados por padrão
    return plans.find((p) => p.unitId === unitId && !p.archived) || null;
  }

  async findById(id: string): Promise<LessonPlan | null> {
    const plans = await this.getAllFromStorage();
    return plans.find((p) => p.id === id) || null;
  }

  async create(planData: Omit<LessonPlan, 'id' | 'createdAt'>): Promise<LessonPlan> {
    if (!validateLessonPlan(planData)) {
      throw new ValidationError('Dados do plano de aula inválidos');
    }

    // Verifica se já existe um plano para esta unidade
    const existingPlan = await this.findByUnitId(planData.unitId);
    if (existingPlan) {
      throw new ValidationError('Já existe um plano de aula para esta unidade');
    }

    try {
      const plan = createLessonPlan(planData);
      const plans = await this.getAllFromStorage();
      plans.push(plan);
      await this.saveToStorage(plans);

      return plan;
    } catch (error) {
      if (error instanceof ValidationError || error instanceof StorageError) {
        throw error;
      }
      throw new StorageError(`Erro ao criar plano de aula: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    }
  }

  async update(id: string, updates: Partial<LessonPlan>): Promise<LessonPlan> {
    if (!id || typeof id !== 'string' || id.trim().length === 0) {
      throw new ValidationError('ID inválido para atualização de plano de aula');
    }

    const plans = await this.getAllFromStorage();
    const index = plans.findIndex((p) => p.id === id);

    if (index === -1) {
      throw new NotFoundError('Plano de aula', id);
    }

    const updatedPlan: LessonPlan = {
      ...plans[index],
      ...updates,
      id, // Garante que o ID não seja alterado
      updatedAt: new Date().toISOString(),
    };

    if (!validateLessonPlan(updatedPlan)) {
      throw new ValidationError('Dados atualizados do plano de aula são inválidos');
    }

    try {
      plans[index] = updatedPlan;
      await this.saveToStorage(plans);

      return updatedPlan;
    } catch (error) {
      if (error instanceof StorageError) {
        throw error;
      }
      throw new StorageError(`Erro ao atualizar plano de aula: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    }
  }

  async delete(id: string): Promise<void> {
    if (!id || typeof id !== 'string' || id.trim().length === 0) {
      throw new ValidationError('ID inválido para exclusão de plano de aula');
    }

    const plans = await this.getAllFromStorage();
    const filtered = plans.filter((p) => p.id !== id);

    if (filtered.length === plans.length) {
      throw new NotFoundError('Plano de aula', id);
    }

    try {
      await this.saveToStorage(filtered);
    } catch (error) {
      if (error instanceof StorageError) {
        throw error;
      }
      throw new StorageError(`Erro ao deletar plano de aula: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    }
  }
}
