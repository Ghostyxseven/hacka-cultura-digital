'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useUnitForm } from '@/app/hooks';

/**
 * Página de criação de unidade
 * Lógica de negócio separada em hook customizado (Clean Architecture)
 */
export default function NewUnitPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const subjectId = searchParams.get('subjectId') || '';

  const [showSuggestions, setShowSuggestions] = useState(false);
  const {
    formData,
    setFormData,
    subjects,
    suggestions,
    loading,
    loadingSubjects,
    loadingSuggestions,
    error,
    selectSuggestion,
    createUnit,
  } = useUnitForm(subjectId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const unit = await createUnit(formData);
      router.push(`/professor/unidades/${unit.id}/plano`);
    } catch (err) {
      // Erro já está sendo tratado no hook
    }
  };

  const selectedSubject = subjects.find((s) => s.id === formData.subjectId);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-8 py-8">
        <div className="max-w-3xl mx-auto">
          <Link
            href="/"
            className="text-gray-600 hover:text-gray-900 mb-6 inline-flex items-center gap-2 text-sm font-medium transition-colors"
          >
            <span>←</span>
            <span>Voltar para Dashboard</span>
          </Link>

          <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
            <div className="mb-6 pb-6 border-b border-gray-200">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Nova Unidade de Ensino (Aula)</h1>
              <p className="text-gray-600">
                Crie uma aula manualmente informando o tema, ou use as sugestões automáticas da IA alinhadas à BNCC
              </p>
            </div>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label
                  htmlFor="subjectId"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Disciplina *
                </label>
                <select
                  id="subjectId"
                  value={formData.subjectId}
                  onChange={(e) => {
                    setFormData({ ...formData, subjectId: e.target.value });
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                  disabled={loadingSubjects}
                >
                  <option value="">Selecione uma disciplina</option>
                  {subjects.map((subject) => (
                    <option key={subject.id} value={subject.id}>
                      {subject.name}
                    </option>
                  ))}
                </select>
              </div>

              {selectedSubject && (
                <div className="mb-6">
                  <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg p-5 mb-4 border border-indigo-200">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-bold text-gray-900 mb-1 flex items-center gap-2">
                          <span className="text-xl">✨</span>
                          Sugestões Automáticas via IA
                        </h3>
                        <p className="text-sm text-gray-600">
                          A IA sugere temas de aulas alinhados à BNCC baseados em {selectedSubject.name}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowSuggestions(!showSuggestions)}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium shadow-md"
                      >
                        {showSuggestions ? 'Ocultar' : 'Ver Sugestões'}
                      </button>
                    </div>

                    {showSuggestions && (
                      <div className="mt-4 pt-4 border-t border-indigo-200">
                        {loadingSuggestions ? (
                          <div className="text-center py-4">
                            <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600 mb-2"></div>
                            <p className="text-gray-600 text-sm">Gerando sugestões com IA...</p>
                          </div>
                        ) : suggestions.length > 0 ? (
                          <div className="space-y-3">
                            <p className="text-sm font-semibold text-gray-700 mb-3">
                              Clique em uma sugestão para preencher automaticamente:
                            </p>
                            {suggestions.map((suggestion, index) => (
                              <button
                                key={index}
                                type="button"
                                onClick={() => {
                                  selectSuggestion(suggestion);
                                  setShowSuggestions(false);
                                }}
                                className="w-full text-left p-4 bg-white rounded-lg hover:shadow-lg transition-all border-2 border-gray-200 hover:border-indigo-400 hover:bg-indigo-50 group"
                              >
                                <div className="flex items-start gap-3">
                                  <span className="text-lg mt-0.5">💡</span>
                                  <div className="flex-1">
                                    <h4 className="font-bold text-gray-900 mb-2 group-hover:text-indigo-700 transition-colors">
                                      {suggestion.title}
                                    </h4>
                                    <p className="text-sm text-gray-600 leading-relaxed">{suggestion.theme}</p>
                                    <span className="inline-block mt-2 px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">
                                      Alinhado à BNCC
                                    </span>
                                  </div>
                                  <span className="text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity">
                                    →
                                  </span>
                                </div>
                              </button>
                            ))}
                        </div>
                      ) : (
                        <p className="text-gray-600">Nenhuma sugestão disponível</p>
                      )}
                    </div>
                  )}
                </div>
              )}

              <div className="mb-6">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  Título da Unidade (Aula) *
                </label>
                <input
                  type="text"
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Ex: Introdução à Cultura Digital"
                  required
                />
                <p className="mt-2 text-xs text-gray-500">
                  Nome curto e descritivo da aula
                </p>
              </div>

              <div className="mb-6">
                <label htmlFor="theme" className="block text-sm font-medium text-gray-700 mb-2">
                  Tema da Unidade * <span className="text-gray-500 font-normal">(criação manual)</span>
                </label>
                <textarea
                  id="theme"
                  value={formData.theme}
                  onChange={(e) => setFormData({ ...formData, theme: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Descreva o tema detalhadamente. Ex: Conceitos básicos de cultura digital, uso responsável das tecnologias, ética na internet..."
                  required
                />
                <p className="mt-2 text-xs text-gray-500">
                  Descreva o tema que será abordado nesta aula. Quanto mais detalhado, melhores serão os materiais gerados
                </p>
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Criando...' : 'Criar Unidade'}
                </button>
                <Link
                  href="/"
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancelar
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
