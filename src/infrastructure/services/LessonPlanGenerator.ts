import { LessonPlan } from '@/core/entities/LessonPlan';
import { AIService, AIGenerationRequest } from './AIService';
import { BNCCService } from './BNCCService';
import { Subject } from '@/core/entities/Subject';
import { Unit } from '@/core/entities/Unit';

export interface GenerateLessonPlanParams {
  unit: Unit;
  subject: Subject;
  year?: string;
  additionalContext?: string;
}

/**
 * Gerador de Planos de Aula usando IA
 * Gera planos de aula alinhados à BNCC com foco em Cultura Digital
 */
export class LessonPlanGenerator {
  private aiService: AIService;
  private bnccService: BNCCService;

  constructor(aiService?: AIService, bnccService?: BNCCService) {
    this.aiService = aiService || new AIService();
    this.bnccService = bnccService || new BNCCService();
  }

  /**
   * Gera um plano de aula completo para uma unidade
   */
  async generate(params: GenerateLessonPlanParams): Promise<Omit<LessonPlan, 'id' | 'createdAt'>> {
    const basePrompt = this.bnccService.buildBasePrompt({
      component: params.subject.name,
      year: params.year || params.subject.schoolYears[0],
      theme: params.unit.theme,
      materialType: 'lesson_plan',
    });

    const specificPrompt = this.buildLessonPlanPrompt(params, basePrompt);

    const aiRequest: AIGenerationRequest = {
      prompt: specificPrompt,
      maxTokens: 2000,
      temperature: 0.7,
    };

    const aiResponse = await this.aiService.generateText(aiRequest);
    const parsedContent = this.parseAIGeneratedContent(aiResponse.content);

    return {
      unitId: params.unit.id,
      title: parsedContent.title || `${params.unit.title} - Plano de Aula`,
      objective: parsedContent.objective || 'Desenvolver competências de Cultura Digital',
      content: parsedContent.content || '',
      methodology: parsedContent.methodology || 'Aula expositiva com atividades práticas',
      resources: parsedContent.resources || [],
      evaluation: parsedContent.evaluation || 'Avaliação contínua através de atividades práticas',
      bnccAlignment: parsedContent.bnccAlignment || this.bnccService.getCultureDigitalGuidelines(),
      duration: parsedContent.duration || 50,
    };
  }

  /**
   * Constrói prompt específico para geração de plano de aula
   */
  private buildLessonPlanPrompt(
    params: GenerateLessonPlanParams,
    basePrompt: string
  ): string {
    return `
${basePrompt}

TAREFA: Gerar um plano de aula completo em formato JSON para a seguinte unidade:

Disciplina: ${params.subject.name}
Unidade: ${params.unit.title}
Tema: ${params.unit.theme}
${params.year ? `Ano/Série: ${params.year}` : ''}
${params.additionalContext ? `Contexto adicional: ${params.additionalContext}` : ''}

FORMATO DE RESPOSTA (JSON):
{
  "title": "Título do plano de aula",
  "objective": "Objetivo de aprendizagem específico",
  "content": "Conteúdo detalhado da aula",
  "methodology": "Metodologia de ensino proposta",
  "resources": ["Recurso 1", "Recurso 2", ...],
  "evaluation": "Como será avaliado o aprendizado",
  "bnccAlignment": "Alinhamento específico com BNCC",
  "duration": 50
}

IMPORTANTE:
- O plano deve estar alinhado às competências BNCC de Cultura Digital
- Seja específico e prático
- Inclua recursos digitais quando apropriado
- Defina duração em minutos (padrão: 50 minutos)
    `.trim();
  }

  /**
   * Faz parse do conteúdo JSON gerado pela IA
   */
  private parseAIGeneratedContent(content: string): Partial<LessonPlan> {
    try {
      // Tenta extrair JSON do conteúdo (pode vir com markdown ou texto adicional)
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      return JSON.parse(content);
    } catch (error) {
      console.error('Erro ao fazer parse do conteúdo gerado pela IA:', error);
      // Fallback: retorna estrutura básica
      return {
        title: 'Plano de Aula - Cultura Digital',
        objective: 'Desenvolver competências de Cultura Digital',
        content: content.substring(0, 500), // Primeiros 500 caracteres
      };
    }
  }
}
