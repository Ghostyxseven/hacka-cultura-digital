'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ApplicationServiceFactory } from '@/application';

const SCHOOL_YEARS = [
  '6º ano',
  '7º ano',
  '8º ano',
  '9º ano',
  '1º ano EM',
  '2º ano EM',
  '3º ano EM',
];

export default function NewSubjectPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    schoolYears: [] as string[],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleToggleYear = (year: string) => {
    setFormData((prev) => ({
      ...prev,
      schoolYears: prev.schoolYears.includes(year)
        ? prev.schoolYears.filter((y) => y !== year)
        : [...prev.schoolYears, year],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!formData.name.trim()) {
        throw new Error('Nome da disciplina é obrigatório');
      }

      if (formData.schoolYears.length === 0) {
        throw new Error('Selecione pelo menos um ano escolar');
      }

      const subjectService = ApplicationServiceFactory.createSubjectService();
      const subject = await subjectService.create({
        name: formData.name.trim(),
        description: formData.description.trim(),
        schoolYears: formData.schoolYears,
      });

      router.push(`/professor/disciplinas/${subject.id}`);
    } catch (err: any) {
      setError(err.message || 'Erro ao criar disciplina');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Link href="/" className="text-indigo-600 hover:text-indigo-700 mb-4 inline-block">
            ← Voltar para Dashboard
          </Link>

          <div className="bg-white rounded-lg shadow-md p-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Nova Disciplina</h1>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Nome da Disciplina *
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Ex: Matemática, Ciências, História..."
                  required
                />
              </div>

              <div className="mb-6">
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Descrição
                </label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Descreva a disciplina..."
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Anos Escolares * (selecione pelo menos um)
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {SCHOOL_YEARS.map((year) => (
                    <button
                      key={year}
                      type="button"
                      onClick={() => handleToggleYear(year)}
                      className={`px-4 py-2 rounded-lg border-2 transition-colors ${
                        formData.schoolYears.includes(year)
                          ? 'bg-indigo-600 text-white border-indigo-600'
                          : 'bg-white text-gray-700 border-gray-300 hover:border-indigo-400'
                      }`}
                    >
                      {year}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Criando...' : 'Criar Disciplina'}
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
