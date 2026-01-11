// src/repository/implementations/LocalStorageRepository.ts
import { LessonPlan } from '../../core/entities/LessonPlan';
import { Subject } from '../../core/entities/Subject';
import { ILessonRepository } from '../ILessonRepository';

export class LocalStorageRepository implements ILessonRepository {
  private static instance: LocalStorageRepository;
  private readonly SUBJECTS_KEY = '@hacka-cultura:subjects';
  private readonly LESSON_PLANS_KEY = '@hacka-cultura:lesson-plans';

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
    return data ? JSON.parse(data) : [];
  }

  deleteSubject(id: string): void {
    const subjects = this.getAllSubjects().filter(s => s.id !== id);
    localStorage.setItem(this.SUBJECTS_KEY, JSON.stringify(subjects));
  }

  // Métodos de Planos de Aula
  saveLessonPlan(plan: LessonPlan): void {
    const plans = this.getAllLessonPlans();
    plans.push(plan);
    localStorage.setItem(this.LESSON_PLANS_KEY, JSON.stringify(plans));
  }

  getAllLessonPlans(): LessonPlan[] {
    const data = localStorage.getItem(this.LESSON_PLANS_KEY);
    return data ? JSON.parse(data) : [];
  }

  getLessonPlanById(id: string): LessonPlan | undefined {
    return this.getAllLessonPlans().find(p => p.id === id);
  }
}