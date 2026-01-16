// src/application/usecases/AssignTeacherToClassUseCase.ts
import { IClassRepository } from '../../core/repositories/IClassRepository';
import { IUserRepository } from '../../core/repositories/IUserRepository';
import { ClassTeacher } from '../../core/entities/Class';

/**
 * Caso de uso: Associar Professor a Turma
 * 
 * Associa um professor a uma turma para lecionar uma disciplina específica.
 */
export class AssignTeacherToClassUseCase {
  constructor(
    private classRepository: IClassRepository,
    private userRepository: IUserRepository
  ) {}

  /**
   * Associa um professor a uma turma por disciplina
   * 
   * @param classId - ID da turma
   * @param teacherId - ID do professor
   * @param subjectId - ID da disciplina
   * @param isMainTeacher - Se é o coordenador da turma (opcional)
   * @returns A turma atualizada
   * @throws Error se os dados forem inválidos
   */
  execute(
    classId: string,
    teacherId: string,
    subjectId: string,
    isMainTeacher: boolean = false
  ): Class {
    // Validações
    if (!classId || !teacherId || !subjectId) {
      throw new Error("ID da turma, professor e disciplina são obrigatórios");
    }

    // Busca a turma
    const classEntity = this.classRepository.getById(classId);
    if (!classEntity) {
      throw new Error(`Turma com ID "${classId}" não encontrada`);
    }

    // Busca o professor
    const teacher = this.userRepository.getUserById(teacherId);
    if (!teacher) {
      throw new Error(`Professor com ID "${teacherId}" não encontrado`);
    }

    if (teacher.role !== 'professor') {
      throw new Error(`Usuário com ID "${teacherId}" não é um professor`);
    }

    // Verifica se o professor leciona a disciplina
    if (!teacher.subjects?.includes(subjectId)) {
      throw new Error(`Professor "${teacher.name}" não leciona a disciplina selecionada`);
    }

    // Verifica se o professor já está associado a esta turma nesta disciplina
    const existingAssignment = classEntity.teachers.find(
      t => t.teacherId === teacherId && t.subjectId === subjectId
    );

    if (existingAssignment) {
      throw new Error(`Professor já está associado a esta turma nesta disciplina`);
    }

    // Adiciona o professor à turma
    const newTeacher: ClassTeacher = {
      teacherId,
      subjectId,
      assignedAt: new Date(),
      isMainTeacher,
    };

    classEntity.teachers.push(newTeacher);

    // Atualiza a lista de turmas do professor
    if (!teacher.classes) {
      teacher.classes = [];
    }
    if (!teacher.classes.includes(classId)) {
      teacher.classes.push(classId);
    }
    this.userRepository.saveUser(teacher);

    // Salva a turma atualizada
    this.classRepository.save(classEntity);

    return classEntity;
  }
}
