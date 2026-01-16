import { Unit } from '@/core/entities/Unit';

/**
 * Interface do repositório de unidades de ensino
 */
export interface IUnitRepository {
  findAll(): Promise<Unit[]>;
  findBySubjectId(subjectId: string): Promise<Unit[]>;
  findById(id: string): Promise<Unit | null>;
  create(unit: Omit<Unit, 'id' | 'createdAt'>): Promise<Unit>;
  update(id: string, unit: Partial<Unit>): Promise<Unit>;
  delete(id: string): Promise<void>;
}
