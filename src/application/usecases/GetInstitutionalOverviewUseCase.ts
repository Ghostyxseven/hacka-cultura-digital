// src/application/usecases/GetInstitutionalOverviewUseCase.ts
import { InstitutionalOverview, GradeStats, SubjectStats, StudentAtRisk } from '../../core/entities/SchoolPerformance';
import { IQuizRepository } from '../../core/repositories/IQuizRepository';
import { ILessonRepository } from '../../core/repositories/ILessonRepository';
import { IUserRepository } from '../../core/repositories/IUserRepository';

export class GetInstitutionalOverviewUseCase {
    constructor(
        private quizRepository: IQuizRepository,
        private lessonRepository: ILessonRepository,
        private userRepository: IUserRepository
    ) { }

    execute(): InstitutionalOverview {
        const allUsers = this.userRepository.getAllUsers();
        const students = allUsers.filter(u => u.role === 'aluno');
        const teachers = allUsers.filter(u => u.role === 'professor');

        // Pega todos os resultados de quiz do sistema
        // Como o IQuizRepository não tem um getAll, vamos usar um truque ou estender
        // No LocalStorageQuizRepository geralmente salvamos tudo numa lista
        const allQuizzes = students.flatMap(s => this.quizRepository.getQuizResultsByUserId(s.id));

        if (allQuizzes.length === 0) {
            return this.emptyOverview(students.length, teachers.length);
        }

        const averageScore = allQuizzes.reduce((acc: number, q: any) => acc + q.score, 0) / allQuizzes.length;

        // Agrupamento por Grade e Subject
        const performanceByGrade: GradeStats[] = this.calculateGradeStats(allQuizzes);

        // Identificação de Alunos em Risco (Score médio < 60 ou 0 atividades e já tem planos gerados)
        const studentsAtRisk: StudentAtRisk[] = this.identifyStudentsAtRisk(students, teachers);

        return {
            totalStudents: students.length,
            totalTeachers: teachers.length,
            averageScore: Math.round(averageScore),
            totalQuizzesCompleted: allQuizzes.length,
            performanceByGrade,
            studentsAtRisk: studentsAtRisk.slice(0, 5) // Top 5 em risco
        };
    }

    private calculateGradeStats(quizzes: any[]): GradeStats[] {
        const gradesMap = new Map<string, any[]>();

        quizzes.forEach(q => {
            const plan = this.lessonRepository.getLessonPlanById(q.lessonPlanId);
            if (plan) {
                if (!gradesMap.has(plan.gradeYear)) gradesMap.set(plan.gradeYear, []);
                gradesMap.get(plan.gradeYear)?.push({ ...q, subject: plan.subject });
            }
        });

        const stats: GradeStats[] = [];
        gradesMap.forEach((gradeQuizzes, grade) => {
            const subjectMap = new Map<string, any[]>();
            gradeQuizzes.forEach(gq => {
                if (!subjectMap.has(gq.subject)) subjectMap.set(gq.subject, []);
                subjectMap.get(gq.subject)?.push(gq);
            });

            const subjectStats: SubjectStats[] = [];
            subjectMap.forEach((sQuizzes, sName) => {
                subjectStats.push({
                    subjectName: sName,
                    averageScore: Math.round(sQuizzes.reduce((acc, sq) => acc + sq.score, 0) / sQuizzes.length),
                    totalQuizzes: sQuizzes.length,
                    completionRate: 100 // Simplificado para este hackathon
                });
            });

            stats.push({
                gradeYear: grade,
                averageScore: Math.round(gradeQuizzes.reduce((acc, gq) => acc + gq.score, 0) / gradeQuizzes.length),
                subjectStats
            });
        });

        return stats;
    }

    private identifyStudentsAtRisk(students: any[], teachers: any[]): StudentAtRisk[] {
        return students.map(student => {
            const studentQuizzes = this.quizRepository.getQuizResultsByUserId(student.id);
            const professor = teachers.find(t => t.id === student.professorId);

            const avg = studentQuizzes.length > 0
                ? studentQuizzes.reduce((acc, q) => acc + q.score, 0) / studentQuizzes.length
                : 0;

            return {
                studentId: student.id,
                studentName: student.name,
                averageScore: Math.round(avg),
                lastScore: studentQuizzes.length > 0 ? studentQuizzes[studentQuizzes.length - 1].score : 0,
                missingActivities: 0, // Mock
                professorName: professor?.name || 'Não atribuído'
            };
        })
            .filter(s => s.averageScore < 60)
            .sort((a, b) => a.averageScore - b.averageScore);
    }

    private emptyOverview(totalStudents: number, totalTeachers: number): InstitutionalOverview {
        return {
            totalStudents,
            totalTeachers,
            averageScore: 0,
            totalQuizzesCompleted: 0,
            performanceByGrade: [],
            studentsAtRisk: []
        };
    }
}
