// src/repository/ILessonRepository.ts
import { LessonPlan } from '../core/entities/LessonPlan';
import { Subject } from '../core/entities/Subject';

export interface ILessonRepository {
  saveSubject(subject: Subject): void;
  getAllSubjects(): Subject[];
  deleteSubject(id: string): void;
  
  saveLessonPlan(plan: LessonPlan): void;
  getAllLessonPlans(): LessonPlan[];
  getLessonPlanById(id: string): LessonPlan | undefined;
}