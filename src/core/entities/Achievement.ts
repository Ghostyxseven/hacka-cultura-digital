// src/core/entities/Achievement.ts

/**
 * Entidade que representa uma conquista/badge do sistema
 * Usado para gamificação e engajamento dos alunos
 */
export interface Achievement {
  id: string;
  name: string; // Nome da conquista (ex: "Primeiro Quiz Completo")
  description: string; // Descrição do que é necessário para desbloquear
  icon: string; // Ícone/emoji da conquista (ex: "🎯", "⭐")
  
  // Critérios de desbloqueio
  criteria: AchievementCriteria;
  
  // Metadados
  category: 'quiz' | 'plano' | 'disciplina' | 'social' | 'tempo' | 'especial';
  points: number; // Pontos que a conquista vale
  rarity: 'comum' | 'raro' | 'epico' | 'lendario';
  
  // Visual
  color?: string; // Cor do badge
  unlockedAt?: Date; // Quando foi desbloqueada (undefined se não desbloqueada)
}

export interface AchievementCriteria {
  type: 'quiz_completed' | 'quiz_perfect' | 'plano_studied' | 'streak_days' | 'total_points' | 'custom';
  value: number; // Valor necessário (ex: 5 quizzes, 7 dias de streak)
  subjectId?: string; // Opcional: específico de uma disciplina
}

/**
 * Progresso de um aluno em relação a uma conquista
 */
export interface AchievementProgress {
  achievementId: string;
  userId: string;
  currentValue: number; // Valor atual do progresso
  targetValue: number; // Valor necessário para desbloquear
  isUnlocked: boolean;
  unlockedAt?: Date;
  progressPercentage: number; // 0-100
}
