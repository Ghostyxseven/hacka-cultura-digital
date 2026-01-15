// src/repository/implementations/LocalStorageStudentActivityRepository.ts
import { StudentActivity } from '../../core/entities/StudentActivity';
import { IStudentActivityRepository } from '../../core/repositories/IStudentActivityRepository';
import { StorageKeys } from '../../core/constants/StorageKeys';
import { parseJSONWithDates } from '../../utils/dateUtils';

/**
 * Implementação do repositório de atividades do aluno usando LocalStorage.
 * Segue o padrão Singleton.
 */
export class LocalStorageStudentActivityRepository implements IStudentActivityRepository {
    private static instance: LocalStorageStudentActivityRepository;

    private constructor() { }

    public static getInstance(): LocalStorageStudentActivityRepository {
        if (!LocalStorageStudentActivityRepository.instance) {
            LocalStorageStudentActivityRepository.instance = new LocalStorageStudentActivityRepository();
        }
        return LocalStorageStudentActivityRepository.instance;
    }

    save(activity: StudentActivity): void {
        const activities = this.listAll();
        const index = activities.findIndex(a => a.id === activity.id);

        if (index >= 0) {
            activities[index] = { ...activity };
        } else {
            activities.push(activity);
        }

        localStorage.setItem(StorageKeys.STUDENT_ACTIVITIES, JSON.stringify(activities));
    }

    getById(id: string): StudentActivity | undefined {
        return this.listAll().find(a => a.id === id);
    }

    getByStudentId(studentId: string): StudentActivity[] {
        return this.listAll().filter(a => a.studentId === studentId);
    }

    getByLessonPlanId(lessonPlanId: string): StudentActivity[] {
        return this.listAll().filter(a => a.lessonPlanId === lessonPlanId);
    }

    getByStudentAndLessonPlan(studentId: string, lessonPlanId: string): StudentActivity | undefined {
        return this.listAll().find(a => a.studentId === studentId && a.lessonPlanId === lessonPlanId);
    }

    listAll(): StudentActivity[] {
        if (typeof window === 'undefined') return [];
        const data = localStorage.getItem(StorageKeys.STUDENT_ACTIVITIES);
        return parseJSONWithDates<StudentActivity>(data);
    }
}
