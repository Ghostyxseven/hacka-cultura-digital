// src/core/entities/Badge.ts
export type BadgeType = 'quiz_score' | 'participation' | 'speed';

export interface Badge {
    id: string;
    name: string;
    description: string;
    icon: string; // Emoji ou URL
    type: BadgeType;
    criteriaValue: number; // Valor para alcançar a conquista (ex: 100 nota, 5 quizzes)
}
