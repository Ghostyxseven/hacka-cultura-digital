import { AIService, AIGenerationRequest } from './AIService';
import { BNCCService } from './BNCCService';
import { Subject } from '@/core/entities/Subject';
import { Unit } from '@/core/entities/Unit';
import { LessonPlan } from '@/core/entities/LessonPlan';
import type { Slide } from '@/application/viewmodels';

export interface GenerateSlidesParams {
  unit: Unit;
  subject: Subject;
  lessonPlan: LessonPlan;
  year?: string;
  additionalContext?: string;
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

TAREFA: Gerar slides de apresentação DETALHADOS em formato JSON para a seguinte unidade:

Disciplina: ${params.subject.name}
Unidade: ${params.unit.title}
Tema: ${params.unit.theme}
Objetivo da Aula: ${params.lessonPlan.objective}
Conteúdo da Aula: ${params.lessonPlan.content}
Metodologia: ${params.lessonPlan.methodology}
Recursos: ${params.lessonPlan.resources.join(', ')}
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
    "title": "Objetivos de Aprendizagem",
    "content": "• Objetivo 1 (Código BNCC)\n• Objetivo 2 (Código BNCC)\n• Objetivo 3 (Código BNCC)",
    "type": "content"
  }
]

ESTRUTURA ESPERADA DOS SLIDES:
1. Slide de Título (apresentação do tema)
2. Slide de Objetivos (habilidades BNCC)
3. Slide de Competências (BNCC e Cultura Digital)
4. Slides de Conteúdo Principal (desenvolvimento do tema)
5. Slides de Atividades (práticas)
6. Slide de Recursos (materiais necessários)
7. Slide de Avaliação (critérios)
8. Slide de Resumo/Conclusão

TIPOS DE SLIDE:
- "title": Slide de título/apresentação (primeiro slide)
- "content": Slide com conteúdo principal (bullet points ou texto)
- "summary": Slide de resumo/conclusão (último slide)

FORMATO DO CONTEÚDO:
- Use bullet points (•) para listas
- Máximo 6-8 pontos por slide
- Cada ponto com no máximo 10 palavras
- Use emojis quando apropriado (📚, 🎯, 🔒, etc.)
- Seja visual e objetivo

IMPORTANTE:
- Gere entre 10 a 18 slides (abrangente mas não exaustivo)
- Primeiro slide: título da aula + ano/série
- Slides intermediários: cobrir TODO o conteúdo do plano detalhadamente
- Último slide: resumo/conclusão + próximos passos
- Cada slide máximo 50 palavras
- Mantenha alinhamento rigoroso com BNCC de Cultura Digital
- Slides progressivos em complexidade
- Inclua slides sobre segurança digital e cidadania digital
- Use linguagem apropriada para o ano/série
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
