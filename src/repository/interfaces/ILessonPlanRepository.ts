import { LessonPlan } from '@/core/entities/LessonPlan';

/**
 * Interface do repositório de planos de aula
 */
export interface ILessonPlanRepository {
  findAll(): Promise<LessonPlan[]>;
  findByUnitId(unitId: string): Promise<LessonPlan | null>;
  findById(id: string): Promise<LessonPlan | null>;
  create(plan: Omit<LessonPlan, 'id' | 'createdAt'>): Promise<LessonPlan>;
  update(id: string, plan: Partial<LessonPlan>): Promise<LessonPlan>;
  delete(id: string): Promise<void>;
}
