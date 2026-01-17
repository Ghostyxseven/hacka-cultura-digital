/**
 * Serviço de Aplicação: Gerenciamento de Lixeira (Trash)
 * 
 * Gerencia itens na lixeira antes da exclusão definitiva:
 * - Mover para lixeira ao deletar
 * - Restaurar da lixeira
 * - Exclusão definitiva (após período de retenção)
 * - Limpar itens expirados
 * 
 * Clean Architecture: Application Layer - Serviço de Aplicação
 */

import { TrashItem, TrashEntityType } from '@/core/entities/Trash';
import { ITrashRepository } from '@/repository/interfaces/ITrashRepository';
import { AuditLogService } from './AuditLogService';

export class TrashService {
  constructor(
    private readonly trashRepository: ITrashRepository,
    private readonly auditLogService?: AuditLogService // Opcional para logging
  ) {}

  /**
   * Move uma entidade para a lixeira
   * Ao invés de deletar permanentemente, move para lixeira
   */
  async moveToTrash(
    entityType: TrashEntityType,
    entityId: string,
    entityName: string,
    entityData: any
  ): Promise<TrashItem> {
    // Verifica se já existe na lixeira
    const existing = await this.trashRepository.findByOriginalId(entityId, entityType);
    if (existing) {
      throw new Error(`${entityType} já está na lixeira`);
    }

    // Cria item na lixeira (entityName é armazenado em entityData)
    const trashItem = await this.trashRepository.create({
      entityType,
      originalId: entityId,
      entityData: { ...entityData, entityName }, // Inclui entityName nos dados
    });

    // Log de ação
    if (this.auditLogService) {
      await this.auditLogService.log({
        action: `DELETE_${entityType.toUpperCase()}` as any,
        entityType,
        entityId,
        entityName,
        metadata: { movedToTrash: true, trashItemId: trashItem.id },
      });
    }

    return trashItem;
  }

  /**
   * Restaura um item da lixeira
   * Remove da lixeira (a entidade deve ser restaurada manualmente no repositório)
   */
  async restoreFromTrash(trashItemId: string): Promise<TrashItem> {
    const trashItem = await this.trashRepository.restore(trashItemId);

    // Log de ação
    if (this.auditLogService) {
      const entityName = trashItem.entityData?.name || trashItem.entityData?.title || trashItem.entityType;
      await this.auditLogService.log({
        action: 'RESTORE_FROM_TRASH',
        entityType: trashItem.entityType,
        entityId: trashItem.originalId,
        entityName,
        metadata: { trashItemId: trashItem.id },
      });
    }

    return trashItem;
  }

  /**
   * Remove permanentemente da lixeira
   */
  async deletePermanently(trashItemId: string): Promise<void> {
    const trashItem = await this.trashRepository.findById(trashItemId);
    if (!trashItem) {
      throw new Error('Item da lixeira não encontrado');
    }

    await this.trashRepository.deletePermanently(trashItemId);

    // Log de ação
    if (this.auditLogService) {
      await this.auditLogService.log({
        action: `DELETE_PERMANENT_${trashItem.entityType.toUpperCase()}` as any,
        entityType: trashItem.entityType,
        entityId: trashItem.originalId,
        entityName: trashItem.entityData?.name || trashItem.entityData?.title || trashItem.entityType,
        metadata: { permanentDeletion: true },
      });
    }
  }

  /**
   * Lista todos os itens da lixeira
   */
  async findAll(): Promise<TrashItem[]> {
    return this.trashRepository.findAll();
  }

  /**
   * Lista itens por tipo de entidade
   */
  async findByEntityType(entityType: TrashEntityType): Promise<TrashItem[]> {
    return this.trashRepository.findByEntityType(entityType);
  }

  /**
   * Limpa itens expirados da lixeira
   * Remove itens que ultrapassaram o período de retenção
   */
  async cleanExpired(): Promise<number> {
    return this.trashRepository.cleanExpired();
  }
}
