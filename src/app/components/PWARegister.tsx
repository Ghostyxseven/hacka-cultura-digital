// src/app/components/PWARegister.tsx
'use client';

import { useEffect } from 'react';

/**
 * Componente para registrar Service Worker
 * Deve ser usado no layout raiz
 */
export function PWARegister() {
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('Service Worker registrado com sucesso:', registration.scope);
        })
        .catch((error) => {
          console.error('Erro ao registrar Service Worker:', error);
        });
    }
  }, []);

  return null;
}
