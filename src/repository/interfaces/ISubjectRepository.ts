import { Subject } from '@/core/entities/Subject';

/**
 * Interface do repositório de disciplinas
 */
export interface ISubjectRepository {
  findAll(): Promise<Subject[]>;
  findById(id: string): Promise<Subject | null>;
  create(subject: Omit<Subject, 'id' | 'createdAt'>): Promise<Subject>;
  update(id: string, subject: Partial<Subject>): Promise<Subject>;
  delete(id: string): Promise<void>;
}
