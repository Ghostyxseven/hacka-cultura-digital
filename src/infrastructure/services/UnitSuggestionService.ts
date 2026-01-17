import { Unit } from '@/core/entities/Unit';
import { Subject } from '@/core/entities/Subject';
import { AIService, AIGenerationRequest } from './AIService';
import { BNCCService } from './BNCCService';

export interface SuggestUnitsParams {
  subject: Subject;
  year?: string;
  numberOfSuggestions?: number;
}

export interface UnitSuggestion {
  title: string;
  theme: string;
}

/**
 * Serviço de Sugestão Automática de Unidades usando IA
 * Sugere unidades de ensino baseadas na disciplina e diretrizes BNCC
 */
export class UnitSuggestionService {
  private aiService: AIService;
  private bnccService: BNCCService;

  constructor(aiService?: AIService, bnccService?: BNCCService) {
    this.aiService = aiService || new AIService();
    this.bnccService = bnccService || new BNCCService();
  }

  /**
   * Sugere unidades de ensino automaticamente para uma disciplina
   */
  async suggestUnits(params: SuggestUnitsParams): Promise<UnitSuggestion[]> {
    const basePrompt = this.bnccService.buildBasePrompt({
      component: params.subject.name,
      year: params.year || params.subject.schoolYears[0],
      materialType: 'unit_suggestion',
    });

    const specificPrompt = this.buildSuggestionPrompt(params, basePrompt);

    const aiRequest: AIGenerationRequest = {
      prompt: specificPrompt,
      maxTokens: 3000, // Aumentado para evitar truncamento em sugestões detalhadas
      temperature: 0.8, // Mais criativo para sugestões
      detectTruncation: true, // Habilita detecção automática de truncamento
    };

    const aiResponse = await this.aiService.generateText(aiRequest);
    const parsedSuggestions = this.parseAIGeneratedSuggestions(aiResponse.content);

    return parsedSuggestions;
  }

  /**
   * Constrói prompt específico para sugestão de unidades
   */
  private buildSuggestionPrompt(
    params: SuggestUnitsParams,
    basePrompt: string
  ): string {
    const numberOfSuggestions = params.numberOfSuggestions || 5;

    return `
${basePrompt}

TAREFA: Sugerir unidades de ensino (aulas) em formato JSON para a seguinte disciplina:

Disciplina: ${params.subject.name}
${params.subject.description ? `Descrição: ${params.subject.description}` : ''}
Anos/Séries: ${params.subject.schoolYears.join(', ')}
${params.year ? `Ano/Série específica: ${params.year}` : ''}
Número de sugestões: ${numberOfSuggestions}

FORMATO DE RESPOSTA (JSON - array de objetos):
[
  {
    "title": "Título da unidade/aula",
    "theme": "Tema detalhado da unidade"
  },
  ...
]

CRITÉRIOS PARA AS SUGESTÕES:
- Devem estar alinhadas às competências BNCC de Cultura Digital
- Títulos claros e objetivos
- Temas relevantes e adequados ao nível educacional
- Progressão lógica entre as unidades (se possível)
- Variedade de abordagens e temas
- Foco em aspectos práticos e aplicáveis

IMPORTANTE:
- As sugestões devem ser práticas e viáveis
- Priorize temas que integrem tecnologias digitais
- Considere a série/ano informada
    `.trim();
  }

  /**
   * Faz parse das sugestões geradas pela IA
   */
  private parseAIGeneratedSuggestions(content: string): UnitSuggestion[] {
    try {
      // Tenta extrair JSON array do conteúdo
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        if (Array.isArray(parsed)) {
          return parsed
            .filter((item: any) => item.title && item.theme)
            .map((item: any) => ({
              title: item.title.trim(),
              theme: item.theme.trim(),
            }));
        }
      }

      // Tenta parse direto
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed)) {
        return parsed
          .filter((item: any) => item.title && item.theme)
          .map((item: any) => ({
            title: item.title.trim(),
            theme: item.theme.trim(),
          }));
      }

      return [];
    } catch (error) {
      console.error('Erro ao fazer parse das sugestões geradas pela IA:', error);
      // Fallback: retorna sugestões padrão
      return this.getDefaultSuggestions();
    }
  }

  /**
   * Retorna sugestões padrão quando a IA falha
   */
  private getDefaultSuggestions(): UnitSuggestion[] {
    return [
      {
        title: 'Introdução à Cultura Digital',
        theme: 'Conceitos fundamentais de tecnologias digitais, sua importância e impacto na sociedade contemporânea',
      },
      {
        title: 'Navegação Segura na Internet',
        theme: 'Práticas de segurança digital, privacidade online e proteção de dados pessoais',
      },
      {
        title: 'Criação de Conteúdos Digitais',
        theme: 'Ferramentas e técnicas para criação, edição e compartilhamento responsável de conteúdos digitais',
      },
      {
        title: 'Cidadania Digital',
        theme: 'Direitos e responsabilidades no ambiente digital, ética e comportamento online',
      },
      {
        title: 'Aplicações Práticas de Cultura Digital',
        theme: 'Projetos práticos utilizando tecnologias digitais para resolução de problemas',
      },
    ];
  }
}
