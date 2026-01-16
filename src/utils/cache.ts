// src/utils/cache.ts
// Sistema simples de cache em memória para melhorar performance

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

class SimpleCache {
  private cache: Map<string, CacheEntry<any>> = new Map();
  private defaultTTL: number = 5 * 60 * 1000; // 5 minutos por padrão

  /**
   * Armazena um valor no cache
   */
  set<T>(key: string, data: T, ttl?: number): void {
    const now = Date.now();
    const expiresAt = now + (ttl || this.defaultTTL);

    this.cache.set(key, {
      data,
      timestamp: now,
      expiresAt,
    });
  }

  /**
   * Recupera um valor do cache
   */
  get<T>(key: string): T | null {
    const entry = this.cache.get(key);

    if (!entry) {
      return null;
    }

    // Verifica se expirou
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  /**
   * Verifica se uma chave existe e não expirou
   */
  has(key: string): boolean {
    const entry = this.cache.get(key);
    if (!entry) return false;

    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }

  /**
   * Remove uma entrada do cache
   */
  delete(key: string): void {
    this.cache.delete(key);
  }

  /**
   * Limpa todo o cache
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Remove entradas expiradas
   */
  cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiresAt) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Gera uma chave de cache baseada em parâmetros
   */
  static generateKey(prefix: string, params: Record<string, any>): string {
    const sortedParams = Object.keys(params)
      .sort()
      .map(key => `${key}:${JSON.stringify(params[key])}`)
      .join('|');
    return `${prefix}:${sortedParams}`;
  }
}

// Instância singleton do cache
export const cache = new SimpleCache();

// Limpa cache expirado a cada 10 minutos
if (typeof window !== 'undefined') {
  setInterval(() => {
    cache.cleanup();
  }, 10 * 60 * 1000);
}

// Funções auxiliares para cache de buscas
export const searchCache = {
  /**
   * Cacheia resultado de busca de disciplinas
   */
  setSubjects: (subjects: any[]) => {
    cache.set('search:subjects', subjects, 5 * 60 * 1000); // 5 minutos
  },

  /**
   * Recupera disciplinas do cache
   */
  getSubjects: () => {
    return cache.get<any[]>('search:subjects');
  },

  /**
   * Cacheia resultado de busca de unidades
   */
  setUnits: (subjectId: string, units: any[]) => {
    const key = SimpleCache.generateKey('search:units', { subjectId });
    cache.set(key, units, 5 * 60 * 1000);
  },

  /**
   * Recupera unidades do cache
   */
  getUnits: (subjectId: string) => {
    const key = SimpleCache.generateKey('search:units', { subjectId });
    return cache.get<any[]>(key);
  },

  /**
   * Cacheia resultado de busca de planos de aula
   */
  setLessonPlans: (filters: Record<string, any>, plans: any[]) => {
    const key = SimpleCache.generateKey('search:lessonPlans', filters);
    cache.set(key, plans, 10 * 60 * 1000); // 10 minutos
  },

  /**
   * Recupera planos de aula do cache
   */
  getLessonPlans: (filters: Record<string, any>) => {
    const key = SimpleCache.generateKey('search:lessonPlans', filters);
    return cache.get<any[]>(key);
  },

  /**
   * Limpa cache de buscas
   */
  clear: () => {
    cache.delete('search:subjects');
    // Limpa todas as entradas de unidades e planos
    cache.cleanup();
  },
};
