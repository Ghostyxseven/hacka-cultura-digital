// src/components/ui/AccessibilityControls.tsx
'use client';

import { useState, useEffect } from 'react';
import { Button } from './Button';

interface AccessibilitySettings {
  highContrast: boolean;
  fontSize: 'normal' | 'large' | 'extra-large';
  reducedMotion: boolean;
}

const STORAGE_KEY = '@hacka-cultura:accessibility-settings';

/**
 * Componente de controles de acessibilidade
 * Permite ajustar contraste, tamanho de fonte e animações
 */
export function AccessibilityControls() {
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState<AccessibilitySettings>({
    highContrast: false,
    fontSize: 'normal',
    reducedMotion: false,
  });

  useEffect(() => {
    // Carrega configurações salvas
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          setSettings(JSON.parse(saved));
        } catch (e) {
          console.error('Erro ao carregar configurações de acessibilidade:', e);
        }
      }
    }
  }, []);

  useEffect(() => {
    // Aplica configurações ao documento
    if (typeof document !== 'undefined') {
      const root = document.documentElement;

      // Alto contraste
      if (settings.highContrast) {
        root.classList.add('high-contrast');
      } else {
        root.classList.remove('high-contrast');
      }

      // Tamanho de fonte
      root.classList.remove('font-normal', 'font-large', 'font-extra-large');
      root.classList.add(`font-${settings.fontSize}`);

      // Redução de movimento
      if (settings.reducedMotion) {
        root.classList.add('reduce-motion');
      } else {
        root.classList.remove('reduce-motion');
      }
    }
  }, [settings]);

  const updateSetting = <K extends keyof AccessibilitySettings>(
    key: K,
    value: AccessibilitySettings[K]
  ) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    
    // Salva no localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newSettings));
    }
  };

  return (
    <>
      <Button
        onClick={() => setIsOpen(!isOpen)}
        variant="secondary"
        size="sm"
        className="fixed bottom-4 right-4 z-50 rounded-full p-3 shadow-lg"
        aria-label="Controles de acessibilidade"
        aria-expanded={isOpen}
      >
        ♿
      </Button>

      {isOpen && (
        <div className="fixed bottom-20 right-4 z-50 bg-white border border-gray-200 rounded-lg shadow-xl p-4 w-80">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-lg">Acessibilidade</h3>
            <Button
              onClick={() => setIsOpen(false)}
              variant="secondary"
              size="sm"
              aria-label="Fechar controles"
            >
              ✕
            </Button>
          </div>

          <div className="space-y-4">
            {/* Alto Contraste */}
            <div>
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-sm font-medium">Alto Contraste</span>
                <input
                  type="checkbox"
                  checked={settings.highContrast}
                  onChange={(e) => updateSetting('highContrast', e.target.checked)}
                  className="w-5 h-5"
                  aria-label="Ativar alto contraste"
                />
              </label>
            </div>

            {/* Tamanho de Fonte */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Tamanho da Fonte
              </label>
              <select
                value={settings.fontSize}
                onChange={(e) => updateSetting('fontSize', e.target.value as AccessibilitySettings['fontSize'])}
                className="w-full p-2 border border-gray-300 rounded"
                aria-label="Selecionar tamanho da fonte"
              >
                <option value="normal">Normal</option>
                <option value="large">Grande</option>
                <option value="extra-large">Extra Grande</option>
              </select>
            </div>

            {/* Redução de Movimento */}
            <div>
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-sm font-medium">Reduzir Animações</span>
                <input
                  type="checkbox"
                  checked={settings.reducedMotion}
                  onChange={(e) => updateSetting('reducedMotion', e.target.checked)}
                  className="w-5 h-5"
                  aria-label="Reduzir animações"
                />
              </label>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
