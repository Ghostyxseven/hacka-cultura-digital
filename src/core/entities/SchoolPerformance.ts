// src/core/entities/SchoolPerformance.ts

export interface SubjectStats {
    subjectName: string;
    averageScore: number;
    totalQuizzes: number;
    completionRate: number; // % de alunos que fizeram os quizzes
}

export interface GradeStats {
    gradeYear: string;
    averageScore: number;
    subjectStats: SubjectStats[];
}

export interface StudentAtRisk {
    studentId: string;
    studentName: string;
    averageScore: number;
    lastScore: number;
    missingActivities: number;
    professorName: string;
}

export interface InstitutionalOverview {
    totalStudents: number;
    totalTeachers: number;
    averageScore: number;
    totalQuizzesCompleted: number;
    performanceByGrade: GradeStats[];
    studentsAtRisk: StudentAtRisk[];
}
