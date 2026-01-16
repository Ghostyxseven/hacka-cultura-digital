// src/application/mappers/PresentationMapper.ts
// Mapper para converter entidades do Core em ViewModels da camada de apresentação
// Isso garante que a camada Presentation não conheça as entidades do Core

import { Subject } from '../../core/entities/Subject';
import { Unit } from '../../core/entities/Unit';
import { LessonPlan, QuizQuestion } from '../../core/entities/LessonPlan';
import {
  SubjectViewModel,
  UnitViewModel,
  LessonPlanViewModel,
  QuizQuestionViewModel,
} from '../viewmodels';

/**
 * Mapper para converter entidades do Core em ViewModels da Presentation
 */
export class PresentationMapper {
  /**
   * Converte Subject (Core) em SubjectViewModel (Presentation)
   */
  static toSubjectViewModel(subject: Subject): SubjectViewModel {
    return {
      id: subject.id,
      name: subject.name,
      description: subject.description,
      color: subject.color,
      icon: subject.icon,
      gradeYears: subject.gradeYears,
      createdAt: subject.createdAt,
    };
  }

  /**
   * Converte array de Subjects em array de SubjectViewModels
   */
  static toSubjectViewModels(subjects: Subject[]): SubjectViewModel[] {
    return subjects.map(subject => this.toSubjectViewModel(subject));
  }

  /**
   * Converte Unit (Core) em UnitViewModel (Presentation)
   */
  static toUnitViewModel(unit: Unit): UnitViewModel {
    return {
      id: unit.id,
      subjectId: unit.subjectId,
      gradeYear: unit.gradeYear,
      topic: unit.topic,
      description: unit.description,
      lessonPlanId: unit.lessonPlanId,
      activityId: unit.activityId,
      isSuggestedByAI: unit.isSuggestedByAI,
      createdAt: unit.createdAt,
      updatedAt: unit.updatedAt,
    };
  }

  /**
   * Converte array de Units em array de UnitViewModels
   */
  static toUnitViewModels(units: Unit[]): UnitViewModel[] {
    return units.map(unit => this.toUnitViewModel(unit));
  }

  /**
   * Converte QuizQuestion (Core) em QuizQuestionViewModel (Presentation)
   */
  static toQuizQuestionViewModel(question: QuizQuestion): QuizQuestionViewModel {
    return {
      id: question.id,
      question: question.question,
      options: question.options,
      correctAnswer: question.correctAnswer,
      justification: question.justification,
    };
  }

  /**
   * Converte array de QuizQuestions em array de QuizQuestionViewModels
   */
  static toQuizQuestionViewModels(questions: QuizQuestion[]): QuizQuestionViewModel[] {
    return questions.map(question => this.toQuizQuestionViewModel(question));
  }

  /**
   * Converte LessonPlan (Core) em LessonPlanViewModel (Presentation)
   */
  static toLessonPlanViewModel(lessonPlan: LessonPlan): LessonPlanViewModel {
    return {
      id: lessonPlan.id,
      title: lessonPlan.title,
      subject: lessonPlan.subject,
      gradeYear: lessonPlan.gradeYear,
      unitId: lessonPlan.unitId,
      objectives: lessonPlan.objectives,
      methodology: lessonPlan.methodology,
      duration: lessonPlan.duration,
      bnccCompetencies: lessonPlan.bnccCompetencies,
      content: lessonPlan.content,
      quiz: this.toQuizQuestionViewModels(lessonPlan.quiz),
      supportMaterials: lessonPlan.supportMaterials,
      teacherNote: lessonPlan.teacherNote,
      metadata: {
        aiModel: lessonPlan.metadata.aiModel,
        promptVersion: lessonPlan.metadata.promptVersion,
        isFavorite: lessonPlan.metadata.isFavorite,
      },
      createdAt: lessonPlan.createdAt,
    };
  }

  /**
   * Converte array de LessonPlans em array de LessonPlanViewModels
   */
  static toLessonPlanViewModels(lessonPlans: LessonPlan[]): LessonPlanViewModel[] {
    return lessonPlans.map(plan => this.toLessonPlanViewModel(plan));
  }
}
