import { Class, ClassTeacher } from "../../core/entities/Class";
import { SchoolYear } from "../../core/entities/LessonPlan";
import { User } from "../../core/entities/User";
import { CreateClassUseCase } from "../usecases/CreateClassUseCase";
import { GetClassesUseCase } from "../usecases/GetClassesUseCase";
import { GetClassByIdUseCase } from "../usecases/GetClassByIdUseCase";
import { AssignTeacherToClassUseCase } from "../usecases/AssignTeacherToClassUseCase";
import { AssignStudentToClassUseCase } from "../usecases/AssignStudentToClassUseCase";
import { RemoveTeacherFromClassUseCase } from "../usecases/RemoveTeacherFromClassUseCase";
import { RemoveStudentFromClassUseCase } from "../usecases/RemoveStudentFromClassUseCase";
import { DeleteClassUseCase } from "../usecases/DeleteClassUseCase";
import { GetClassTeachersUseCase, ClassTeacherInfo } from "../usecases/GetClassTeachersUseCase";
import { GetClassStudentsUseCase } from "../usecases/GetClassStudentsUseCase";
import { GetTeacherClassesUseCase } from "../usecases/GetTeacherClassesUseCase";

/**
 * Serviço de Turmas
 * Centraliza as operações relacionadas a gestão de turmas, professores e alunos.
 */
export class ClassService {
    constructor(
        private createClassUseCase: CreateClassUseCase,
        private getClassesUseCase: GetClassesUseCase,
        private getClassByIdUseCase: GetClassByIdUseCase,
        private assignTeacherToClassUseCase: AssignTeacherToClassUseCase,
        private assignStudentToClassUseCase: AssignStudentToClassUseCase,
        private removeTeacherFromClassUseCase: RemoveTeacherFromClassUseCase,
        private removeStudentFromClassUseCase: RemoveStudentFromClassUseCase,
        private deleteClassUseCase: DeleteClassUseCase,
        private getClassTeachersUseCase: GetClassTeachersUseCase,
        private getClassStudentsUseCase: GetClassStudentsUseCase,
        private getTeacherClassesUseCase: GetTeacherClassesUseCase
    ) { }

    async createClass(name: string, gradeYear: SchoolYear, schoolYear: string): Promise<Class> {
        return this.createClassUseCase.execute(name, gradeYear, schoolYear);
    }

    getClasses(filter?: { gradeYear?: SchoolYear; schoolYear?: string }): Class[] {
        return this.getClassesUseCase.execute(filter?.gradeYear, filter?.schoolYear);
    }

    getClassById(id: string): Class | undefined {
        return this.getClassByIdUseCase.execute(id);
    }

    async assignTeacher(classId: string, teacherId: string, subjectId: string): Promise<Class> {
        return this.assignTeacherToClassUseCase.execute(classId, teacherId, subjectId);
    }

    async assignStudent(classId: string, studentId: string): Promise<Class> {
        return this.assignStudentToClassUseCase.execute(classId, studentId);
    }

    async removeTeacher(classId: string, teacherId: string, subjectId: string): Promise<Class> {
        return this.removeTeacherFromClassUseCase.execute(classId, teacherId, subjectId);
    }

    async removeStudent(classId: string, studentId: string): Promise<Class> {
        return this.removeStudentFromClassUseCase.execute(classId, studentId);
    }

    deleteClass(id: string): void {
        this.deleteClassUseCase.execute(id);
    }

    getClassTeachers(classId: string): ClassTeacherInfo[] {
        return this.getClassTeachersUseCase.execute(classId);
    }

    getClassStudents(classId: string): User[] {
        return this.getClassStudentsUseCase.execute(classId);
    }

    getTeacherClasses(teacherId: string, subjectId?: string): Class[] {
        return this.getTeacherClassesUseCase.execute(teacherId, subjectId);
    }
}
