// src/components/ui/TextToSpeech.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from './Button';

interface TextToSpeechProps {
  text: string;
  language?: string;
  className?: string;
  showControls?: boolean;
}

/**
 * Componente de leitura em voz alta
 * Usa Web Speech API para ler texto
 */
export function TextToSpeech({ 
  text, 
  language = 'pt-BR',
  className = '',
  showControls = true 
}: TextToSpeechProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [rate, setRate] = useState(1);
  const [pitch, setPitch] = useState(1);
  const [volume, setVolume] = useState(1);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    // Limpa ao desmontar
    return () => {
      if (utteranceRef.current) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const speak = () => {
    if (!text) return;

    // Cancela qualquer fala anterior
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language;
    utterance.rate = rate;
    utterance.pitch = pitch;
    utterance.volume = volume;

    utterance.onstart = () => {
      setIsPlaying(true);
      setIsPaused(false);
    };

    utterance.onend = () => {
      setIsPlaying(false);
      setIsPaused(false);
    };

    utterance.onerror = () => {
      setIsPlaying(false);
      setIsPaused(false);
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  const pause = () => {
    if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
      window.speechSynthesis.pause();
      setIsPaused(true);
    }
  };

  const resume = () => {
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
    }
  };

  const stop = () => {
    window.speechSynthesis.cancel();
    setIsPlaying(false);
    setIsPaused(false);
  };

  // Verifica se a API está disponível
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return null; // Não renderiza se não suportado
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="flex items-center gap-1">
        {!isPlaying && !isPaused && (
          <Button
            onClick={speak}
            variant="secondary"
            size="sm"
            aria-label="Ler texto em voz alta"
          >
            🔊 Ler
          </Button>
        )}

        {isPlaying && !isPaused && (
          <Button
            onClick={pause}
            variant="secondary"
            size="sm"
            aria-label="Pausar leitura"
          >
            ⏸️ Pausar
          </Button>
        )}

        {isPaused && (
          <Button
            onClick={resume}
            variant="secondary"
            size="sm"
            aria-label="Continuar leitura"
          >
            ▶️ Continuar
          </Button>
        )}

        {(isPlaying || isPaused) && (
          <Button
            onClick={stop}
            variant="secondary"
            size="sm"
            aria-label="Parar leitura"
          >
            ⏹️ Parar
          </Button>
        )}
      </div>

      {showControls && (
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <label className="flex items-center gap-1">
            Velocidade:
            <input
              type="range"
              min="0.5"
              max="2"
              step="0.1"
              value={rate}
              onChange={(e) => setRate(parseFloat(e.target.value))}
              className="w-20"
              aria-label="Velocidade de leitura"
            />
            <span className="w-8 text-xs">{rate.toFixed(1)}x</span>
          </label>
        </div>
      )}
    </div>
  );
}
