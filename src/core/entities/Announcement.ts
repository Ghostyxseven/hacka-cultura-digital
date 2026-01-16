// src/core/entities/Announcement.ts

export interface Announcement {
    id: string;
    professorId: string;
    subjectId?: string; // Opcional: aviso para uma disciplina específica
    title: string;
    content: string;
    createdAt: Date;
}
