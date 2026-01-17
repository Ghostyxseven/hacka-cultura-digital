/**
 * Implementação LocalStorage do repositório de logs de auditoria
 * 
 * Armazena logs de ações importantes do sistema
 */

import { AuditLog, createAuditLog, validateAuditLog } from '@/core/entities/AuditLog';
import { IAuditLogRepository } from '../interfaces/IAuditLogRepository';

// Classes de erro locais (compatibilidade com outros repositórios)
class RepositoryError extends Error {
  constructor(message: string, public code: string) {
    super(message);
    this.name = 'RepositoryError';
  }
}

class StorageError extends RepositoryError {
  constructor(message: string) {
    super(message, 'STORAGE_ERROR');
    this.name = 'StorageError';
  }
}

const STORAGE_KEY = 'auditLogs';
const MAX_LOGS = 1000; // Limite máximo de logs (previne crescimento infinito)

export class LocalStorageAuditLogRepository implements IAuditLogRepository {
  private getStorageKey(): string {
    return STORAGE_KEY;
  }

  private async getAllFromStorage(): Promise<AuditLog[]> {
    if (typeof window === 'undefined') {
      return [];
    }

    try {
      const data = localStorage.getItem(this.getStorageKey());
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Erro ao ler logs de auditoria do localStorage:', error);
      return [];
    }
  }

  private async saveToStorage(logs: AuditLog[]): Promise<void> {
    if (typeof window === 'undefined') {
      return;
    }

    try {
      // Mantém apenas os N logs mais recentes
      const sortedLogs = logs.sort((a, b) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
      const limitedLogs = sortedLogs.slice(0, MAX_LOGS);

      localStorage.setItem(this.getStorageKey(), JSON.stringify(limitedLogs));
    } catch (error) {
      console.error('Erro ao salvar logs de auditoria no localStorage:', error);
      throw new StorageError('Falha ao salvar log de auditoria');
    }
  }

  async findAll(): Promise<AuditLog[]> {
    return this.getAllFromStorage();
  }

  async findByAction(action: AuditLog['action']): Promise<AuditLog[]> {
    const logs = await this.getAllFromStorage();
    return logs.filter((log) => log.action === action);
  }

  async findByEntityType(entityType: AuditLog['entityType']): Promise<AuditLog[]> {
    const logs = await this.getAllFromStorage();
    return logs.filter((log) => log.entityType === entityType);
  }

  async findByEntityId(entityId: string): Promise<AuditLog[]> {
    const logs = await this.getAllFromStorage();
    return logs.filter((log) => log.entityId === entityId);
  }

  async create(logData: Omit<AuditLog, 'id' | 'timestamp'>): Promise<AuditLog> {
    if (!validateAuditLog(logData)) {
      throw new RepositoryError('Dados do log de auditoria inválidos', 'VALIDATION_ERROR');
    }

    try {
      const log = createAuditLog(logData);
      const logs = await this.getAllFromStorage();
      logs.push(log);
      await this.saveToStorage(logs);
      return log;
    } catch (error) {
      if (error instanceof RepositoryError) {
        throw error;
      }
      throw new StorageError(`Erro ao criar log de auditoria: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    }
  }

  async deleteOlderThan(days: number): Promise<number> {
    const logs = await this.getAllFromStorage();
    const cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    
    const filteredLogs = logs.filter((log) => new Date(log.timestamp) >= cutoffDate);
    const deletedCount = logs.length - filteredLogs.length;

    if (deletedCount > 0) {
      await this.saveToStorage(filteredLogs);
    }

    return deletedCount;
  }
}
