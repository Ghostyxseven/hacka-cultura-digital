// src/core/repositories/IStudentActivityRepository.ts
import { StudentActivity } from "../entities/StudentActivity";

export interface IStudentActivityRepository {
    save(activity: StudentActivity): void;
    getById(id: string): StudentActivity | undefined;
    getByStudentId(studentId: string): StudentActivity[];
    getByLessonPlanId(lessonPlanId: string): StudentActivity[];
    getByStudentAndLessonPlan(studentId: string, lessonPlanId: string): StudentActivity | undefined;
    listAll(): StudentActivity[];
}
