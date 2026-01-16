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
    <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
      {/* Header */}
      <div className="flex justify-between items-start mb-8 pb-6 border-b border-gray-200">
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">{plan.title}</h1>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span className="flex items-center gap-1">
              <span className="text-lg">⏱️</span>
              {plan.duration} minutos
            </span>
          </div>
        </div>
        {onRegenerate && (
          <ActionButton
            onClick={onRegenerate}
            icon="🔄"
            variant="secondary"
            className="shadow-sm hover:shadow-md transition-shadow"
          >
            Regenerar
          </ActionButton>
        )}
      </div>

      {/* Conteúdo */}
      <div className="space-y-8">
        <Section
          title="Objetivo de Aprendizagem"
          content={plan.objective}
          icon="🎯"
          highlight
        />
        <Section title="Conteúdo" content={plan.content} icon="📚" />
        <Section title="Metodologia" content={plan.methodology} icon="📖" />

        {plan.resources && plan.resources.length > 0 && (
          <section className="bg-blue-50 rounded-lg p-6 border border-blue-100">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <span className="mr-2 text-2xl">🔧</span>
              Recursos Necessários
            </h2>
            <ul className="space-y-3">
              {plan.resources.map((resource, index) => (
                <li key={index} className="flex items-start gap-3 text-gray-700">
                  <span className="text-indigo-600 mt-1">•</span>
                  <span className="leading-relaxed">{resource}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        <Section title="Avaliação" content={plan.evaluation} icon="✅" />

        {plan.bnccAlignment && (
          <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl p-6 border-l-4 border-indigo-500 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <span className="mr-2 text-2xl">🎯</span>
              Alinhamento com BNCC
            </h2>
            <p className="text-gray-700 whitespace-pre-line leading-relaxed">
              {plan.bnccAlignment}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function Section({
  title,
  content,
  icon,
  highlight = false,
}: {
  title: string;
  content: string;
  icon?: string;
  highlight?: boolean;
}) {
  return (
    <section className={highlight ? 'bg-indigo-50 rounded-lg p-6 border border-indigo-100' : ''}>
      <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
        {icon && <span className="mr-2 text-2xl">{icon}</span>}
        {title}
      </h2>
      <p className="text-gray-700 whitespace-pre-line leading-relaxed text-base">{content}</p>
    </section>
  );
}
