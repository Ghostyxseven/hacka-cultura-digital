// src/components/ui/MascotAvatar.tsx
'use client';

import { useState, useEffect } from 'react';

interface MascotAvatarProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  emotion?: 'happy' | 'excited' | 'thinking' | 'celebrating' | 'default';
  animated?: boolean;
  className?: string;
  onClick?: () => void;
}

/**
 * Componente de mascote interativo
 * Representa o mascote do sistema com diferentes emoções e animações
 */
export function MascotAvatar({
  size = 'md',
  emotion = 'default',
  animated = true,
  className = '',
  onClick,
}: MascotAvatarProps) {
  const [currentEmotion, setCurrentEmotion] = useState(emotion);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    setCurrentEmotion(emotion);
    if (animated && emotion !== 'default') {
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 1000);
    }
  }, [emotion, animated]);

  const sizeClasses = {
    sm: 'w-12 h-12 text-2xl',
    md: 'w-16 h-16 text-3xl',
    lg: 'w-24 h-24 text-5xl',
    xl: 'w-32 h-32 text-6xl',
  };

  const emotionEmojis = {
    happy: '😊',
    excited: '🎉',
    thinking: '🤔',
    celebrating: '🎊',
    default: '👨‍🎓',
  };

  const animationClasses = {
    happy: 'animate-bounce',
    excited: 'animate-pulse',
    thinking: 'animate-pulse',
    celebrating: 'animate-spin',
    default: '',
  };

  return (
    <div
      className={`
        ${sizeClasses[size]}
        ${isAnimating && animated ? animationClasses[currentEmotion] : ''}
        ${onClick ? 'cursor-pointer hover:scale-110 transition-transform' : ''}
        flex items-center justify-center
        rounded-full bg-gradient-to-br from-blue-400 to-indigo-600
        shadow-lg
        ${className}
      `}
      onClick={onClick}
      role={onClick ? 'button' : 'img'}
      aria-label={`Mascote do sistema - ${currentEmotion}`}
    >
      <span className="select-none">
        {emotionEmojis[currentEmotion]}
      </span>
    </div>
  );
}

/**
 * Componente de mascote com mensagem
 */
interface MascotWithMessageProps extends MascotAvatarProps {
  message: string;
  position?: 'left' | 'right' | 'top' | 'bottom';
}

export function MascotWithMessage({
  message,
  position = 'right',
  ...mascotProps
}: MascotWithMessageProps) {
  const positionClasses = {
    left: 'flex-row-reverse',
    right: 'flex-row',
    top: 'flex-col-reverse',
    bottom: 'flex-col',
  };

  const messagePositionClasses = {
    left: 'mr-4',
    right: 'ml-4',
    top: 'mb-4',
    bottom: 'mt-4',
  };

  return (
    <div className={`flex items-center ${positionClasses[position]}`}>
      <MascotAvatar {...mascotProps} />
      <div
        className={`
          ${messagePositionClasses[position]}
          bg-white border border-gray-200 rounded-lg p-3 shadow-md
          max-w-xs
        `}
      >
        <p className="text-sm text-gray-700">{message}</p>
      </div>
    </div>
  );
}
