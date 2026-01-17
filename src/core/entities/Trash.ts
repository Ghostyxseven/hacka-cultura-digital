/**
 * Entidade de Domínio: Lixeira (Trash)
 * 
 * Representa um item na lixeira antes da exclusão definitiva.
 * Permite recuperação de itens deletados por um período.
 * 
 * Clean Architecture: Core Layer - Entidade de Domínio
 */

export type TrashEntityType = 'subject' | 'unit' | 'lessonPlan' | 'activity';

export interface TrashItem {
  /** Identificador único do item na lixeira */
  id: string;
  /** Tipo de entidade deletada */
  entityType: TrashEntityType;
  /** ID original da entidade */
  originalId: string;
  /** Dados completos da entidade antes da exclusão */
  entityData: any;
  /** Data de exclusão no formato ISO 8601 */
  deletedAt: string;
  /** Data de expiração (após esta data, pode ser deletado permanentemente) */
  expiresAt: string;
  /** ID do usuário que deletou (opcional para futuro) */
  deletedBy?: string;
}

/**
 * Tempo de retenção na lixeira (30 dias)
 */
export const TRASH_RETENTION_DAYS = 30;

/**
 * Cria um novo item na lixeira
 */
export function createTrashItem(data: Omit<TrashItem, 'id' | 'deletedAt' | 'expiresAt'>): TrashItem {
  const deletedAt = new Date().toISOString();
  const expiresAt = new Date(Date.now() + TRASH_RETENTION_DAYS * 24 * 60 * 60 * 1000).toISOString();

  return {
    id: `trash_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    entityType: data.entityType,
    originalId: data.originalId,
    entityData: data.entityData,
    deletedAt,
    expiresAt,
    deletedBy: data.deletedBy,
  };
}

/**
 * Verifica se um item da lixeira expirou
 */
export function isTrashItemExpired(item: TrashItem): boolean {
  return new Date(item.expiresAt) < new Date();
}

/**
 * Valida um item da lixeira
 */
export function validateTrashItem(item: Partial<TrashItem>): boolean {
  if (!item.entityType || !item.originalId || !item.entityData) {
    return false;
  }

  const validEntityTypes = ['subject', 'unit', 'lessonPlan', 'activity'];
  if (!validEntityTypes.includes(item.entityType)) {
    return false;
  }

  return true;
}
