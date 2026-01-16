// src/lib/auditService.ts
import { AuditService } from '../application/services/AuditService';
import { LocalStorageAuditLogRepository } from '../repository/implementations/LocalStorageAuditLogRepository';
import { LocalStorageUserRepository } from '../repository/implementations/LocalStorageUserRepository';

let auditServiceInstance: AuditService | null = null;

/**
 * Obtém instância singleton do AuditService
 */
export function getAuditService(): AuditService {
    if (!auditServiceInstance) {
        const auditRepository = LocalStorageAuditLogRepository.getInstance();
        const userRepository = LocalStorageUserRepository.getInstance();
        auditServiceInstance = new AuditService(auditRepository, userRepository);
    }
    return auditServiceInstance;
}
