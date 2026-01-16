// src/hooks/useRecentUnits.ts
import { useMemo } from 'react';

/**
 * Hook para obter itens mais recentes ordenados por data de criação
 * @param items Array de itens com propriedade createdAt
 * @param limit Número máximo de itens a retornar (padrão: 5)
 * @returns Array de itens ordenados do mais recente para o mais antigo
 */
export function useRecentUnits<T extends { createdAt: Date | string }>(
  items: T[],
  limit: number = 5
): T[] {
  return useMemo(() => {
    return [...items]
      .sort((a, b) => {
        const dateA = a.createdAt instanceof Date 
          ? a.createdAt.getTime() 
          : new Date(a.createdAt).getTime();
        const dateB = b.createdAt instanceof Date 
          ? b.createdAt.getTime() 
          : new Date(b.createdAt).getTime();
        return dateB - dateA; // Mais recente primeiro
      })
      .slice(0, limit);
  }, [items, limit]);
}
