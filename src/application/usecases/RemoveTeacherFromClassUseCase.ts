// src/application/usecases/RemoveTeacherFromClassUseCase.ts
import { IClassRepository } from '../../core/repositories/IClassRepository';
import { IUserRepository } from '../../core/repositories/IUserRepository';
import { Class } from '../../core/entities/Class';

/**
 * Caso de uso: Remover Professor de Turma
 * 
 * Remove a associação de um professor com uma turma/disciplina.
 */
export class RemoveTeacherFromClassUseCase {
  constructor(
    private classRepository: IClassRepository,
    private userRepository: IUserRepository
  ) {}

  /**
   * Remove um professor de uma turma
   * 
   * @param classId - ID da turma
   * @param teacherId - ID do professor
   * @param subjectId - ID da disciplina (opcional, remove todas se não especificado)
   * @returns A turma atualizada
   * @throws Error se os dados forem inválidos
   */
  execute(classId: string, teacherId: string, subjectId?: string): Class {
    // Validações
    if (!classId || !teacherId) {
      throw new Error("ID da turma e do professor são obrigatórios");
    }

    // Busca a turma
    const classEntity = this.classRepository.getById(classId);
    if (!classEntity) {
      throw new Error(`Turma com ID "${classId}" não encontrada`);
    }

    // Remove o professor da turma
    if (subjectId) {
      // Remove apenas da disciplina específica
      const index = classEntity.teachers.findIndex(
        t => t.teacherId === teacherId && t.subjectId === subjectId
      );
      
      if (index === -1) {
        throw new Error(`Professor não está associado a esta turma nesta disciplina`);
      }
      
      classEntity.teachers.splice(index, 1);
    } else {
      // Remove de todas as disciplinas
      classEntity.teachers = classEntity.teachers.filter(
        t => t.teacherId !== teacherId
      );
    }

    // Se o professor não está mais em nenhuma disciplina desta turma,
    // remove a turma da lista de turmas do professor
    const stillInClass = classEntity.teachers.some(t => t.teacherId === teacherId);
    if (!stillInClass) {
      const teacher = this.userRepository.getUserById(teacherId);
      if (teacher && teacher.classes) {
        teacher.classes = teacher.classes.filter(id => id !== classId);
        this.userRepository.saveUser(teacher);
      }
    }

    // Salva a turma atualizada
    this.classRepository.save(classEntity);

    return classEntity;
  }
}
