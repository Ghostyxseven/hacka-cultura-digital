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
    <div className="bg-white rounded-lg shadow-md p-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">{activity.title}</h2>

      <div className="space-y-6">
        <section>
          <p className="text-gray-700 whitespace-pre-line leading-relaxed">{activity.description}</p>
        </section>

        {activity.instructions && (
          <div className="bg-yellow-50 rounded-lg p-4 border-l-4 border-yellow-400">
            <h3 className="font-bold text-gray-800 mb-2 flex items-center">
              <span className="mr-2">📝</span>
              Instruções
            </h3>
            <p className="text-gray-700 whitespace-pre-line">{activity.instructions}</p>
          </div>
        )}

        {activity.questions && activity.questions.length > 0 && (
          <section>
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <span className="mr-2">❓</span>
              Questões ({activity.questions.length})
            </h3>
            <div className="space-y-6">
              {activity.questions.map((question, index) => (
                <QuestionCard key={question.id || index} question={question} index={index} />
              ))}
            </div>
          </section>
        )}

        {activity.evaluationCriteria && (
          <div className="bg-green-50 rounded-lg p-4 border-l-4 border-green-400">
            <h3 className="font-bold text-gray-800 mb-2 flex items-center">
              <span className="mr-2">✅</span>
              Critérios de Avaliação
            </h3>
            <p className="text-gray-700 whitespace-pre-line">{activity.evaluationCriteria}</p>
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
  const typeLabels = {
    multiple_choice: 'Múltipla Escolha',
    open: 'Aberta',
    true_false: 'Verdadeiro/Falso',
    essay: 'Dissertativa',
  };

  return (
    <div className="border-l-4 border-indigo-500 pl-4 py-2 bg-gray-50 rounded-r-lg">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h4 className="font-semibold text-gray-800">
              Questão {index + 1}
            </h4>
            <span className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded text-xs font-medium">
              {typeLabels[question.type] || question.type}
            </span>
            <span className="px-2 py-1 bg-gray-200 text-gray-700 rounded text-xs font-medium">
              {question.points} pontos
            </span>
          </div>
          <p className="text-gray-700 mb-3">{question.question}</p>
        </div>
      </div>

      {question.options && question.options.length > 0 && (
        <ul className="list-disc list-inside text-gray-600 space-y-1 ml-4">
          {question.options.map((option, optIndex) => (
            <li key={optIndex}>{option}</li>
          ))}
        </ul>
      )}

      {question.correctAnswer && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <p className="text-sm text-green-600 font-medium">
            ✓ Resposta correta: {question.correctAnswer}
          </p>
        </div>
      )}
    </div>
  );
}
