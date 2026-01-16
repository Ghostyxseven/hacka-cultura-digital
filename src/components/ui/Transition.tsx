// src/components/ui/Transition.tsx
// Componente de transição para animações suaves
'use client';

import { ReactNode, useEffect, useState } from 'react';

interface TransitionProps {
  children: ReactNode;
  show?: boolean;
  duration?: number;
  className?: string;
}

export function FadeTransition({ 
  children, 
  show = true, 
  duration = 300,
  className = '' 
}: TransitionProps) {
  const [isVisible, setIsVisible] = useState(show);

  useEffect(() => {
    if (show) {
      setIsVisible(true);
    } else {
      const timer = setTimeout(() => setIsVisible(false), duration);
      return () => clearTimeout(timer);
    }
  }, [show, duration]);

  if (!isVisible) return null;

  return (
    <div
      className={`transition-opacity duration-${duration} ${show ? 'opacity-100' : 'opacity-0'} ${className}`}
      style={{ transitionDuration: `${duration}ms` }}
    >
      {children}
    </div>
  );
}

export function SlideTransition({ 
  children, 
  show = true, 
  duration = 300,
  direction = 'up',
  className = '' 
}: TransitionProps & { direction?: 'up' | 'down' | 'left' | 'right' }) {
  const [isVisible, setIsVisible] = useState(show);

  useEffect(() => {
    if (show) {
      setIsVisible(true);
    } else {
      const timer = setTimeout(() => setIsVisible(false), duration);
      return () => clearTimeout(timer);
    }
  }, [show, duration]);

  if (!isVisible) return null;

  const directionClasses = {
    up: show ? 'translate-y-0' : 'translate-y-4',
    down: show ? 'translate-y-0' : '-translate-y-4',
    left: show ? 'translate-x-0' : 'translate-x-4',
    right: show ? 'translate-x-0' : '-translate-x-4',
  };

  return (
    <div
      className={`transition-all ${directionClasses[direction]} ${show ? 'opacity-100' : 'opacity-0'} ${className}`}
      style={{ transitionDuration: `${duration}ms` }}
    >
      {children}
    </div>
  );
}
