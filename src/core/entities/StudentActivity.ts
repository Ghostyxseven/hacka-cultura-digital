// src/core/entities/StudentActivity.ts

export type ActivityStatus = 'pending' | 'completed';

export interface StudentAnswer {
    questionId: string;
    selectedOption: number; // Índice da opção selecionada (0 a 3)
}

export interface StudentActivity {
    id: string;
    studentId: string;
    lessonPlanId: string;
    answers: StudentAnswer[];
    score: number;           // Percentual de acerto (0 a 100)
    correctCount: number;    // Quantidade de questões corretas
    totalQuestions: number;  // Total de questões no quiz
    aiFeedback?: string;     // Comentário gerado pela IA (Fase 2)
    teacherComments?: string;// Comentários do professor
    status: ActivityStatus;
    startedAt: Date;
    completedAt?: Date;
}
