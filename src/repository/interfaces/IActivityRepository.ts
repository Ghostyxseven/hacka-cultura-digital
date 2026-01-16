import { Activity } from '@/core/entities/Activity';

/**
 * Interface do repositório de atividades avaliativas
 */
export interface IActivityRepository {
  findAll(): Promise<Activity[]>;
  findByUnitId(unitId: string): Promise<Activity | null>;
  findById(id: string): Promise<Activity | null>;
  create(activity: Omit<Activity, 'id' | 'createdAt'>): Promise<Activity>;
  update(id: string, activity: Partial<Activity>): Promise<Activity>;
  delete(id: string): Promise<void>;
}
