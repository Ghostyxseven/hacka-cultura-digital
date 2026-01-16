// src/application/usecases/GetTeacherClassesUseCase.ts
import { IClassRepository } from '../../core/repositories/IClassRepository';
import { IUserRepository } from '../../core/repositories/IUserRepository';
import { Class } from '../../core/entities/Class';

/**
 * Caso de uso: Listar Turmas de um Professor
 * 
 * Lista todas as turmas em que um professor leciona.
 */
export class GetTeacherClassesUseCase {
  constructor(
    private classRepository: IClassRepository,
    private userRepository: IUserRepository
  ) {}

  /**
   * Lista turmas de um professor
   * 
   * @param teacherId - ID do professor
   * @param subjectId - Opcional: filtrar por disciplina
   * @returns Lista de turmas
   */
  execute(teacherId: string, subjectId?: string): Class[] {
    if (!teacherId || teacherId.trim().length === 0) {
      throw new Error("ID do professor é obrigatório");
    }

    const teacher = this.userRepository.getUserById(teacherId);
    if (!teacher) {
      throw new Error(`Professor com ID "${teacherId}" não encontrado`);
    }

    if (teacher.role !== 'professor') {
      throw new Error(`Usuário com ID "${teacherId}" não é um professor`);
    }

    let classes = this.classRepository.getByTeacherId(teacherId);

    // Filtra por disciplina se especificado
    if (subjectId) {
      classes = classes.filter(c =>
        c.teachers.some(t => t.teacherId === teacherId && t.subjectId === subjectId)
      );
    }

    // Ordena por série e depois por nome
    return classes.sort((a, b) => {
      const gradeOrder: Record<string, number> = {
        '6º Ano': 1,
        '7º Ano': 2,
        '8º Ano': 3,
        '9º Ano': 4,
        '1º Ano EM': 5,
        '2º Ano EM': 6,
        '3º Ano EM': 7,
      };

      const gradeDiff = gradeOrder[a.gradeYear] - gradeOrder[b.gradeYear];
      if (gradeDiff !== 0) return gradeDiff;

      return a.name.localeCompare(b.name);
    });
  }
}
