// src/application/usecases/GetClassByIdUseCase.ts
import { Class } from '../../core/entities/Class';
import { IClassRepository } from '../../core/repositories/IClassRepository';

/**
 * Caso de uso: Buscar Turma por ID
 * 
 * Busca uma turma específica pelo ID.
 */
export class GetClassByIdUseCase {
  constructor(private classRepository: IClassRepository) {}

  /**
   * Busca uma turma por ID
   * 
   * @param id - ID da turma
   * @returns A turma encontrada ou undefined
   */
  execute(id: string): Class | undefined {
    if (!id || id.trim().length === 0) {
      throw new Error("ID da turma é obrigatório");
    }

    return this.classRepository.getById(id);
  }
}
