// src/repository/implementations/LocalStorageAlertRepository.ts
import { Alert } from '@/core/entities/Alert';
import { IAlertRepository } from '@/core/repositories/IAlertRepository';
import { StorageKeys } from '@/core/constants/StorageKeys';
import { parseJSONWithDates } from '@/utils/dateUtils';

/**
 * Implementação do repositório de alertas usando LocalStorage
 */
export class LocalStorageAlertRepository implements IAlertRepository {
    private static instance: LocalStorageAlertRepository;

    private constructor() { }

    public static getInstance(): LocalStorageAlertRepository {
        if (!LocalStorageAlertRepository.instance) {
            LocalStorageAlertRepository.instance = new LocalStorageAlertRepository();
        }
        return LocalStorageAlertRepository.instance;
    }

    save(alert: Alert): void {
        const alerts = this.getAll();
        const index = alerts.findIndex(a => a.id === alert.id);

        if (index >= 0) {
            alerts[index] = { ...alert, updatedAt: new Date() };
        } else {
            alerts.push(alert);
        }

        localStorage.setItem(StorageKeys.ALERTS, JSON.stringify(alerts));
    }

    getAll(): Alert[] {
        if (typeof window === 'undefined') return [];
        const data = localStorage.getItem(StorageKeys.ALERTS);
        return parseJSONWithDates<Alert>(data);
    }

    getById(id: string): Alert | undefined {
        return this.getAll().find(a => a.id === id);
    }

    findByStatus(status: Alert['status']): Alert[] {
        return this.getAll().filter(a => a.status === status);
    }

    findByType(type: Alert['type']): Alert[] {
        return this.getAll().filter(a => a.type === type);
    }

    findBySeverity(severity: Alert['severity']): Alert[] {
        return this.getAll().filter(a => a.severity === severity);
    }

    findByPriority(priority: Alert['priority']): Alert[] {
        return this.getAll().filter(a => a.priority === priority);
    }

    findByStudent(studentId: string): Alert[] {
        return this.getAll().filter(a => a.studentId === studentId);
    }

    getUnresolved(): Alert[] {
        return this.getAll().filter(a => a.status !== 'resolved' && a.status !== 'dismissed');
    }

    getNew(): Alert[] {
        return this.getAll().filter(a => a.status === 'new');
    }

    acknowledge(id: string, userId: string): void {
        const alert = this.getById(id);
        if (alert) {
            alert.status = 'acknowledged';
            alert.acknowledgedBy = userId;
            alert.acknowledgedAt = new Date();
            alert.updatedAt = new Date();
            this.save(alert);
        }
    }

    resolve(id: string): void {
        const alert = this.getById(id);
        if (alert) {
            alert.status = 'resolved';
            alert.resolvedAt = new Date();
            alert.updatedAt = new Date();
            this.save(alert);
        }
    }

    dismiss(id: string): void {
        const alert = this.getById(id);
        if (alert) {
            alert.status = 'dismissed';
            alert.updatedAt = new Date();
            this.save(alert);
        }
    }

    delete(id: string): void {
        const alerts = this.getAll().filter(a => a.id !== id);
        localStorage.setItem(StorageKeys.ALERTS, JSON.stringify(alerts));
    }
}
