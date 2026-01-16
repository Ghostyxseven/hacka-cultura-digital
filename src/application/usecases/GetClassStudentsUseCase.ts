// src/application/usecases/GetClassStudentsUseCase.ts
import { IClassRepository } from '../../core/repositories/IClassRepository';
import { IUserRepository } from '../../core/repositories/IUserRepository';
import { User } from '../../core/entities/User';

/**
 * Caso de uso: Listar Alunos de uma Turma
 * 
 * Lista todos os alunos associados a uma turma.
 */
export class GetClassStudentsUseCase {
  constructor(
    private classRepository: IClassRepository,
    private userRepository: IUserRepository
  ) {}

  /**
   * Lista alunos de uma turma
   * 
   * @param classId - ID da turma
   * @returns Lista de alunos
   */
  execute(classId: string): User[] {
    if (!classId || classId.trim().length === 0) {
      throw new Error("ID da turma é obrigatório");
    }

    const classEntity = this.classRepository.getById(classId);
    if (!classEntity) {
      throw new Error(`Turma com ID "${classId}" não encontrada`);
    }

    const students: User[] = [];

    for (const studentId of classEntity.students) {
      const student = this.userRepository.getUserById(studentId);
      if (student) {
        students.push(student);
      }
    }

    // Ordena por nome
    return students.sort((a, b) => a.name.localeCompare(b.name));
  }
}
