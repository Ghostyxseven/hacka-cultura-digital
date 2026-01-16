// src/application/usecases/DeleteClassUseCase.ts
import { IClassRepository } from '../../core/repositories/IClassRepository';
import { IUserRepository } from '../../core/repositories/IUserRepository';

/**
 * Caso de uso: Excluir Turma
 * 
 * Remove uma turma do sistema.
 */
export class DeleteClassUseCase {
  constructor(
    private classRepository: IClassRepository,
    private userRepository: IUserRepository
  ) {}

  /**
   * Exclui uma turma
   * 
   * @param id - ID da turma
   * @throws Error se a turma tiver alunos ou professores associados
   */
  execute(id: string): void {
    if (!id || id.trim().length === 0) {
      throw new Error("ID da turma é obrigatório");
    }

    const classEntity = this.classRepository.getById(id);
    if (!classEntity) {
      throw new Error(`Turma com ID "${id}" não encontrada`);
    }

    // Validações: não permite excluir turma com alunos
    if (classEntity.students.length > 0) {
      throw new Error(
        `Não é possível excluir a turma "${classEntity.name}" porque ` +
        `existem ${classEntity.students.length} aluno(s) associado(s). ` +
        `Remova os alunos antes de excluir a turma.`
      );
    }

    // Remove a turma da lista de turmas dos professores
    if (classEntity.teachers.length > 0) {
      const teacherIds = [...new Set(classEntity.teachers.map(t => t.teacherId))];
      
      for (const teacherId of teacherIds) {
        const teacher = this.userRepository.getUserById(teacherId);
        if (teacher && teacher.classes) {
          teacher.classes = teacher.classes.filter(classId => classId !== id);
          this.userRepository.saveUser(teacher);
        }
      }
    }

    // Exclui a turma
    this.classRepository.delete(id);
  }
}
