// src/core/entities/Class.ts
import { SchoolYear } from './LessonPlan';

/**
 * Representa um professor associado a uma turma por disciplina
 */
export interface ClassTeacher {
  teacherId: string;
  subjectId: string;
  assignedAt: Date;
  isMainTeacher?: boolean; // Coordenador da turma
}

/**
 * Entidade que representa uma turma escolar
 * Cada turma pertence a uma série/ano e contém alunos e professores
 */
export interface Class {
  id: string;
  name: string; // "6º Ano A", "9º Ano B", "1º Ano EM A"
  gradeYear: SchoolYear; // 6º Ano, 7º Ano, etc.
  schoolYear: string; // "2024", "2025"
  students: string[]; // IDs dos alunos
  teachers: ClassTeacher[]; // Professores por disciplina
  createdAt: Date;
  updatedAt?: Date;
}
