import { Subject, createSubject, validateSubject } from '@/core/entities/Subject';
import { ISubjectRepository } from '../interfaces/ISubjectRepository';

const STORAGE_KEY = 'subjects';

/**
 * Implementação do repositório de disciplinas usando localStorage
 */
export class LocalStorageSubjectRepository implements ISubjectRepository {
  private getStorageKey(): string {
    return STORAGE_KEY;
  }

  private async getAllFromStorage(): Promise<Subject[]> {
    if (typeof window === 'undefined') {
      return [];
    }

    try {
      const data = localStorage.getItem(this.getStorageKey());
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Erro ao ler disciplinas do localStorage:', error);
      return [];
    }
  }

  private async saveToStorage(subjects: Subject[]): Promise<void> {
    if (typeof window === 'undefined') {
      return;
    }

    try {
      localStorage.setItem(this.getStorageKey(), JSON.stringify(subjects));
    } catch (error) {
      console.error('Erro ao salvar disciplinas no localStorage:', error);
      throw new Error('Falha ao salvar disciplina');
    }
  }

  async findAll(): Promise<Subject[]> {
    return this.getAllFromStorage();
  }

  async findById(id: string): Promise<Subject | null> {
    const subjects = await this.getAllFromStorage();
    return subjects.find((s) => s.id === id) || null;
  }

  async create(subjectData: Omit<Subject, 'id' | 'createdAt'>): Promise<Subject> {
    if (!validateSubject(subjectData)) {
      throw new Error('Dados da disciplina inválidos');
    }

    const subject = createSubject(subjectData);
    const subjects = await this.getAllFromStorage();
    subjects.push(subject);
    await this.saveToStorage(subjects);

    return subject;
  }

  async update(id: string, updates: Partial<Subject>): Promise<Subject> {
    const subjects = await this.getAllFromStorage();
    const index = subjects.findIndex((s) => s.id === id);

    if (index === -1) {
      throw new Error('Disciplina não encontrada');
    }

    const updatedSubject: Subject = {
      ...subjects[index],
      ...updates,
      id, // Garante que o ID não seja alterado
      updatedAt: new Date().toISOString(),
    };

    if (!validateSubject(updatedSubject)) {
      throw new Error('Dados atualizados da disciplina são inválidos');
    }

    subjects[index] = updatedSubject;
    await this.saveToStorage(subjects);

    return updatedSubject;
  }

  async delete(id: string): Promise<void> {
    const subjects = await this.getAllFromStorage();
    const filtered = subjects.filter((s) => s.id !== id);

    if (filtered.length === subjects.length) {
      throw new Error('Disciplina não encontrada');
    }

    await this.saveToStorage(filtered);
  }
}
