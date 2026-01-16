// src/application/usecases/GetClassTeachersUseCase.ts
import { IClassRepository } from '../../core/repositories/IClassRepository';
import { IUserRepository } from '../../core/repositories/IUserRepository';
import { User } from '../../core/entities/User';

/**
 * Interface para retornar professores com informações da disciplina
 */
export interface ClassTeacherInfo {
  teacher: User;
  subjectId: string;
  assignedAt: Date;
  isMainTeacher?: boolean;
}

/**
 * Caso de uso: Listar Professores de uma Turma
 * 
 * Lista todos os professores associados a uma turma, agrupados por disciplina.
 */
export class GetClassTeachersUseCase {
  constructor(
    private classRepository: IClassRepository,
    private userRepository: IUserRepository
  ) {}

  /**
   * Lista professores de uma turma
   * 
   * @param classId - ID da turma
   * @returns Lista de professores com informações da disciplina
   */
  execute(classId: string): ClassTeacherInfo[] {
    if (!classId || classId.trim().length === 0) {
      throw new Error("ID da turma é obrigatório");
    }

    const classEntity = this.classRepository.getById(classId);
    if (!classEntity) {
      throw new Error(`Turma com ID "${classId}" não encontrada`);
    }

    const teachersInfo: ClassTeacherInfo[] = [];

    for (const classTeacher of classEntity.teachers) {
      const teacher = this.userRepository.getUserById(classTeacher.teacherId);
      if (teacher) {
        teachersInfo.push({
          teacher,
          subjectId: classTeacher.subjectId,
          assignedAt: classTeacher.assignedAt,
          isMainTeacher: classTeacher.isMainTeacher,
        });
      }
    }

    return teachersInfo;
  }
}
