'use client';

import { useState, FormEvent, useEffect } from 'react';

interface GenerationFormProps {
  onSubmit: (data: { year?: string; additionalContext?: string }) => Promise<void>;
  loading?: boolean;
  defaultYear?: string; // Ano escolar padrão da disciplina
}

/**
 * Componente de formulário para geração de materiais
 * Usado na página de geração de plano de aula
 */
export function GenerationForm({ onSubmit, loading, defaultYear }: GenerationFormProps) {
  const [formData, setFormData] = useState({
    year: defaultYear || '',
    additionalContext: '',
  });

  // Atualiza o ano quando defaultYear mudar
  useEffect(() => {
    if (defaultYear && !formData.year) {
      setFormData((prev) => ({ ...prev, year: defaultYear }));
    }
  }, [defaultYear, formData.year]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await onSubmit({
      year: formData.year || undefined,
      additionalContext: formData.additionalContext || undefined,
    });
  };

  return (
    <div className="bg-gradient-to-br from-white to-indigo-50/30 rounded-xl shadow-lg p-8 mb-6 max-w-2xl mx-auto border border-gray-200">
      <div className="mb-6 pb-6 border-b border-gray-200">
        <h1 className="text-3xl font-bold text-gray-900 mb-3 flex items-center gap-3">
          <span className="text-3xl">✨</span>
          Gerar Materiais Didáticos
        </h1>
        <p className="text-gray-600 leading-relaxed">
          Gere automaticamente um plano de aula e uma atividade avaliativa alinhados à BNCC usando
          Inteligência Artificial.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="space-y-6 mb-8">
          <div>
            <label htmlFor="year" className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <span className="text-lg">🎓</span>
              Ano/Série <span className="text-gray-500 font-normal">(opcional)</span>
            </label>
            <input
              type="text"
              id="year"
              value={formData.year}
              onChange={(e) => setFormData({ ...formData, year: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm hover:border-gray-400 transition-colors"
              placeholder="Ex: 7º ano, 1º ano EM"
            />
            <p className="text-gray-500 text-xs mt-2 leading-relaxed">
              Informe o ano/série para melhor alinhamento com a BNCC
            </p>
          </div>

          <div>
            <label
              htmlFor="additionalContext"
              className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2"
            >
              <span className="text-lg">📝</span>
              Contexto Adicional <span className="text-gray-500 font-normal">(opcional)</span>
            </label>
            <textarea
              id="additionalContext"
              value={formData.additionalContext}
              onChange={(e) => setFormData({ ...formData, additionalContext: e.target.value })}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm hover:border-gray-400 transition-colors"
              placeholder="Informações adicionais sobre a aula, alunos, recursos disponíveis..."
            />
            <p className="text-gray-500 text-xs mt-2 leading-relaxed">
              Informe detalhes que podem ajudar na geração de materiais mais adequados
            </p>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full px-8 py-4 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-xl hover:from-indigo-700 hover:to-indigo-800 transition-all shadow-lg hover:shadow-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95 disabled:transform-none"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-3">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Gerando Materiais com IA...</span>
            </span>
          ) : (
            <>
              <span className="mr-2">✨</span>
              Gerar Plano de Aula e Atividade
            </>
          )}
        </button>
      </form>
    </div>
  );
}
