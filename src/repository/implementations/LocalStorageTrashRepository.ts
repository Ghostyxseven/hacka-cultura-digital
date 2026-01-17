/**
 * Implementação LocalStorage do repositório de lixeira
 * 
 * Armazena itens deletados temporariamente antes da exclusão definitiva
 */

import { TrashItem, createTrashItem, validateTrashItem, isTrashItemExpired } from '@/core/entities/Trash';
import { ITrashRepository } from '../interfaces/ITrashRepository';
import { RepositoryError, StorageError } from './RepositoryErrors';

const STORAGE_KEY = 'trash';

export class LocalStorageTrashRepository implements ITrashRepository {
  private getStorageKey(): string {
    return STORAGE_KEY;
  }

  private async getAllFromStorage(): Promise<TrashItem[]> {
    if (typeof window === 'undefined') {
      return [];
    }

    try {
      const data = localStorage.getItem(this.getStorageKey());
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Erro ao ler lixeira do localStorage:', error);
      return [];
    }
  }

  private async saveToStorage(items: TrashItem[]): Promise<void> {
    if (typeof window === 'undefined') {
      return;
    }

    try {
      localStorage.setItem(this.getStorageKey(), JSON.stringify(items));
    } catch (error) {
      console.error('Erro ao salvar lixeira no localStorage:', error);
      throw new StorageError('Falha ao salvar item na lixeira');
    }
  }

  async findAll(): Promise<TrashItem[]> {
    return this.getAllFromStorage();
  }

  async findByEntityType(entityType: TrashItem['entityType']): Promise<TrashItem[]> {
    const items = await this.getAllFromStorage();
    return items.filter((item) => item.entityType === entityType);
  }

  async findByOriginalId(originalId: string, entityType: TrashItem['entityType']): Promise<TrashItem | null> {
    const items = await this.getAllFromStorage();
    return items.find((item) => item.originalId === originalId && item.entityType === entityType) || null;
  }

  async findById(id: string): Promise<TrashItem | null> {
    const items = await this.getAllFromStorage();
    return items.find((item) => item.id === id) || null;
  }

  async create(itemData: Omit<TrashItem, 'id' | 'deletedAt' | 'expiresAt'>): Promise<TrashItem> {
    if (!validateTrashItem(itemData)) {
      throw new RepositoryError('Dados do item da lixeira inválidos', 'VALIDATION_ERROR');
    }

    try {
      const item = createTrashItem(itemData);
      const items = await this.getAllFromStorage();
      items.push(item);
      await this.saveToStorage(items);
      return item;
    } catch (error) {
      if (error instanceof RepositoryError) {
        throw error;
      }
      throw new StorageError(`Erro ao adicionar item à lixeira: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    }
  }

  async restore(id: string): Promise<TrashItem> {
    const items = await this.getAllFromStorage();
    const index = items.findIndex((item) => item.id === id);

    if (index === -1) {
      throw new RepositoryError(`Item da lixeira com ID "${id}" não encontrado`, 'NOT_FOUND');
    }

    const item = items[index];
    items.splice(index, 1);
    await this.saveToStorage(items);

    return item;
  }

  async deletePermanently(id: string): Promise<void> {
    const items = await this.getAllFromStorage();
    const filtered = items.filter((item) => item.id !== id);

    if (filtered.length === items.length) {
      throw new RepositoryError(`Item da lixeira com ID "${id}" não encontrado`, 'NOT_FOUND');
    }

    await this.saveToStorage(filtered);
  }

  async cleanExpired(): Promise<number> {
    const items = await this.getAllFromStorage();
    const activeItems = items.filter((item) => !isTrashItemExpired(item));
    const expiredCount = items.length - activeItems.length;

    if (expiredCount > 0) {
      await this.saveToStorage(activeItems);
    }

    return expiredCount;
  }
}
