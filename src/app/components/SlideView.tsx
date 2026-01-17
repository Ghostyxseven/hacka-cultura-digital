'use client';

import { useState } from 'react';
import type { Slide } from '@/application/viewmodels';

interface SlideViewProps {
  slides: Slide[];
  onRegenerate?: () => void;
}

/**
 * Componente para visualizar slides de apresentação
 * Suporta navegação entre slides e modo de apresentação
 */
export function SlideView({ slides, onRegenerate }: SlideViewProps) {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isPresentationMode, setIsPresentationMode] = useState(false);

  const currentSlide = slides[currentSlideIndex];
  const totalSlides = slides.length;

  const goToNext = () => {
    if (currentSlideIndex < totalSlides - 1) {
      setCurrentSlideIndex(currentSlideIndex + 1);
    }
  };

  const goToPrevious = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex(currentSlideIndex - 1);
    }
  };

  const goToSlide = (index: number) => {
    if (index >= 0 && index < totalSlides) {
      setCurrentSlideIndex(index);
    }
  };

  // Navegação por teclado em modo apresentação
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isPresentationMode) return;

    if (e.key === 'ArrowRight' || e.key === ' ') {
      e.preventDefault();
      goToNext();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      goToPrevious();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setIsPresentationMode(false);
    }
  };

  if (!currentSlide) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-12 text-center border border-gray-200">
        <p className="text-gray-600">Nenhum slide disponível</p>
      </div>
    );
  }

  if (isPresentationMode) {
    return (
      <div
        className="fixed inset-0 bg-black z-50 flex items-center justify-center"
        onKeyDown={handleKeyDown}
        tabIndex={0}
      >
        <div className="w-full h-full flex flex-col items-center justify-center p-8">
          {/* Slide atual */}
          <div className="flex-1 w-full max-w-5xl flex items-center justify-center">
            <div className="bg-white rounded-xl shadow-2xl p-12 w-full max-h-[80vh] overflow-y-auto">
              <h2 className="text-4xl font-bold text-gray-900 mb-6 text-center">
                {currentSlide.title}
              </h2>
              <div
                className="text-xl text-gray-700 leading-relaxed whitespace-pre-line"
                dangerouslySetInnerHTML={{
                  __html: currentSlide.content
                    .split('\n')
                    .map((line) => {
                      if (line.trim().startsWith('•')) {
                        return `<div class="mb-2">${line}</div>`;
                      }
                      return `<div class="mb-3">${line}</div>`;
                    })
                    .join(''),
                }}
              />
            </div>
          </div>

          {/* Controles */}
          <div className="mt-6 flex items-center gap-4 text-white">
            <button
              onClick={goToPrevious}
              disabled={currentSlideIndex === 0}
              className="px-6 py-3 bg-white/20 rounded-lg hover:bg-white/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              aria-label="Slide anterior"
            >
              ← Anterior
            </button>
            <span className="text-sm">
              {currentSlideIndex + 1} / {totalSlides}
            </span>
            <button
              onClick={goToNext}
              disabled={currentSlideIndex === totalSlides - 1}
              className="px-6 py-3 bg-white/20 rounded-lg hover:bg-white/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              aria-label="Próximo slide"
            >
              Próximo →
            </button>
            <button
              onClick={() => setIsPresentationMode(false)}
              className="px-6 py-3 bg-red-600 rounded-lg hover:bg-red-700 transition-all ml-4"
              aria-label="Sair do modo apresentação"
            >
              Sair (ESC)
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Controles superiores */}
      <div className="flex items-center justify-between bg-white rounded-xl shadow-lg p-4 border border-gray-200">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsPresentationMode(true)}
            className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-lg hover:from-indigo-700 hover:to-indigo-800 transition-all text-sm font-semibold"
            aria-label="Modo apresentação"
          >
            🖼️ Modo Apresentação
          </button>
          {onRegenerate && (
            <button
              onClick={onRegenerate}
              className="px-4 py-2 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 rounded-lg hover:from-gray-200 hover:to-gray-300 transition-all text-sm font-semibold"
              aria-label="Regenerar slides"
            >
              🔄 Regenerar Slides
            </button>
          )}
        </div>
        <div className="text-sm text-gray-600">
          Slide {currentSlideIndex + 1} de {totalSlides}
        </div>
      </div>

      {/* Navegação de slides (miniatura) */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {slides.map((slide, index) => (
          <button
            key={slide.id}
            onClick={() => goToSlide(index)}
            className={`flex-shrink-0 w-32 h-20 rounded-lg p-2 border-2 transition-all text-left ${
              index === currentSlideIndex
                ? 'border-indigo-600 bg-indigo-50'
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
            aria-label={`Ir para slide ${index + 1}: ${slide.title}`}
          >
            <div className="text-xs font-semibold text-gray-900 truncate mb-1">
              {index + 1}. {slide.title}
            </div>
            <div className="text-xs text-gray-600 line-clamp-2">
              {slide.content.substring(0, 50)}...
            </div>
          </button>
        ))}
      </div>

      {/* Slide atual (visualização) */}
      <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200 min-h-[400px]">
        <div className="mb-6 pb-4 border-b border-gray-200">
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${
              currentSlide.type === 'title'
                ? 'bg-blue-100 text-blue-700'
                : currentSlide.type === 'summary'
                ? 'bg-green-100 text-green-700'
                : 'bg-gray-100 text-gray-700'
            }`}
          >
            {currentSlide.type === 'title'
              ? 'Título'
              : currentSlide.type === 'summary'
              ? 'Resumo'
              : 'Conteúdo'}
          </span>
          <h2 className="text-3xl font-bold text-gray-900 mt-4">{currentSlide.title}</h2>
        </div>
        <div
          className="text-gray-700 leading-relaxed whitespace-pre-line"
          dangerouslySetInnerHTML={{
            __html: currentSlide.content
              .split('\n')
              .map((line) => {
                if (line.trim().startsWith('•')) {
                  return `<div class="mb-2 text-lg">${line}</div>`;
                }
                return `<div class="mb-3 text-lg">${line}</div>`;
              })
              .join(''),
          }}
        />
      </div>

      {/* Navegação inferior */}
      <div className="flex items-center justify-between bg-white rounded-xl shadow-lg p-4 border border-gray-200">
        <button
          onClick={goToPrevious}
          disabled={currentSlideIndex === 0}
          className="px-6 py-2 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 rounded-lg hover:from-gray-200 hover:to-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-semibold"
          aria-label="Slide anterior"
        >
          ← Anterior
        </button>
        <div className="flex gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentSlideIndex ? 'bg-indigo-600 w-8' : 'bg-gray-300 hover:bg-gray-400'
              }`}
              aria-label={`Ir para slide ${index + 1}`}
            />
          ))}
        </div>
        <button
          onClick={goToNext}
          disabled={currentSlideIndex === totalSlides - 1}
          className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-lg hover:from-indigo-700 hover:to-indigo-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-semibold"
          aria-label="Próximo slide"
        >
          Próximo →
        </button>
      </div>
    </div>
  );
}
