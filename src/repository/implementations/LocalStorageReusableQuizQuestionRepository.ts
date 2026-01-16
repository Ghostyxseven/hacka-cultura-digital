// src/repository/implementations/LocalStorageReusableQuizQuestionRepository.ts
import { ReusableQuizQuestion } from '@/core/entities/ReusableQuizQuestion';
import { IReusableQuizQuestionRepository } from '@/core/repositories/IReusableQuizQuestionRepository';
import { StorageKeys } from '@/core/constants/StorageKeys';
import { parseJSONWithDates } from '@/utils/dateUtils';

/**
 * Implementação do repositório de questões reutilizáveis usando LocalStorage
 */
export class LocalStorageReusableQuizQuestionRepository implements IReusableQuizQuestionRepository {
    private static instance: LocalStorageReusableQuizQuestionRepository;

    private constructor() { }

    public static getInstance(): LocalStorageReusableQuizQuestionRepository {
        if (!LocalStorageReusableQuizQuestionRepository.instance) {
            LocalStorageReusableQuizQuestionRepository.instance = new LocalStorageReusableQuizQuestionRepository();
        }
        return LocalStorageReusableQuizQuestionRepository.instance;
    }

    save(question: ReusableQuizQuestion): void {
        const questions = this.getAll();
        const index = questions.findIndex(q => q.id === question.id);

        if (index >= 0) {
            questions[index] = { ...question, updatedAt: new Date() };
        } else {
            questions.push(question);
        }

        localStorage.setItem(StorageKeys.REUSABLE_QUIZ_QUESTIONS, JSON.stringify(questions));
    }

    getAll(): ReusableQuizQuestion[] {
        if (typeof window === 'undefined') return [];
        const data = localStorage.getItem(StorageKeys.REUSABLE_QUIZ_QUESTIONS);
        return parseJSONWithDates<ReusableQuizQuestion>(data);
    }

    getById(id: string): ReusableQuizQuestion | undefined {
        return this.getAll().find(q => q.id === id);
    }

    findByFilters(filters: {
        subject?: string;
        gradeYear?: string;
        difficulty?: 'facil' | 'medio' | 'dificil';
        tags?: string[];
        createdBy?: string;
    }): ReusableQuizQuestion[] {
        let questions = this.getAll();

        if (filters.subject) {
            questions = questions.filter(q => q.subject === filters.subject);
        }

        if (filters.gradeYear) {
            questions = questions.filter(q => q.gradeYear === filters.gradeYear);
        }

        if (filters.difficulty) {
            questions = questions.filter(q => q.difficulty === filters.difficulty);
        }

        if (filters.tags && filters.tags.length > 0) {
            questions = questions.filter(q =>
                filters.tags!.some(tag => q.tags.includes(tag))
            );
        }

        if (filters.createdBy) {
            questions = questions.filter(q => q.createdBy === filters.createdBy);
        }

        return questions;
    }

    findByTags(tags: string[]): ReusableQuizQuestion[] {
        return this.getAll().filter(q =>
            tags.some(tag => q.tags.includes(tag))
        );
    }

    delete(id: string): void {
        const questions = this.getAll().filter(q => q.id !== id);
        localStorage.setItem(StorageKeys.REUSABLE_QUIZ_QUESTIONS, JSON.stringify(questions));
    }

    incrementUsage(id: string): void {
        const question = this.getById(id);
        if (question) {
            question.usageCount += 1;
            question.lastUsedAt = new Date();
            this.save(question);
        }
    }
}
