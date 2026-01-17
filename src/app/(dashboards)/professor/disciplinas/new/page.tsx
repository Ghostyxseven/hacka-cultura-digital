'use client';

import { FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useSubjectForm, useToast } from '@/app/hooks';
import { ToastContainer } from '@/app/components';

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
  const { formData, setFormData, loading, error, nameValidation, selectSchoolYear, createSubject } =
    useSubjectForm();
  const { toasts, showToast, removeToast } = useToast();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const subject = await createSubject(formData);
      showToast('Disciplina criada com sucesso!', 'success');
      setTimeout(() => {
        router.push(`/professor/disciplinas/${subject.id}`);
      }, 500);
    } catch (err: any) {
      showToast(err.message || 'Erro ao criar disciplina', 'error');
    }
  };

  return (
    <>
      <ToastContainer toasts={toasts} onRemove={removeToast} />
      <div className="min-h-screen bg-gray-50">
        <div className="px-4 py-4 md:px-8 md:py-8">
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


            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Nome da Disciplina *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={`w-full px-4 py-3 pr-10 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm hover:border-gray-400 transition-colors ${
                      error && error.includes('nome')
                        ? 'border-red-500'
                        : nameValidation.isAvailable === false
                        ? 'border-red-500'
                        : nameValidation.isAvailable === true
                        ? 'border-green-500'
                        : 'border-gray-300'
                    }`}
                    placeholder="Ex: Matemática, Ciências, História..."
                    required
                    aria-required="true"
                    aria-describedby="name-help name-error name-status"
                    aria-invalid={
                      error && error.includes('nome') ? 'true' : nameValidation.isAvailable === false ? 'true' : 'false'
                    }
                    maxLength={100}
                    disabled={loading}
                  />
                  {nameValidation.isValidating && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-indigo-600"></div>
                    </div>
                  )}
                  {nameValidation.isAvailable === true && !nameValidation.isValidating && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500">
                      ✓
                    </div>
                  )}
                  {nameValidation.isAvailable === false && !nameValidation.isValidating && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500">
                      ✗
                    </div>
                  )}
                </div>
                <p id="name-help" className="mt-2 text-xs text-gray-500">
                  Nome da disciplina que será usada para organizar suas aulas ({formData.name.length}/100 caracteres)
                </p>
                {nameValidation.message && (
                  <p
                    id="name-status"
                    className={`mt-1 text-xs flex items-center gap-1 ${
                      nameValidation.isAvailable ? 'text-green-600' : 'text-red-600'
                    }`}
                    role="status"
                  >
                    <span>{nameValidation.isAvailable ? '✓' : '⚠️'}</span>
                    {nameValidation.message}
                  </p>
                )}
                {error && error.includes('nome') && (
                  <p id="name-error" className="mt-1 text-xs text-red-600" role="alert">
                    {error}
                  </p>
                )}
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm hover:border-gray-400 transition-colors"
                  placeholder="Descreva a disciplina..."
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Ano Escolar * <span className="text-gray-500 font-normal">(selecione um)</span>
                </label>
                <p className="text-xs text-gray-500 mb-3">
                  Selecione o ano escolar para o qual esta disciplina será utilizada
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {SCHOOL_YEARS.map((year) => (
                    <button
                      key={year}
                      type="button"
                      onClick={() => selectSchoolYear(year)}
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
    </>
  );
}
