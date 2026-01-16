// src/core/repositories/ILessonRepository.ts
import { LessonPlan } from '../entities/LessonPlan';
import { Subject } from '../entities/Subject';
import { Unit } from '../entities/Unit';

export interface ILessonRepository {
  saveSubject(subject: Subject): void;
  getAllSubjects(): Subject[];
  deleteSubject(id: string): void;

  saveLessonPlan(plan: LessonPlan): void;
  getAllLessonPlans(): LessonPlan[];
  getLessonPlanById(id: string): LessonPlan | undefined;

  saveUnit(unit: Unit): void;
  getAllUnits(): Unit[];
  getUnitById(id: string): Unit | undefined;
  getUnitsBySubjectId(subjectId: string): Unit[];
  deleteUnit(id: string): void;
}