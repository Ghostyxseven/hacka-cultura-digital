// src/components/ui/ThemeToggle.tsx
'use client';

import { useTheme } from '@/contexts/ThemeContext';
import { Button } from './Button';

/**
 * Componente para alternar entre temas
 */
export function ThemeToggle({ className = '' }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();

  const themeIcons = {
    light: '☀️',
    dark: '🌙',
    playful: '🎨',
  };

  const themeLabels = {
    light: 'Claro',
    dark: 'Escuro',
    playful: 'Lúdico',
  };

  return (
    <Button
      onClick={toggleTheme}
      variant="secondary"
      size="sm"
      className={className}
      aria-label={`Alternar tema. Tema atual: ${themeLabels[theme]}`}
      title={`Tema atual: ${themeLabels[theme]}. Clique para alternar`}
    >
      <span className="text-lg">{themeIcons[theme]}</span>
      <span className="ml-2 hidden sm:inline">{themeLabels[theme]}</span>
    </Button>
  );
}
