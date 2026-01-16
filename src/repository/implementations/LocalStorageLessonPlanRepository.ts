import { LessonPlan, createLessonPlan, validateLessonPlan } from '@/core/entities/LessonPlan';
import { ILessonPlanRepository } from '../interfaces/ILessonPlanRepository';

const STORAGE_KEY = 'lessonPlans';

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
    return plans.find((p) => p.unitId === unitId) || null;
  }

  async findById(id: string): Promise<LessonPlan | null> {
    const plans = await this.getAllFromStorage();
    return plans.find((p) => p.id === id) || null;
  }

  async create(planData: Omit<LessonPlan, 'id' | 'createdAt'>): Promise<LessonPlan> {
    if (!validateLessonPlan(planData)) {
      throw new Error('Dados do plano de aula inválidos');
    }

    // Verifica se já existe um plano para esta unidade
    const existingPlan = await this.findByUnitId(planData.unitId);
    if (existingPlan) {
      throw new Error('Já existe um plano de aula para esta unidade');
    }

    const plan = createLessonPlan(planData);
    const plans = await this.getAllFromStorage();
    plans.push(plan);
    await this.saveToStorage(plans);

    return plan;
  }

  async update(id: string, updates: Partial<LessonPlan>): Promise<LessonPlan> {
    const plans = await this.getAllFromStorage();
    const index = plans.findIndex((p) => p.id === id);

    if (index === -1) {
      throw new Error('Plano de aula não encontrado');
    }

    const updatedPlan: LessonPlan = {
      ...plans[index],
      ...updates,
      id, // Garante que o ID não seja alterado
      updatedAt: new Date().toISOString(),
    };

    if (!validateLessonPlan(updatedPlan)) {
      throw new Error('Dados atualizados do plano de aula são inválidos');
    }

    plans[index] = updatedPlan;
    await this.saveToStorage(plans);

    return updatedPlan;
  }

  async delete(id: string): Promise<void> {
    const plans = await this.getAllFromStorage();
    const filtered = plans.filter((p) => p.id !== id);

    if (filtered.length === plans.length) {
      throw new Error('Plano de aula não encontrado');
    }

    await this.saveToStorage(filtered);
  }
}
