'use client';

import type { LessonPlan } from '@/application/viewmodels';
import { ActionButton } from './ActionButton';

interface LessonPlanViewProps {
  plan: LessonPlan;
  onRegenerate?: () => void;
}

/**
 * Componente de visualização de plano de aula
 * Exibe o plano de aula gerado de forma organizada
 */
export function LessonPlanView({ plan, onRegenerate }: LessonPlanViewProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-8">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">{plan.title}</h1>
          <p className="text-sm text-gray-500">Duração: {plan.duration} minutos</p>
        </div>
        {onRegenerate && (
          <ActionButton onClick={onRegenerate} icon="🔄" variant="secondary">
            Regenerar
          </ActionButton>
        )}
      </div>

      <div className="space-y-6">
        <Section title="Objetivo de Aprendizagem" content={plan.objective} />
        <Section title="Conteúdo" content={plan.content} />
        <Section title="Metodologia" content={plan.methodology} />

        {plan.resources && plan.resources.length > 0 && (
          <section>
            <h2 className="text-xl font-bold text-gray-800 mb-3">Recursos Necessários</h2>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              {plan.resources.map((resource, index) => (
                <li key={index} className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>{resource}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        <Section title="Avaliação" content={plan.evaluation} />

        {plan.bnccAlignment && (
          <div className="bg-indigo-50 rounded-lg p-6 border-l-4 border-indigo-500">
            <h2 className="text-xl font-bold text-gray-800 mb-3 flex items-center">
              <span className="mr-2">🎯</span>
              Alinhamento com BNCC
            </h2>
            <p className="text-gray-700 whitespace-pre-line text-sm leading-relaxed">
              {plan.bnccAlignment}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function Section({ title, content }: { title: string; content: string }) {
  return (
    <section>
      <h2 className="text-xl font-bold text-gray-800 mb-3">{title}</h2>
      <p className="text-gray-700 whitespace-pre-line leading-relaxed">{content}</p>
    </section>
  );
}
