'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ApplicationServiceFactory } from '@/application';
import type { Subject } from '@/application/viewmodels';

export default function NewUnitPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const subjectId = searchParams.get('subjectId') || '';

  const [formData, setFormData] = useState({
    subjectId: subjectId,
    title: '',
    theme: '',
    isAIGenerated: false,
  });
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingSubjects, setLoadingSubjects] = useState(true);
  const [error, setError] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<Array<{ title: string; theme: string }>>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);

  useEffect(() => {
    loadSubjects();
  }, []);

  useEffect(() => {
    if (subjectId && subjects.length > 0) {
      const subject = subjects.find((s) => s.id === subjectId);
      if (subject) {
        loadSuggestions(subject.id);
      }
    }
  }, [subjectId, subjects]);

  const loadSubjects = async () => {
    try {
      const subjectService = ApplicationServiceFactory.createSubjectService();
      const allSubjects = await subjectService.findAll();
      setSubjects(allSubjects);
      if (allSubjects.length > 0 && !subjectId) {
        setFormData((prev) => ({ ...prev, subjectId: allSubjects[0].id }));
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar disciplinas');
    } finally {
      setLoadingSubjects(false);
    }
  };

  const loadSuggestions = async (sid: string) => {
    try {
      setLoadingSuggestions(true);
      const unitService = ApplicationServiceFactory.createUnitService();
      const suggested = await unitService.suggest({
        subjectId: sid,
        numberOfSuggestions: 5,
      });
      setSuggestions(suggested);
    } catch (err: any) {
      console.error('Erro ao carregar sugestões:', err);
    } finally {
      setLoadingSuggestions(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!formData.subjectId) {
        throw new Error('Selecione uma disciplina');
      }

      if (!formData.title.trim()) {
        throw new Error('Título da unidade é obrigatório');
      }

      if (!formData.theme.trim()) {
        throw new Error('Tema da unidade é obrigatório');
      }

      const unitService = ApplicationServiceFactory.createUnitService();
      const unit = await unitService.create({
        subjectId: formData.subjectId,
        title: formData.title.trim(),
        theme: formData.theme.trim(),
        isAIGenerated: formData.isAIGenerated,
      });

      router.push(`/professor/unidades/${unit.id}/plano`);
    } catch (err: any) {
      setError(err.message || 'Erro ao criar unidade');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectSuggestion = (suggestion: { title: string; theme: string }) => {
    setFormData({
      ...formData,
      title: suggestion.title,
      theme: suggestion.theme,
      isAIGenerated: true,
    });
    setShowSuggestions(false);
  };

  const selectedSubject = subjects.find((s) => s.id === formData.subjectId);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Link href="/" className="text-indigo-600 hover:text-indigo-700 mb-4 inline-block">
            ← Voltar para Dashboard
          </Link>

          <div className="bg-white rounded-lg shadow-md p-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Nova Unidade de Ensino</h1>

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
                    if (e.target.value) {
                      loadSuggestions(e.target.value);
                    }
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
                  <button
                    type="button"
                    onClick={() => setShowSuggestions(!showSuggestions)}
                    className="w-full px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors mb-4"
                  >
                    {showSuggestions ? 'Ocultar' : 'Mostrar'} Sugestões de IA
                  </button>

                  {showSuggestions && (
                    <div className="bg-indigo-50 rounded-lg p-4 mb-4">
                      {loadingSuggestions ? (
                        <p className="text-gray-600">Carregando sugestões...</p>
                      ) : suggestions.length > 0 ? (
                        <div className="space-y-3">
                          <p className="text-sm font-medium text-gray-700 mb-2">
                            Sugestões baseadas em {selectedSubject.name}:
                          </p>
                          {suggestions.map((suggestion, index) => (
                            <button
                              key={index}
                              type="button"
                              onClick={() => handleSelectSuggestion(suggestion)}
                              className="w-full text-left p-3 bg-white rounded-lg hover:shadow-md transition-shadow border-2 border-transparent hover:border-indigo-400"
                            >
                              <h4 className="font-semibold text-gray-800 mb-1">
                                {suggestion.title}
                              </h4>
                              <p className="text-sm text-gray-600">{suggestion.theme}</p>
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
                  Título da Unidade *
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
              </div>

              <div className="mb-6">
                <label htmlFor="theme" className="block text-sm font-medium text-gray-700 mb-2">
                  Tema da Unidade *
                </label>
                <textarea
                  id="theme"
                  value={formData.theme}
                  onChange={(e) => setFormData({ ...formData, theme: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Descreva o tema detalhadamente..."
                  required
                />
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
