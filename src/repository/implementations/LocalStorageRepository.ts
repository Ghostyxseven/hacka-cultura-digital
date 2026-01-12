// src/repository/implementations/LocalStorageRepository.ts
import { LessonPlan } from '../../core/entities/LessonPlan';
import { Subject } from '../../core/entities/Subject';
import { Unit } from '../../core/entities/Unit';
import { ILessonRepository } from '../ILessonRepository';

export class LocalStorageRepository implements ILessonRepository {
  private static instance: LocalStorageRepository;
  private readonly SUBJECTS_KEY = '@hacka-cultura:subjects';
  private readonly LESSON_PLANS_KEY = '@hacka-cultura:lesson-plans';
  private readonly UNITS_KEY = '@hacka-cultura:units';

  // O construtor privado impede que outras classes criem novas instâncias (Singleton)
  private constructor() {}

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
    localStorage.setItem(this.SUBJECTS_KEY, JSON.stringify(subjects));
  }

  getAllSubjects(): Subject[] {
    const data = localStorage.getItem(this.SUBJECTS_KEY);
    if (!data) return [];
    
    const subjects = JSON.parse(data);
    // Converte strings de data de volta para objetos Date
    return subjects.map((subject: any) => ({
      ...subject,
      createdAt: subject.createdAt ? new Date(subject.createdAt) : new Date(),
    }));
  }

  deleteSubject(id: string): void {
    const subjects = this.getAllSubjects().filter(s => s.id !== id);
    localStorage.setItem(this.SUBJECTS_KEY, JSON.stringify(subjects));
  }

  // Métodos de Planos de Aula
  saveLessonPlan(plan: LessonPlan): void {
    const plans = this.getAllLessonPlans();
    const index = plans.findIndex(p => p.id === plan.id);
    index >= 0 ? (plans[index] = plan) : plans.push(plan);
    localStorage.setItem(this.LESSON_PLANS_KEY, JSON.stringify(plans));
  }

  getAllLessonPlans(): LessonPlan[] {
    const data = localStorage.getItem(this.LESSON_PLANS_KEY);
    if (!data) return [];
    
    const plans = JSON.parse(data);
    // Converte strings de data de volta para objetos Date
    return plans.map((plan: any) => ({
      ...plan,
      createdAt: plan.createdAt ? new Date(plan.createdAt) : new Date(),
    }));
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
    localStorage.setItem(this.UNITS_KEY, JSON.stringify(units));
  }

  getAllUnits(): Unit[] {
    const data = localStorage.getItem(this.UNITS_KEY);
    if (!data) return [];
    
    const units = JSON.parse(data);
    // Converte strings de data de volta para objetos Date
    return units.map((unit: any) => ({
      ...unit,
      createdAt: unit.createdAt ? new Date(unit.createdAt) : new Date(),
      updatedAt: unit.updatedAt ? new Date(unit.updatedAt) : undefined,
    }));
  }

  getUnitById(id: string): Unit | undefined {
    return this.getAllUnits().find(u => u.id === id);
  }

  getUnitsBySubjectId(subjectId: string): Unit[] {
    return this.getAllUnits().filter(u => u.subjectId === subjectId);
  }

  deleteUnit(id: string): void {
    const units = this.getAllUnits().filter(u => u.id !== id);
    localStorage.setItem(this.UNITS_KEY, JSON.stringify(units));
  }
}