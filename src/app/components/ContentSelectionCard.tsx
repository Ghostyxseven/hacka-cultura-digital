'use client';

import { useState } from 'react';
import Link from 'next/link';

interface ContentSelectionCardProps {
  subjects: Array<{ id: string; name: string }>;
  onGenerate?: (data: { year: string; subjectId: string; topic: string }) => void;
}

/**
 * Card de seleção de conteúdo
 * 
 * Exibe dropdowns para selecionar:
 * - Ano letivo
 * - Disciplina
 * - Assunto
 * 
 * Baseado no design de referência da plataforma
 */
export function ContentSelectionCard({ subjects, onGenerate }: ContentSelectionCardProps) {
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('');

  const schoolYears = [
    '1º ano',
    '2º ano',
    '3º ano',
    '4º ano',
    '5º ano',
    '6º ano',
    '7º ano',
    '8º ano',
    '9º ano',
    '1º ano EM',
    '2º ano EM',
    '3º ano EM',
  ];

  const handleGenerate = () => {
    if (selectedYear && selectedSubject && selectedTopic && onGenerate) {
      onGenerate({
        year: selectedYear,
        subjectId: selectedSubject,
        topic: selectedTopic,
      });
    }
  };

  const canGenerate = selectedYear && selectedSubject && selectedTopic;

  return (
    <div className="bg-white rounded-lg shadow-md p-8 border border-gray-200">
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Selecione o conteúdo</h2>
      <p className="text-gray-600 mb-6 text-sm">
        Escolha o ano letivo, disciplina e assunto para gerar conteúdo de Cultura Digital
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Ano Letivo */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">🎓</span>
            <label htmlFor="year" className="text-sm font-medium text-gray-700">
              Ano letivo
            </label>
          </div>
          <select
            id="year"
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-700 bg-white"
          >
            <option value="">Selecione o ano</option>
            {schoolYears.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>

        {/* Disciplina */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">📄</span>
            <label htmlFor="subject" className="text-sm font-medium text-gray-700">
              Disciplina
            </label>
          </div>
          <select
            id="subject"
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-700 bg-white"
          >
            <option value="">Selecione a disciplina</option>
            {subjects.map((subject) => (
              <option key={subject.id} value={subject.id}>
                {subject.name}
              </option>
            ))}
            {subjects.length === 0 && (
              <option value="" disabled>
                Nenhuma disciplina cadastrada
              </option>
            )}
          </select>
        </div>

        {/* Assunto */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">💡</span>
            <label htmlFor="topic" className="text-sm font-medium text-gray-700">
              Assunto
            </label>
          </div>
          <input
            id="topic"
            type="text"
            value={selectedTopic}
            onChange={(e) => setSelectedTopic(e.target.value)}
            placeholder="Selecione o assunto"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-700 bg-white"
          />
          <p className="text-xs text-gray-500 mt-1">Digite o tema ou assunto da aula</p>
        </div>
      </div>

      {canGenerate && (
        <div className="pt-4 border-t border-gray-200">
          <button
            onClick={handleGenerate}
            className="w-full px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium shadow-md"
          >
            ✨ Gerar Conteúdo
          </button>
        </div>
      )}
    </div>
  );
}
