// src/application/usecases/RefineLessonPlanIterativelyUseCase.ts
import { IAIService } from '../../infrastructure/ai/IAIService';
import { ILessonRepository } from '../../core/repositories/ILessonRepository';
import { LessonPlan } from '../../core/entities/LessonPlan';

/**
 * Histórico de refinamento
 */
export interface RefinementHistory {
  iteration: number;
  command: string;
  timestamp: Date;
  changes: string; // Descrição das mudanças feitas
}

/**
 * Resultado do refinamento iterativo
 */
export interface RefinementResult {
  lessonPlan: LessonPlan;
  history: RefinementHistory[];
  preview?: LessonPlan; // Preview antes de aplicar (opcional)
}

export interface RefineLessonPlanIterativelyRequest {
  lessonPlanId: string;
  command: string;
  previewOnly?: boolean; // Se true, retorna preview sem salvar
  maxIterations?: number; // Limite de iterações (padrão: 10)
}

/**
 * Caso de uso: Refinamento iterativo de planos de aula
 * Permite múltiplas iterações de refinamento com histórico
 */
export class RefineLessonPlanIterativelyUseCase {
  private refinementHistory: Map<string, RefinementHistory[]> = new Map();

  constructor(
    private aiService: IAIService,
    private lessonRepository: ILessonRepository
  ) {}

  async execute(request: RefineLessonPlanIterativelyRequest): Promise<RefinementResult> {
    const { lessonPlanId, command, previewOnly = false, maxIterations = 10 } = request;

    // Busca o plano atual
    let currentPlan = this.lessonRepository.getLessonPlanById(lessonPlanId);
    if (!currentPlan) {
      throw new Error(`Plano de aula com ID ${lessonPlanId} não encontrado`);
    }

    // Busca histórico de refinamentos
    const history = this.refinementHistory.get(lessonPlanId) || [];

    // Verifica limite de iterações
    if (history.length >= maxIterations) {
      throw new Error(`Limite de ${maxIterations} iterações atingido. Crie um novo plano para continuar refinando.`);
    }

    // Refina o plano
    const refinedPlan = await this.aiService.refinePlan(currentPlan, command);

    // Identifica mudanças (simplificado - pode ser melhorado)
    const changes = this.identifyChanges(currentPlan, refinedPlan);

    // Cria entrada no histórico
    const historyEntry: RefinementHistory = {
      iteration: history.length + 1,
      command,
      timestamp: new Date(),
      changes,
    };

    const updatedHistory = [...history, historyEntry];

    // Se for preview, retorna sem salvar
    if (previewOnly) {
      return {
        lessonPlan: refinedPlan,
        history: updatedHistory,
        preview: refinedPlan,
      };
    }

    // Salva o plano refinado (mantém o ID original)
    const planToSave: LessonPlan = {
      ...refinedPlan,
      id: lessonPlanId,
      metadata: {
        ...refinedPlan.metadata,
        promptVersion: `${refinedPlan.metadata.promptVersion}-refined-${historyEntry.iteration}`,
      },
    };

    this.lessonRepository.saveLessonPlan(planToSave);

    // Atualiza histórico
    this.refinementHistory.set(lessonPlanId, updatedHistory);

    return {
      lessonPlan: planToSave,
      history: updatedHistory,
    };
  }

  /**
   * Busca histórico de refinamentos de um plano
   */
  getHistory(lessonPlanId: string): RefinementHistory[] {
    return this.refinementHistory.get(lessonPlanId) || [];
  }

  /**
   * Identifica mudanças entre duas versões do plano
   */
  private identifyChanges(original: LessonPlan, refined: LessonPlan): string {
    const changes: string[] = [];

    if (original.title !== refined.title) {
      changes.push(`Título alterado: "${original.title}" → "${refined.title}"`);
    }

    if (original.methodology !== refined.methodology) {
      changes.push('Metodologia atualizada');
    }

    if (original.content !== refined.content) {
      changes.push('Conteúdo atualizado');
    }

    if (original.objectives.length !== refined.objectives.length) {
      changes.push(`Objetivos: ${original.objectives.length} → ${refined.objectives.length}`);
    }

    if (original.quiz.length !== refined.quiz.length) {
      changes.push(`Questões: ${original.quiz.length} → ${refined.quiz.length}`);
    }

    // Verifica mudanças nas competências BNCC
    const originalCompetencies = new Set(original.bnccCompetencies);
    const refinedCompetencies = new Set(refined.bnccCompetencies);
    const added = refined.bnccCompetencies.filter(c => !originalCompetencies.has(c));
    const removed = original.bnccCompetencies.filter(c => !refinedCompetencies.has(c));

    if (added.length > 0) {
      changes.push(`Competências adicionadas: ${added.join(', ')}`);
    }

    if (removed.length > 0) {
      changes.push(`Competências removidas: ${removed.join(', ')}`);
    }

    return changes.length > 0 ? changes.join('; ') : 'Ajustes gerais no plano';
  }
}
