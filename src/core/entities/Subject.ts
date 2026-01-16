// src/core/entities/Subject.ts
import { SchoolYear } from "./LessonPlan";

export interface Subject {
    id: string;
    name: string;             // Ex: Matemática, História, Cultura Digital
    description?: string;      // Breve descrição da disciplina
    color?: string;           // Para usar no CSS/Tailwind (ex: 'blue-500')
    icon?: string;            // Nome do ícone (ex: 'book', 'monitor')
    gradeYears?: SchoolYear[]; // Séries/anos associados à disciplina (RF01)
    createdAt: Date;
  }