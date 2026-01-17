import type { TrashItem, TrashEntityType } from '@/core/entities/Trash';

/**
 * Interface do repositório de lixeira
 */
export interface ITrashRepository {
  /** Busca todos os itens da lixeira */
  findAll(): Promise<TrashItem[]>;
  /** Busca itens por tipo de entidade */
  findByEntityType(entityType: TrashEntityType): Promise<TrashItem[]>;
  /** Busca um item por ID original */
  findByOriginalId(originalId: string, entityType: TrashEntityType): Promise<TrashItem | null>;
  /** Busca um item por ID da lixeira */
  findById(id: string): Promise<TrashItem | null>;
  /** Adiciona item à lixeira */
  create(item: Omit<TrashItem, 'id' | 'deletedAt' | 'expiresAt'>): Promise<TrashItem>;
  /** Restaura item da lixeira (remove da lixeira) */
  restore(id: string): Promise<TrashItem>;
  /** Remove item da lixeira permanentemente */
  deletePermanently(id: string): Promise<void>;
  /** Limpa itens expirados */
  cleanExpired(): Promise<number>;
}
