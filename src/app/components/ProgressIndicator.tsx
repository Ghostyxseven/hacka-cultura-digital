'use client';

/**
 * Componente de indicador de progresso
 * Mostra progresso de operações assíncronas (geração de IA)
 */

interface ProgressIndicatorProps {
  /** Etapa atual da operação */
  currentStep: string;
  /** Lista de etapas */
  steps?: string[];
  /** Porcentagem de progresso (0-100) */
  progress?: number;
  /** Mensagem opcional */
  message?: string;
}

/**
 * Indicador de progresso linear
 */
export function ProgressIndicator({
  currentStep,
  steps = [],
  progress,
  message,
}: ProgressIndicatorProps) {
  const progressPercentage = progress || 0;
  const currentStepIndex = steps.findIndex((step) => step === currentStep);

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200 max-w-2xl mx-auto">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">Gerando Materiais com IA</h3>
        {message && <p className="text-gray-600 text-sm">{message}</p>}
      </div>

      {/* Barra de progresso */}
      <div className="mb-4">
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div
            className="bg-gradient-to-r from-indigo-600 to-purple-600 h-3 rounded-full transition-all duration-500 ease-out relative"
            style={{ width: `${progressPercentage}%` }}
          >
            <div className="absolute inset-0 bg-white opacity-30 animate-pulse"></div>
          </div>
        </div>
        {progress !== undefined && (
          <div className="text-right text-xs text-gray-500 mt-1">{Math.round(progressPercentage)}%</div>
        )}
      </div>

      {/* Etapas */}
      {steps.length > 0 && (
        <div className="space-y-2">
          {steps.map((step, index) => {
            const isCompleted = index < currentStepIndex;
            const isCurrent = index === currentStepIndex;
            const isPending = index > currentStepIndex;

            return (
              <div key={index} className="flex items-center gap-3">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold transition-all ${
                    isCompleted
                      ? 'bg-green-500 text-white'
                      : isCurrent
                      ? 'bg-indigo-600 text-white animate-pulse'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {isCompleted ? '✓' : index + 1}
                </div>
                <span
                  className={`text-sm transition-colors ${
                    isCompleted
                      ? 'text-green-600 font-medium'
                      : isCurrent
                      ? 'text-indigo-600 font-semibold'
                      : 'text-gray-400'
                  }`}
                >
                  {step}
                </span>
                {isCurrent && (
                  <div className="ml-auto">
                    <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Etapa atual se não houver lista de etapas */}
      {steps.length === 0 && currentStep && (
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-gray-700 font-medium">{currentStep}</span>
        </div>
      )}
    </div>
  );
}

/**
 * Indicador de progresso circular
 */
export function CircularProgress({ progress = 0, message }: { progress?: number; message?: string }) {
  const progressPercentage = Math.min(100, Math.max(0, progress));
  const circumference = 2 * Math.PI * 36; // raio = 36
  const offset = circumference - (progressPercentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className="relative w-24 h-24">
        <svg className="transform -rotate-90" width="96" height="96">
          <circle
            cx="48"
            cy="48"
            r="36"
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            className="text-gray-200"
          />
          <circle
            cx="48"
            cy="48"
            r="36"
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="text-indigo-600 transition-all duration-500"
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xl font-bold text-gray-900">{Math.round(progressPercentage)}%</span>
        </div>
      </div>
      {message && <p className="mt-4 text-gray-600 font-medium text-center max-w-xs">{message}</p>}
    </div>
  );
}
