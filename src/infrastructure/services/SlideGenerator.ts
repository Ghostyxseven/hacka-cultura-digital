import { AIService, AIGenerationRequest } from './AIService';
import { BNCCService } from './BNCCService';
import { Subject } from '@/core/entities/Subject';
import { Unit } from '@/core/entities/Unit';
import { LessonPlan } from '@/core/entities/LessonPlan';

export interface GenerateSlidesParams {
  unit: Unit;
  subject: Subject;
  lessonPlan: LessonPlan;
  year?: string;
  additionalContext?: string;
}

export interface Slide {
  id: string;
  title: string;
  content: string;
  type: 'title' | 'content' | 'summary';
}

/**
 * Gerador de Slides usando IA
 * Gera slides de apresentação baseados no plano de aula
 */
export class SlideGenerator {
  private aiService: AIService;
  private bnccService: BNCCService;

  constructor(aiService?: AIService, bnccService?: BNCCService) {
    this.aiService = aiService || new AIService();
    this.bnccService = bnccService || new BNCCService();
  }

  /**
   * Gera slides de apresentação para uma unidade baseado no plano de aula
   */
  async generate(params: GenerateSlidesParams): Promise<Slide[]> {
    const basePrompt = this.bnccService.buildBasePrompt({
      component: params.subject.name,
      year: params.year || params.subject.schoolYears[0],
      theme: params.unit.theme,
      materialType: 'slides',
    });

    const specificPrompt = this.buildSlidesPrompt(params, basePrompt);

    const aiRequest: AIGenerationRequest = {
      prompt: specificPrompt,
      maxTokens: 3000,
      temperature: 0.7,
    };

    const aiResponse = await this.aiService.generateText(aiRequest);
    const slides = this.parseAIGeneratedContent(aiResponse.content, params.lessonPlan);

    return slides;
  }

  /**
   * Constrói prompt específico para geração de slides
   */
  private buildSlidesPrompt(
    params: GenerateSlidesParams,
    basePrompt: string
  ): string {
    return `
${basePrompt}

TAREFA: Gerar slides de apresentação em formato JSON para a seguinte unidade:

Disciplina: ${params.subject.name}
Unidade: ${params.unit.title}
Tema: ${params.unit.theme}
Objetivo da Aula: ${params.lessonPlan.objective}
Conteúdo da Aula: ${params.lessonPlan.content}
Metodologia: ${params.lessonPlan.methodology}
${params.year ? `Ano/Série: ${params.year}` : ''}
${params.additionalContext ? `Contexto adicional: ${params.additionalContext}` : ''}

FORMATO DE RESPOSTA (JSON - Array de slides):
[
  {
    "id": "slide-1",
    "title": "Título do Slide",
    "content": "Conteúdo principal do slide (texto formatado ou bullet points)",
    "type": "title"
  },
  {
    "id": "slide-2",
    "title": "Objetivos",
    "content": "Objetivo 1\nObjetivo 2\nObjetivo 3",
    "type": "content"
  }
]

TIPOS DE SLIDE:
- "title": Slide de título/apresentação
- "content": Slide com conteúdo principal (bullet points ou texto)
- "summary": Slide de resumo/conclusão

IMPORTANTE:
- Gere entre 8 a 15 slides
- Primeiro slide deve ser título da aula
- Último slide deve ser resumo/conclusão
- Slides intermediários devem cobrir o conteúdo do plano de aula
- Use bullet points (•) para listas
- Seja objetivo e direto (máximo 5-7 pontos por slide)
- Mantenha alinhamento com BNCC de Cultura Digital
- Cada slide deve ter no máximo 40 palavras
    `.trim();
  }

  /**
   * Faz parse do conteúdo JSON gerado pela IA
   */
  private parseAIGeneratedContent(content: string, lessonPlan: LessonPlan): Slide[] {
    try {
      // Tenta extrair JSON do conteúdo
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((slide, index) => ({
            id: slide.id || `slide-${index + 1}`,
            title: slide.title || `Slide ${index + 1}`,
            content: slide.content || '',
            type: slide.type || 'content',
          }));
        }
      }

      // Fallback: gera slides básicos a partir do plano de aula
      return this.generateFallbackSlides(lessonPlan);
    } catch (error) {
      console.error('Erro ao fazer parse dos slides gerados pela IA:', error);
      // Fallback: gera slides básicos a partir do plano de aula
      return this.generateFallbackSlides(lessonPlan);
    }
  }

  /**
   * Gera slides básicos como fallback baseado no plano de aula
   */
  private generateFallbackSlides(lessonPlan: LessonPlan): Slide[] {
    const slides: Slide[] = [
      {
        id: 'slide-1',
        title: lessonPlan.title,
        content: 'Apresentação da Aula',
        type: 'title',
      },
      {
        id: 'slide-2',
        title: 'Objetivos',
        content: lessonPlan.objective,
        type: 'content',
      },
      {
        id: 'slide-3',
        title: 'Conteúdo',
        content: lessonPlan.content.split('.').slice(0, 5).join('\n• '),
        type: 'content',
      },
      {
        id: 'slide-4',
        title: 'Metodologia',
        content: lessonPlan.methodology,
        type: 'content',
      },
      {
        id: 'slide-5',
        title: 'Recursos',
        content: lessonPlan.resources.map(r => `• ${r}`).join('\n'),
        type: 'content',
      },
      {
        id: 'slide-6',
        title: 'Avaliação',
        content: lessonPlan.evaluation,
        type: 'content',
      },
      {
        id: 'slide-7',
        title: 'Alinhamento BNCC',
        content: lessonPlan.bnccAlignment,
        type: 'content',
      },
      {
        id: 'slide-8',
        title: 'Resumo',
        content: 'Nesta aula abordamos os principais conceitos relacionados ao tema proposto.',
        type: 'summary',
      },
    ];

    return slides;
  }
}
