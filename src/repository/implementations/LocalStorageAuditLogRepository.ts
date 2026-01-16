// src/repository/implementations/LocalStorageAuditLogRepository.ts
import { AuditLog, AuditActionType, AuditSeverity } from '@/core/entities/AuditLog';
import { IAuditLogRepository } from '@/core/repositories/IAuditLogRepository';
import { StorageKeys } from '@/core/constants/StorageKeys';
import { parseJSONWithDates } from '@/utils/dateUtils';

/**
 * Implementação do repositório de logs de auditoria usando LocalStorage
 */
export class LocalStorageAuditLogRepository implements IAuditLogRepository {
    private static instance: LocalStorageAuditLogRepository;

    private constructor() { }

    public static getInstance(): LocalStorageAuditLogRepository {
        if (!LocalStorageAuditLogRepository.instance) {
            LocalStorageAuditLogRepository.instance = new LocalStorageAuditLogRepository();
        }
        return LocalStorageAuditLogRepository.instance;
    }

    save(log: AuditLog): void {
        const logs = this.getAll();
        logs.push(log);
        
        // Mantém apenas os últimos 10.000 logs para não sobrecarregar o localStorage
        const maxLogs = 10000;
        if (logs.length > maxLogs) {
            logs.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
            logs.splice(maxLogs);
        }
        
        localStorage.setItem(StorageKeys.AUDIT_LOGS, JSON.stringify(logs));
    }

    getAll(): AuditLog[] {
        if (typeof window === 'undefined') return [];
        const data = localStorage.getItem(StorageKeys.AUDIT_LOGS);
        return parseJSONWithDates<AuditLog>(data);
    }

    getById(id: string): AuditLog | undefined {
        return this.getAll().find(log => log.id === id);
    }

    findByAction(action: AuditActionType): AuditLog[] {
        return this.getAll().filter(log => log.action === action);
    }

    findBySeverity(severity: AuditSeverity): AuditLog[] {
        return this.getAll().filter(log => log.severity === severity);
    }

    findByUser(userId: string): AuditLog[] {
        return this.getAll().filter(log => log.userId === userId);
    }

    findByResource(resourceType: string, resourceId: string): AuditLog[] {
        return this.getAll().filter(
            log => log.resourceType === resourceType && log.resourceId === resourceId
        );
    }

    findByDateRange(startDate: Date, endDate: Date): AuditLog[] {
        return this.getAll().filter(log => {
            const logDate = log.timestamp;
            return logDate >= startDate && logDate <= endDate;
        });
    }

    getUnreviewed(): AuditLog[] {
        return this.getAll().filter(log => !log.reviewed);
    }

    markAsReviewed(logId: string, reviewedBy: string, notes?: string): void {
        const logs = this.getAll();
        const log = logs.find(l => l.id === logId);
        
        if (log) {
            log.reviewed = true;
            log.reviewedBy = reviewedBy;
            log.reviewedAt = new Date();
            if (notes) {
                log.notes = notes;
            }
            
            localStorage.setItem(StorageKeys.AUDIT_LOGS, JSON.stringify(logs));
        }
    }

    deleteOldLogs(daysToKeep: number): number {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);
        
        const logs = this.getAll();
        const initialCount = logs.length;
        const filteredLogs = logs.filter(log => log.timestamp >= cutoffDate);
        const deletedCount = initialCount - filteredLogs.length;
        
        localStorage.setItem(StorageKeys.AUDIT_LOGS, JSON.stringify(filteredLogs));
        
        return deletedCount;
    }
}
