// src/components/ui/AchievementBadge.tsx
'use client';

import { Achievement } from '@/core/entities/Achievement';
import { AchievementProgress } from '@/core/entities/Achievement';

interface AchievementBadgeProps {
  achievement: Achievement;
  progress?: AchievementProgress;
  size?: 'sm' | 'md' | 'lg';
  showProgress?: boolean;
  className?: string;
}

/**
 * Componente de badge de conquista
 * Exibe conquistas com animação e progresso
 */
export function AchievementBadge({
  achievement,
  progress,
  size = 'md',
  showProgress = false,
  className = '',
}: AchievementBadgeProps) {
  const isUnlocked = achievement.unlockedAt !== undefined || progress?.isUnlocked;
  const progressPercentage = progress?.progressPercentage || 0;

  const sizeClasses = {
    sm: 'w-12 h-12 text-lg',
    md: 'w-16 h-16 text-2xl',
    lg: 'w-24 h-24 text-4xl',
  };

  const rarityColors = {
    comum: 'bg-gray-100 border-gray-300',
    raro: 'bg-blue-100 border-blue-300',
    epico: 'bg-purple-100 border-purple-300',
    lendario: 'bg-yellow-100 border-yellow-400',
  };

  return (
    <div className={`relative inline-block ${className}`}>
      <div
        className={`
          ${sizeClasses[size]}
          rounded-full border-2 flex items-center justify-center
          ${isUnlocked ? rarityColors[achievement.rarity] : 'bg-gray-50 border-gray-200 opacity-50'}
          ${isUnlocked ? 'animate-pulse' : ''}
          transition-all duration-300
          ${isUnlocked ? 'shadow-md hover:shadow-lg' : ''}
        `}
        role="img"
        aria-label={isUnlocked ? `Conquista desbloqueada: ${achievement.name}` : `Conquista bloqueada: ${achievement.name}`}
      >
        <span className={isUnlocked ? '' : 'grayscale'}>
          {achievement.icon}
        </span>
      </div>

      {showProgress && !isUnlocked && progress && (
        <div className="absolute -bottom-1 left-0 right-0 h-1 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-500 transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
            aria-label={`Progresso: ${progressPercentage}%`}
          />
        </div>
      )}

      {isUnlocked && (
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
      )}
    </div>
  );
}

/**
 * Componente de lista de conquistas
 */
interface AchievementListProps {
  achievements: Achievement[];
  progressMap?: Map<string, AchievementProgress>;
  size?: 'sm' | 'md' | 'lg';
  showProgress?: boolean;
  className?: string;
}

export function AchievementList({
  achievements,
  progressMap,
  size = 'md',
  showProgress = false,
  className = '',
}: AchievementListProps) {
  return (
    <div className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 ${className}`}>
      {achievements.map((achievement) => {
        const progress = progressMap?.get(achievement.id);
        return (
          <div
            key={achievement.id}
            className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <AchievementBadge
              achievement={achievement}
              progress={progress}
              size={size}
              showProgress={showProgress}
            />
            <div className="text-center">
              <p className="text-xs font-medium text-gray-900">{achievement.name}</p>
              {showProgress && progress && !progress.isUnlocked && (
                <p className="text-xs text-gray-500 mt-1">
                  {progress.currentValue}/{progress.targetValue}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
