// src/core/entities/SharedLessonPlan.ts

import { LessonPlan } from './LessonPlan';

/**
 * Entidade que representa um plano de aula compartilhado
 * Permite colaboração entre professores
 */
export interface SharedLessonPlan {
  id: string;
  lessonPlanId: string; // Referência ao plano original
  originalPlan: LessonPlan; // Cópia do plano no momento do compartilhamento
  
  // Informações de compartilhamento
  sharedBy: string; // ID do professor que compartilhou
  sharedAt: Date;
  
  // Permissões e visibilidade
  visibility: 'public' | 'private' | 'link'; // Público, privado, ou por link
  allowAdaptation: boolean; // Se outros podem adaptar/copiar
  
  // Metadados
  title: string; // Título para a biblioteca (pode ser diferente do plano)
  description?: string; // Descrição do plano compartilhado
  tags: string[]; // Tags para busca
  
  // Estatísticas
  viewCount: number; // Quantas vezes foi visualizado
  adaptationCount: number; // Quantas vezes foi adaptado/copiado
  likes: number; // Sistema de likes
  
  // Adaptações
  adaptations: LessonPlanAdaptation[]; // Histórico de adaptações
}

/**
 * Representa uma adaptação de um plano compartilhado
 */
export interface LessonPlanAdaptation {
  id: string;
  adaptedBy: string; // ID do professor que adaptou
  adaptedAt: Date;
  changes: string; // Descrição das mudanças feitas
  adaptedPlanId: string; // ID do plano adaptado criado
}
