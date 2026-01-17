import { Subject, createSubject, validateSubject } from '@/core/entities/Subject';
import { ISubjectRepository } from '../interfaces/ISubjectRepository';

const STORAGE_KEY = 'subjects';

/**
 * Erros personalizados do repositório
 */
export class RepositoryError extends Error {
  constructor(message: string, public code: string) {
    super(message);
    this.name = 'RepositoryError';
  }
}

export class NotFoundError extends RepositoryError {
  constructor(resource: string, id: string) {
    super(`${resource} com ID "${id}" não encontrado(a)`, 'NOT_FOUND');
    this.name = 'NotFoundError';
  }
}

export class ValidationError extends RepositoryError {
  constructor(message: string) {
    super(message, 'VALIDATION_ERROR');
    this.name = 'ValidationError';
  }
}

export class StorageError extends RepositoryError {
  constructor(message: string) {
    super(message, 'STORAGE_ERROR');
    this.name = 'StorageError';
  }
}

/**
 * Implementação do repositório de disciplinas usando localStorage
 * 
 * Esta implementação segue Clean Architecture, dependendo apenas da camada Core.
 * Fornece persistência local para disciplinas usando o localStorage do navegador.
 * 
 * @example
 * ```typescript
 * const repository = new LocalStorageSubjectRepository();
 * const subject = await repository.create({
 *   name: 'Matemática',
 *   description: 'Disciplina de Matemática',
 *   schoolYears: ['6º ano', '7º ano']
 * });
 * ```
 */
export class LocalStorageSubjectRepository implements ISubjectRepository {
  private getStorageKey(): string {
    return STORAGE_KEY;
  }

  /**
   * Verifica se o ambiente suporta localStorage (não é SSR)
   */
  private isStorageAvailable(): boolean {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  }

  /**
   * Obtém todas as disciplinas do localStorage
   * 
   * @returns Lista de disciplinas ou array vazio se não houver dados
   * @throws {StorageError} Se houver erro ao ler do storage
   */
  private async getAllFromStorage(): Promise<Subject[]> {
    if (!this.isStorageAvailable()) {
      return [];
    }

    try {
      const data = localStorage.getItem(this.getStorageKey());
      if (!data) {
        return [];
      }

      const parsed = JSON.parse(data);
      
      // Valida se é um array
      if (!Array.isArray(parsed)) {
        console.warn('Dados corrompidos no localStorage, inicializando array vazio');
        return [];
      }

      // Valida se todos os itens são Subject válidos
      return parsed.filter((item) => {
        if (!validateSubject(item)) {
          console.warn('Disciplina inválida encontrada no storage, removendo:', item);
          return false;
        }
        return true;
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      console.error('Erro ao ler disciplinas do localStorage:', errorMessage);
      throw new StorageError(`Falha ao ler dados do storage: ${errorMessage}`);
    }
  }

  /**
   * Salva disciplinas no localStorage
   * 
   * @param subjects - Lista de disciplinas para salvar
   * @throws {StorageError} Se houver erro ao salvar no storage
   */
  private async saveToStorage(subjects: Subject[]): Promise<void> {
    if (!this.isStorageAvailable()) {
      throw new StorageError('localStorage não está disponível neste ambiente');
    }

    try {
      // Valida todas as disciplinas antes de salvar
      for (const subject of subjects) {
        if (!validateSubject(subject)) {
          throw new ValidationError(`Disciplina inválida encontrada: ${subject.id}`);
        }
      }

      localStorage.setItem(this.getStorageKey(), JSON.stringify(subjects));
    } catch (error) {
      if (error instanceof ValidationError || error instanceof StorageError) {
        throw error;
      }
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      console.error('Erro ao salvar disciplinas no localStorage:', errorMessage);
      throw new StorageError(`Falha ao salvar dados no storage: ${errorMessage}`);
    }
  }

  /**
   * Busca todas as disciplinas
   * 
   * @returns Lista de todas as disciplinas cadastradas
   * @throws {StorageError} Se houver erro ao acessar o storage
   */
  async findAll(): Promise<Subject[]> {
    // Retorna apenas disciplinas não arquivadas por padrão
    const allSubjects = await this.getAllFromStorage();
    return allSubjects.filter((s) => !s.archived);
  }

  /**
   * Busca uma disciplina por ID
   * 
   * @param id - ID da disciplina
   * @returns Disciplina encontrada ou `null` se não existir
   * @throws {StorageError} Se houver erro ao acessar o storage
   */
  async findById(id: string): Promise<Subject | null> {
    if (!id || typeof id !== 'string' || id.trim().length === 0) {
      throw new ValidationError('ID inválido para busca de disciplina');
    }

    const subjects = await this.getAllFromStorage();
    return subjects.find((s) => s.id === id) || null;
  }

  /**
   * Cria uma nova disciplina
   * 
   * @param subjectData - Dados da disciplina (sem `id` e `createdAt`)
   * @returns Disciplina criada
   * @throws {ValidationError} Se os dados forem inválidos
   * @throws {StorageError} Se houver erro ao salvar no storage
   */
  async create(subjectData: Omit<Subject, 'id' | 'createdAt'>): Promise<Subject> {
    if (!validateSubject(subjectData)) {
      throw new ValidationError('Dados da disciplina inválidos');
    }

    try {
      const subject = createSubject(subjectData);
      const subjects = await this.getAllFromStorage();
      
      // Verifica duplicatas (não permite disciplinas arquivadas na verificação)
      const exists = subjects.some(
        (s) => 
          !s.archived && 
          s.name.toLowerCase().trim() === subject.name.toLowerCase().trim()
      );
      if (exists) {
        throw new ValidationError(`Já existe uma disciplina com o nome "${subject.name}"`);
      }

      subjects.push(subject);
      await this.saveToStorage(subjects);

      return subject;
    } catch (error) {
      if (error instanceof ValidationError || error instanceof StorageError) {
        throw error;
      }
      throw new StorageError(`Erro ao criar disciplina: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    }
  }

  /**
   * Atualiza uma disciplina existente
   * 
   * @param id - ID da disciplina a ser atualizada
   * @param updates - Dados para atualização
   * @returns Disciplina atualizada
   * @throws {NotFoundError} Se a disciplina não for encontrada
   * @throws {ValidationError} Se os dados atualizados forem inválidos
   * @throws {StorageError} Se houver erro ao salvar no storage
   */
  async update(id: string, updates: Partial<Subject>): Promise<Subject> {
    if (!id || typeof id !== 'string' || id.trim().length === 0) {
      throw new ValidationError('ID inválido para atualização de disciplina');
    }

    const subjects = await this.getAllFromStorage();
    const index = subjects.findIndex((s) => s.id === id);

    if (index === -1) {
      throw new NotFoundError('Disciplina', id);
    }

    const updatedSubject: Subject = {
      ...subjects[index],
      ...updates,
      id, // Garante que o ID não seja alterado
      updatedAt: new Date().toISOString(),
    };

    if (!validateSubject(updatedSubject)) {
      throw new ValidationError('Dados atualizados da disciplina são inválidos');
    }

    subjects[index] = updatedSubject;
    await this.saveToStorage(subjects);

    return updatedSubject;
  }

  /**
   * Deleta uma disciplina
   * 
   * @param id - ID da disciplina a ser deletada
   * @throws {NotFoundError} Se a disciplina não for encontrada
   * @throws {StorageError} Se houver erro ao salvar no storage
   */
  async delete(id: string): Promise<void> {
    if (!id || typeof id !== 'string' || id.trim().length === 0) {
      throw new ValidationError('ID inválido para exclusão de disciplina');
    }

    const subjects = await this.getAllFromStorage();
    const filtered = subjects.filter((s) => s.id !== id);

    if (filtered.length === subjects.length) {
      throw new NotFoundError('Disciplina', id);
    }

    await this.saveToStorage(filtered);
  }
}
