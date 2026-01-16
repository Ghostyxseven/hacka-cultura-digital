import { Activity, createActivity, validateActivity } from '@/core/entities/Activity';
import { IActivityRepository } from '../interfaces/IActivityRepository';

const STORAGE_KEY = 'activities';

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
      throw new Error('Falha ao salvar atividade');
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
      throw new Error('Dados da atividade inválidos');
    }

    // Verifica se já existe uma atividade para esta unidade
    const existingActivity = await this.findByUnitId(activityData.unitId);
    if (existingActivity) {
      throw new Error('Já existe uma atividade para esta unidade');
    }

    const activity = createActivity(activityData);
    const activities = await this.getAllFromStorage();
    activities.push(activity);
    await this.saveToStorage(activities);

    return activity;
  }

  async update(id: string, updates: Partial<Activity>): Promise<Activity> {
    const activities = await this.getAllFromStorage();
    const index = activities.findIndex((a) => a.id === id);

    if (index === -1) {
      throw new Error('Atividade não encontrada');
    }

    const updatedActivity: Activity = {
      ...activities[index],
      ...updates,
      id, // Garante que o ID não seja alterado
      updatedAt: new Date().toISOString(),
    };

    if (!validateActivity(updatedActivity)) {
      throw new Error('Dados atualizados da atividade são inválidos');
    }

    activities[index] = updatedActivity;
    await this.saveToStorage(activities);

    return updatedActivity;
  }

  async delete(id: string): Promise<void> {
    const activities = await this.getAllFromStorage();
    const filtered = activities.filter((a) => a.id !== id);

    if (filtered.length === activities.length) {
      throw new Error('Atividade não encontrada');
    }

    await this.saveToStorage(filtered);
  }
}
