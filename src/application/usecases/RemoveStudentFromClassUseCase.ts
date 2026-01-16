// src/application/usecases/RemoveStudentFromClassUseCase.ts
import { IClassRepository } from '../../core/repositories/IClassRepository';
import { IUserRepository } from '../../core/repositories/IUserRepository';
import { Class } from '../../core/entities/Class';

/**
 * Caso de uso: Remover Aluno de Turma
 * 
 * Remove um aluno de uma turma.
 */
export class RemoveStudentFromClassUseCase {
  constructor(
    private classRepository: IClassRepository,
    private userRepository: IUserRepository
  ) {}

  /**
   * Remove um aluno de uma turma
   * 
   * @param classId - ID da turma
   * @param studentId - ID do aluno
   * @returns A turma atualizada
   * @throws Error se os dados forem inválidos
   */
  execute(classId: string, studentId: string): Class {
    // Validações
    if (!classId || !studentId) {
      throw new Error("ID da turma e do aluno são obrigatórios");
    }

    // Busca a turma
    const classEntity = this.classRepository.getById(classId);
    if (!classEntity) {
      throw new Error(`Turma com ID "${classId}" não encontrada`);
    }

    // Verifica se o aluno está na turma
    if (!classEntity.students.includes(studentId)) {
      throw new Error(`Aluno não está associado a esta turma`);
    }

    // Remove o aluno da turma
    classEntity.students = classEntity.students.filter(id => id !== studentId);

    // Atualiza o aluno
    const student = this.userRepository.getUserById(studentId);
    if (student && student.classId === classId) {
      student.classId = undefined;
      this.userRepository.saveUser(student);
    }

    // Salva a turma atualizada
    this.classRepository.save(classEntity);

    return classEntity;
  }
}
