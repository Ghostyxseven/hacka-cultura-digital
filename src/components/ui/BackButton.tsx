// src/components/ui/BackButton.tsx
'use client';

import { useRouter } from 'next/navigation';
import { Button } from './Button';

interface BackButtonProps {
  href?: string;
  onClick?: () => void;
  label?: string;
  className?: string;
}

/**
 * Componente reutilizável para botão de voltar
 */
export function BackButton({ 
  href, 
  onClick, 
  label = 'Voltar',
  className = '' 
}: BackButtonProps) {
  const router = useRouter();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (href) {
      router.push(href);
    } else {
      router.back();
    }
  };

  return (
    <Button
      variant="secondary"
      onClick={handleClick}
      className={`flex items-center gap-2 ${className}`}
    >
      <span>←</span>
      <span>{label}</span>
    </Button>
  );
}
