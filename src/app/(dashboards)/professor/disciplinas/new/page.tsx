'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useSubjectForm } from '@/app/hooks';

const SCHOOL_YEARS = [
  '6º ano',
  '7º ano',
  '8º ano',
  '9º ano',
  '1º ano EM',
  '2º ano EM',
  '3º ano EM',
];

/**
 * Página de criação de disciplina
 * Lógica de negócio separada em hook customizado (Clean Architecture)
 */
export default function NewSubjectPage() {
  const router = useRouter();
  const { formData, setFormData, loading, error, toggleSchoolYear, createSubject } =
    useSubjectForm();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const subject = await createSubject(formData);
      router.push(`/professor/disciplinas/${subject.id}`);
    } catch (err) {
      // Erro já está sendo tratado no hook
    }
  };

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
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Nova Disciplina</h1>
              <p className="text-gray-600">
                Cadastre uma disciplina para organizar seus conteúdos didáticos (ex: Matemática, Ciências, História)
              </p>
            </div>

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
                <p className="mt-2 text-xs text-gray-500">
                  Nome da disciplina que será usada para organizar suas aulas
                </p>
              </div>

              <div className="mb-6">
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Descrição (opcional)
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
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Anos Escolares * <span className="text-gray-500 font-normal">(selecione pelo menos um)</span>
                </label>
                <p className="text-xs text-gray-500 mb-3">
                  Selecione os anos escolares para os quais esta disciplina será utilizada
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {SCHOOL_YEARS.map((year) => (
                    <button
                      key={year}
                      type="button"
                      onClick={() => toggleSchoolYear(year)}
                      className={`px-4 py-3 rounded-xl border-2 transition-all duration-200 font-semibold shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95 ${
                        formData.schoolYears.includes(year)
                          ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white border-indigo-600 shadow-lg'
                          : 'bg-white text-gray-700 border-gray-300 hover:border-indigo-400 hover:bg-indigo-50'
                      }`}
                    >
                      {year}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-4 pt-6 border-t border-gray-200">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-8 py-4 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-xl hover:from-indigo-700 hover:to-indigo-800 transition-all shadow-lg hover:shadow-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95 disabled:transform-none"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Criando...
                    </span>
                  ) : (
                    <>
                      <span className="mr-2">✨</span>
                      Criar Disciplina
                    </>
                  )}
                </button>
                <Link
                  href="/"
                  className="px-8 py-4 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 rounded-xl hover:from-gray-200 hover:to-gray-300 transition-all shadow-md hover:shadow-lg font-semibold border border-gray-300 transform hover:scale-105 active:scale-95"
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
