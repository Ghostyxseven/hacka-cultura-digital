// src/core/entities/StudentProfile.ts
export interface StudentProfile {
    userId: string;
    xp: number;
    level: number;
    badges: string[]; // IDs das badges conquistadas
    updatedAt: Date;
}
