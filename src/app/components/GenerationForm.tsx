'use client';

import { useState } from 'react';

interface GenerationFormProps {
  onSubmit: (data: { year?: string; additionalContext?: string }) => Promise<void>;
  loading?: boolean;
}

/**
 * Componente de formulário para geração de materiais
 * Usado na página de geração de plano de aula
 */
export function GenerationForm({ onSubmit, loading }: GenerationFormProps) {
  const [formData, setFormData] = useState({
    year: '',
    additionalContext: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({
      year: formData.year || undefined,
      additionalContext: formData.additionalContext || undefined,
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-8 mb-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Gerar Materiais Didáticos</h1>
      <p className="text-gray-600 mb-6">
        Gere automaticamente um plano de aula e uma atividade avaliativa alinhados à BNCC usando
        Inteligência Artificial.
      </p>

      <form onSubmit={handleSubmit}>
        <div className="space-y-4 mb-6">
          <div>
            <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-2">
              Ano/Série (opcional)
            </label>
            <input
              type="text"
              id="year"
              value={formData.year}
              onChange={(e) => setFormData({ ...formData, year: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Ex: 7º ano, 1º ano EM"
            />
            <p className="text-gray-500 text-xs mt-1">
              Informe o ano/série para melhor alinhamento com a BNCC
            </p>
          </div>

          <div>
            <label
              htmlFor="additionalContext"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Contexto Adicional (opcional)
            </label>
            <textarea
              id="additionalContext"
              value={formData.additionalContext}
              onChange={(e) => setFormData({ ...formData, additionalContext: e.target.value })}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Informações adicionais sobre a aula, alunos, recursos disponíveis..."
            />
            <p className="text-gray-500 text-xs mt-1">
              Informe detalhes que podem ajudar na geração de materiais mais adequados
            </p>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></span>
              Gerando Materiais...
            </span>
          ) : (
            '✨ Gerar Plano de Aula e Atividade'
          )}
        </button>
      </form>
    </div>
  );
}
