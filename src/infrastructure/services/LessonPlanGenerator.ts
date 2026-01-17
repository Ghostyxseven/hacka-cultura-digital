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
      maxTokens: 8000, // Aumentado para evitar truncamento em planos detalhados
      temperature: 0.7,
      detectTruncation: true, // Habilita detecção automática de truncamento
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

TAREFA: Gerar um plano de aula COMPLETO e DETALHADO em formato JSON para a seguinte unidade:

Disciplina: ${params.subject.name}
Unidade: ${params.unit.title}
Tema: ${params.unit.theme}
${params.year ? `Ano/Série: ${params.year}` : ''}
${params.additionalContext ? `Contexto adicional: ${params.additionalContext}` : ''}

FORMATO DE RESPOSTA (JSON):
{
  "title": "Título completo do plano de aula",
  "objective": "Objetivo de aprendizagem específico e claro (máximo 300 palavras). Inclua habilidades BNCC trabalhadas (códigos como EF04MA27, EF15LP01, etc.)",
  "content": "Conteúdo DETALHADO da aula com no mínimo 800 palavras. Organize em seções: 1) Tema Principal, 2) Objetivos de Aprendizagem com códigos BNCC, 3) Habilidades de Cultura Digital, 4) Competências Gerais da BNCC, 5) Desenvolvimento da aula (Momento Inicial, Desenvolvimento, Fechamento), 6) Atividades Práticas com descrição detalhada, 7) Recursos necessários",
  "methodology": "Metodologia de ensino DETALHADA (mínimo 400 palavras). Descreva passo a passo: estratégias de engajamento, atividades práticas, adaptações para diferentes contextos tecnológicos, formas de interação, materiais alternativos",
  "resources": ["Lista detalhada de recursos", "Computadores/tablets", "Acesso à internet OU alternativas offline", "Materiais impressos", "Recursos digitais específicos"],
  "evaluation": "Avaliação DETALHADA (mínimo 300 palavras). Inclua: critérios de avaliação baseados nas habilidades BNCC, formas de acompanhamento (formativa e somativa), atividades de reforço, conexão com a família, rubrica de avaliação",
  "bnccAlignment": "Alinhamento COMPLETO com BNCC (mínimo 400 palavras). Liste: competências gerais desenvolvidas, habilidades específicas com códigos, eixos de Cultura Digital trabalhados (Letramento Digital, Cidadania Digital, etc.), conexões entre áreas do conhecimento",
  "duration": 50
}

ESTRUTURA ESPERADA NO CONTEÚDO:
O campo "content" deve seguir esta estrutura detalhada:

# TEMA E OBJETIVOS
## Tema Principal
[Descrição clara do tema]

## Objetivos de Aprendizagem
- [Código BNCC] - [Descrição do objetivo]
- [Código BNCC] - [Descrição do objetivo]

## Habilidades de Cultura Digital Trabalhadas
- Eixo 1 - LETRAMENTO DIGITAL: [Descrição]
- Eixo 2 - CIDADANIA DIGITAL: [Descrição]
- Eixo 3 - TRABALHO E PROJETO DE VIDA: [Se aplicável]

# COMPETÊNCIAS TRABALHADAS
## Competências Gerais da BNCC Desenvolvidas
- Competência X: [Descrição]

## Relação com Habilidades Específicas
[Descrição das conexões]

# DURAÇÃO E RECURSOS
## Tempo Estimado
[Especificar duração]

## Materiais Necessários
[Lista detalhada com alternativas para recursos limitados]

# DESENVOLVIMENTO
## Momento Inicial - Engajamento ([X] minutos)
[Descrição detalhada]

## Desenvolvimento - Atividades Principais ([X] minutos)
[Atividades passo a passo]

## Fechamento - Síntese e Avaliação ([X] minutos)
[Descrição detalhada]

# ATIVIDADES PRÁTICAS
## Atividade Prática 1: [Nome]
[Descrição completa com adaptações]

# AVALIAÇÃO
## Critérios de Avaliação
[Baseados em habilidades BNCC]

## Formas de Acompanhamento
[Formativa e somativa]

IMPORTANTE:
- O plano DEVE estar extremamente alinhado às competências BNCC de Cultura Digital
- Seja MUITO específico e prático
- Inclua recursos digitais E alternativas offline
- Adapte para diferentes contextos tecnológicos
- Mínimo de 2000 palavras no total do conteúdo
- Use códigos de habilidades BNCC (ex: EF04MA27, EF15LP01)
- Mencione os 5 eixos de Cultura Digital quando aplicável
- Defina duração em minutos (padrão: 50 minutos, mas pode ser mais)
- Seja pedagógico e didático
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
