// src/repository/implementations/LocalStorageRepository.ts
import { LessonPlan } from '../../core/entities/LessonPlan';
import { Subject } from '../../core/entities/Subject';
import { Unit } from '../../core/entities/Unit';
import { ILessonRepository } from '../../core/repositories/ILessonRepository';
import { StorageKeys } from '../../core/constants/StorageKeys';
import { parseJSONWithDates } from '../../utils/dateUtils';

export class LocalStorageRepository implements ILessonRepository {
  private static instance: LocalStorageRepository;

  // O construtor privado impede que outras classes criem novas instâncias (Singleton)
  private constructor() { }

  public static getInstance(): LocalStorageRepository {
    if (!LocalStorageRepository.instance) {
      LocalStorageRepository.instance = new LocalStorageRepository();
    }
    return LocalStorageRepository.instance;
  }

  // Métodos de Disciplinas
  saveSubject(subject: Subject): void {
    const subjects = this.getAllSubjects();
    const index = subjects.findIndex(s => s.id === subject.id);
    index >= 0 ? (subjects[index] = subject) : subjects.push(subject);
    localStorage.setItem(StorageKeys.SUBJECTS, JSON.stringify(subjects));
  }

  getAllSubjects(): Subject[] {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(StorageKeys.SUBJECTS);
    return parseJSONWithDates<Subject>(data);
  }

  deleteSubject(id: string): void {
    const subjects = this.getAllSubjects().filter(s => s.id !== id);
    localStorage.setItem(StorageKeys.SUBJECTS, JSON.stringify(subjects));
  }

  // Métodos de Planos de Aula
  saveLessonPlan(plan: LessonPlan): void {
    const plans = this.getAllLessonPlans();
    const index = plans.findIndex(p => p.id === plan.id);
    index >= 0 ? (plans[index] = plan) : plans.push(plan);
    localStorage.setItem(StorageKeys.LESSON_PLANS, JSON.stringify(plans));
  }

  getAllLessonPlans(): LessonPlan[] {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(StorageKeys.LESSON_PLANS);
    return parseJSONWithDates<LessonPlan>(data);
  }

  getLessonPlanById(id: string): LessonPlan | undefined {
    return this.getAllLessonPlans().find(p => p.id === id);
  }

  // Métodos de Unidades
  saveUnit(unit: Unit): void {
    const units = this.getAllUnits();
    const index = units.findIndex(u => u.id === unit.id);
    if (index >= 0) {
      units[index] = { ...unit, updatedAt: new Date() };
    } else {
      units.push(unit);
    }
    localStorage.setItem(StorageKeys.UNITS, JSON.stringify(units));
  }

  getAllUnits(): Unit[] {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(StorageKeys.UNITS);
    return parseJSONWithDates<Unit>(data);
  }

  getUnitById(id: string): Unit | undefined {
    return this.getAllUnits().find(u => u.id === id);
  }

  getUnitsBySubjectId(subjectId: string): Unit[] {
    return this.getAllUnits().filter(u => u.subjectId === subjectId);
  }

  deleteUnit(id: string): void {
    const units = this.getAllUnits().filter(u => u.id !== id);
    localStorage.setItem(StorageKeys.UNITS, JSON.stringify(units));
  }
}