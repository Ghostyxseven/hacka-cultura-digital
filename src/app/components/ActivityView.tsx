'use client';

import type { Activity } from '@/application/viewmodels';

interface ActivityViewProps {
  activity: Activity;
}

/**
 * Componente de visualização de atividade avaliativa
 * Exibe a atividade gerada de forma organizada
 */
export function ActivityView({ activity }: ActivityViewProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
      {/* Header */}
      <div className="mb-8 pb-6 border-b border-gray-200">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">{activity.title}</h2>
        <div className="flex items-center gap-2 mt-3">
          <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-medium">
            {activity.type}
          </span>
          {activity.questions && (
            <span className="text-sm text-gray-600">
              {activity.questions.length} questão{activity.questions.length !== 1 ? 'ões' : ''}
            </span>
          )}
        </div>
      </div>

      <div className="space-y-8">
        {/* Descrição */}
        <section className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
            <span className="mr-2 text-xl">📋</span>
            Descrição
          </h3>
          <p className="text-gray-700 whitespace-pre-line leading-relaxed">{activity.description}</p>
        </section>

        {/* Instruções */}
        {activity.instructions && (
          <div className="bg-yellow-50 rounded-lg p-6 border-l-4 border-yellow-400 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-3 flex items-center text-lg">
              <span className="mr-2 text-xl">📝</span>
              Instruções para o Aluno
            </h3>
            <p className="text-gray-700 whitespace-pre-line leading-relaxed">{activity.instructions}</p>
          </div>
        )}

        {/* Questões */}
        {activity.questions && activity.questions.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900 flex items-center">
                <span className="mr-2 text-2xl">❓</span>
                Questões
              </h3>
              <span className="px-4 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium">
                {activity.questions.length} questão{activity.questions.length !== 1 ? 'ões' : ''}
              </span>
            </div>
            <div className="space-y-6">
              {activity.questions.map((question, index) => (
                <QuestionCard key={question.id || index} question={question} index={index} />
              ))}
            </div>
          </section>
        )}

        {/* Critérios de Avaliação */}
        {activity.evaluationCriteria && (
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border-l-4 border-green-500 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-3 flex items-center text-lg">
              <span className="mr-2 text-xl">✅</span>
              Critérios de Avaliação
            </h3>
            <p className="text-gray-700 whitespace-pre-line leading-relaxed">{activity.evaluationCriteria}</p>
          </div>
        )}
      </div>
    </div>
  );
}

function QuestionCard({
  question,
  index,
}: {
  question: Activity['questions'][0];
  index: number;
}) {
  const typeLabels: Record<string, string> = {
    multiple_choice: 'Múltipla Escolha',
    open: 'Aberta',
    true_false: 'Verdadeiro/Falso',
    essay: 'Dissertativa',
  };

  const typeIcons: Record<string, string> = {
    multiple_choice: '☑️',
    open: '✍️',
    true_false: '✓',
    essay: '📝',
  };

  return (
    <div className="bg-white rounded-xl border-2 border-indigo-200 shadow-md hover:shadow-lg transition-all p-6">
      {/* Header da Questão */}
      <div className="flex items-start justify-between mb-4 pb-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-md">
            {index + 1}
          </div>
          <div>
            <h4 className="font-bold text-gray-900 text-lg mb-1">Questão {index + 1}</h4>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-semibold flex items-center gap-1">
                <span>{typeIcons[question.type] || '❓'}</span>
                {typeLabels[question.type] || question.type}
              </span>
              <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                {question.points} ponto{question.points !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Enunciado da Questão */}
      <div className="mb-5">
        <p className="text-gray-800 leading-relaxed text-base font-medium">
          {question.question}
        </p>
      </div>

      {/* Alternativas (se múltipla escolha) */}
      {question.options && question.options.length > 0 && (
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-5 mb-5 border border-gray-200">
          <p className="text-sm font-bold text-gray-700 mb-4 uppercase tracking-wide">
            Alternativas:
          </p>
          <div className="space-y-3">
            {question.options.map((option, optIndex) => {
              const letter = String.fromCharCode(65 + optIndex);
              const isCorrect = question.correctAnswer?.toUpperCase() === letter || 
                               question.correctAnswer?.toLowerCase() === option.toLowerCase();
              return (
                <div
                  key={optIndex}
                  className={`
                    flex items-start gap-3 p-3 rounded-lg transition-all
                    ${isCorrect ? 'bg-green-50 border-2 border-green-300' : 'bg-white border border-gray-200'}
                  `}
                >
                  <span
                    className={`
                      w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm
                      ${isCorrect
                        ? 'bg-green-500 text-white shadow-md'
                        : 'bg-indigo-100 text-indigo-700'}
                    `}
                  >
                    {letter}
                  </span>
                  <span
                    className={`flex-1 pt-1 ${
                      isCorrect ? 'text-green-800 font-medium' : 'text-gray-700'
                    }`}
                  >
                    {option}
                  </span>
                  {isCorrect && (
                    <span className="text-green-600 text-xl" title="Resposta correta">
                      ✓
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Resposta Correta (se especificada) */}
      {question.correctAnswer && (!question.options || question.options.length === 0) && (
        <div className="mt-4 pt-4 border-t-2 border-green-300 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4">
          <p className="text-sm text-green-800 font-bold flex items-center gap-2 uppercase tracking-wide">
            <span className="text-xl">✓</span>
            Resposta Correta:
          </p>
          <p className="text-green-900 font-semibold mt-2 text-base ml-7">
            {question.correctAnswer}
          </p>
        </div>
      )}
    </div>
  );
}
