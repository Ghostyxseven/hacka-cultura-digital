// src/core/repositories/IClassRepository.ts
import { Class } from '../entities/Class';
import { SchoolYear } from '../entities/LessonPlan';

/**
 * Interface do repositório de turmas
 * Segue Clean Architecture - Core/Domain layer (Port)
 */
export interface IClassRepository {
  /**
   * Salva uma turma (cria ou atualiza)
   */
  save(classEntity: Class): void;

  /**
   * Busca uma turma por ID
   */
  getById(id: string): Class | undefined;

  /**
   * Lista todas as turmas
   */
  getAll(): Class[];

  /**
   * Busca turmas por série/ano escolar
   */
  getByGradeYear(gradeYear: SchoolYear): Class[];

  /**
   * Busca turmas por ano letivo
   */
  getBySchoolYear(schoolYear: string): Class[];

  /**
   * Busca turmas de um professor específico
   */
  getByTeacherId(teacherId: string): Class[];

  /**
   * Busca a turma de um aluno específico
   */
  getByStudentId(studentId: string): Class | undefined;

  /**
   * Remove uma turma
   */
  delete(id: string): void;
}
