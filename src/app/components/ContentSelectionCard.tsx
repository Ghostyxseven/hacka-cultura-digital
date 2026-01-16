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
    <div className="bg-white rounded-xl shadow-md p-8 border border-gray-200">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Selecione o conteúdo</h2>
        <p className="text-gray-600 text-sm leading-relaxed">
          Escolha o ano letivo, disciplina e assunto para gerar conteúdo de Cultura Digital
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Ano Letivo */}
        <div>
          <label htmlFor="year" className="flex items-center gap-2 mb-3 text-sm font-semibold text-gray-700">
            <span className="text-xl">🎓</span>
            Ano letivo
          </label>
          <select
            id="year"
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-700 bg-white shadow-sm hover:border-gray-400 transition-colors"
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
          <label htmlFor="subject" className="flex items-center gap-2 mb-3 text-sm font-semibold text-gray-700">
            <span className="text-xl">📄</span>
            Disciplina
          </label>
          <select
            id="subject"
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-700 bg-white shadow-sm hover:border-gray-400 transition-colors"
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
          <label htmlFor="topic" className="flex items-center gap-2 mb-3 text-sm font-semibold text-gray-700">
            <span className="text-xl">💡</span>
            Assunto
          </label>
          <input
            id="topic"
            type="text"
            value={selectedTopic}
            onChange={(e) => setSelectedTopic(e.target.value)}
            placeholder="Selecione o assunto"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-700 bg-white shadow-sm hover:border-gray-400 transition-colors"
          />
          <p className="text-xs text-gray-500 mt-2">Digite o tema ou assunto da aula</p>
        </div>
      </div>

      {canGenerate && (
        <div className="pt-6 border-t border-gray-200">
          <button
            onClick={handleGenerate}
            className="w-full px-6 py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-lg hover:from-indigo-700 hover:to-indigo-800 transition-all font-semibold shadow-lg hover:shadow-xl"
          >
            <span className="mr-2">✨</span>
            Gerar Conteúdo
          </button>
        </div>
      )}
    </div>
  );
}
