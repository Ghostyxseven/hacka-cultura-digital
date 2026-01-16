// src/repository/implementations/LocalStorageClassRepository.ts
import { Class } from '../../core/entities/Class';
import { IClassRepository } from '../../core/repositories/IClassRepository';
import { StorageKeys } from '../../core/constants/StorageKeys';
import { parseJSONWithDates } from '../../utils/dateUtils';
import { SchoolYear } from '../../core/entities/LessonPlan';

/**
 * Implementação do repositório de turmas usando LocalStorage
 * Segue o padrão Singleton
 * Clean Architecture - Repository layer
 */
export class LocalStorageClassRepository implements IClassRepository {
  private static instance: LocalStorageClassRepository;

  private constructor() { }

  public static getInstance(): LocalStorageClassRepository {
    if (!LocalStorageClassRepository.instance) {
      LocalStorageClassRepository.instance = new LocalStorageClassRepository();
    }
    return LocalStorageClassRepository.instance;
  }

  save(classEntity: Class): void {
    const classes = this.getAll();
    const index = classes.findIndex(c => c.id === classEntity.id);
    
    if (index >= 0) {
      classes[index] = { ...classEntity, updatedAt: new Date() };
    } else {
      classes.push(classEntity);
    }
    
    localStorage.setItem(StorageKeys.CLASSES, JSON.stringify(classes));
  }

  getById(id: string): Class | undefined {
    return this.getAll().find(c => c.id === id);
  }

  getAll(): Class[] {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(StorageKeys.CLASSES);
    return parseJSONWithDates<Class>(data);
  }

  getByGradeYear(gradeYear: SchoolYear): Class[] {
    return this.getAll().filter(c => c.gradeYear === gradeYear);
  }

  getBySchoolYear(schoolYear: string): Class[] {
    return this.getAll().filter(c => c.schoolYear === schoolYear);
  }

  getByTeacherId(teacherId: string): Class[] {
    return this.getAll().filter(c => 
      c.teachers.some(t => t.teacherId === teacherId)
    );
  }

  getByStudentId(studentId: string): Class | undefined {
    return this.getAll().find(c => c.students.includes(studentId));
  }

  delete(id: string): void {
    const classes = this.getAll().filter(c => c.id !== id);
    localStorage.setItem(StorageKeys.CLASSES, JSON.stringify(classes));
  }
}
