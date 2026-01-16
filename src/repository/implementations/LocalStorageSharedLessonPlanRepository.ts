// src/repository/implementations/LocalStorageSharedLessonPlanRepository.ts
import { SharedLessonPlan } from '@/core/entities/SharedLessonPlan';
import { ISharedLessonPlanRepository } from '@/core/repositories/ISharedLessonPlanRepository';
import { StorageKeys } from '@/core/constants/StorageKeys';
import { parseJSONWithDates } from '@/utils/dateUtils';

/**
 * Implementação do repositório de planos compartilhados usando LocalStorage
 */
export class LocalStorageSharedLessonPlanRepository implements ISharedLessonPlanRepository {
    private static instance: LocalStorageSharedLessonPlanRepository;

    private constructor() { }

    public static getInstance(): LocalStorageSharedLessonPlanRepository {
        if (!LocalStorageSharedLessonPlanRepository.instance) {
            LocalStorageSharedLessonPlanRepository.instance = new LocalStorageSharedLessonPlanRepository();
        }
        return LocalStorageSharedLessonPlanRepository.instance;
    }

    save(sharedPlan: SharedLessonPlan): void {
        const plans = this.getAll();
        const index = plans.findIndex(p => p.id === sharedPlan.id);

        if (index >= 0) {
            plans[index] = sharedPlan;
        } else {
            plans.push(sharedPlan);
        }

        localStorage.setItem(StorageKeys.SHARED_LESSON_PLANS, JSON.stringify(plans));
    }

    getAll(): SharedLessonPlan[] {
        if (typeof window === 'undefined') return [];
        const data = localStorage.getItem(StorageKeys.SHARED_LESSON_PLANS);
        return parseJSONWithDates<SharedLessonPlan>(data);
    }

    getById(id: string): SharedLessonPlan | undefined {
        return this.getAll().find(p => p.id === id);
    }

    getPublicPlans(): SharedLessonPlan[] {
        return this.getAll().filter(p => p.visibility === 'public');
    }

    getByProfessor(professorId: string): SharedLessonPlan[] {
        return this.getAll().filter(p => p.sharedBy === professorId);
    }

    findByFilters(filters: {
        tags?: string[];
        subject?: string;
        gradeYear?: string;
        sharedBy?: string;
    }): SharedLessonPlan[] {
        let plans = this.getAll();

        if (filters.tags && filters.tags.length > 0) {
            plans = plans.filter(p =>
                filters.tags!.some(tag => p.tags.includes(tag))
            );
        }

        if (filters.subject) {
            plans = plans.filter(p => p.originalPlan.subject === filters.subject);
        }

        if (filters.gradeYear) {
            plans = plans.filter(p => p.originalPlan.gradeYear === filters.gradeYear);
        }

        if (filters.sharedBy) {
            plans = plans.filter(p => p.sharedBy === filters.sharedBy);
        }

        return plans;
    }

    incrementViewCount(id: string): void {
        const plan = this.getById(id);
        if (plan) {
            plan.viewCount += 1;
            this.save(plan);
        }
    }

    incrementAdaptationCount(id: string): void {
        const plan = this.getById(id);
        if (plan) {
            plan.adaptationCount += 1;
            this.save(plan);
        }
    }

    addAdaptation(id: string, adaptation: SharedLessonPlan['adaptations'][0]): void {
        const plan = this.getById(id);
        if (plan) {
            plan.adaptations.push(adaptation);
            this.save(plan);
        }
    }

    incrementLikes(id: string): void {
        const plan = this.getById(id);
        if (plan) {
            plan.likes += 1;
            this.save(plan);
        }
    }

    delete(id: string): void {
        const plans = this.getAll().filter(p => p.id !== id);
        localStorage.setItem(StorageKeys.SHARED_LESSON_PLANS, JSON.stringify(plans));
    }
}
