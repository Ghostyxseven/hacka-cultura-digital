import { Activity, ActivityQuestion } from '@/core/entities/Activity';
import { AIService, AIGenerationRequest } from './AIService';
import { BNCCService } from './BNCCService';
import { Subject } from '@/core/entities/Subject';
import { Unit } from '@/core/entities/Unit';

export interface GenerateActivityParams {
  unit: Unit;
  subject: Subject;
  year?: string;
  activityType?: Activity['type'];
  numberOfQuestions?: number;
  additionalContext?: string;
}

/**
 * Gerador de Atividades Avaliativas usando IA
 * Gera atividades alinhadas à BNCC com foco em Cultura Digital
 */
export class ActivityGenerator {
  private aiService: AIService;
  private bnccService: BNCCService;

  constructor(aiService?: AIService, bnccService?: BNCCService) {
    this.aiService = aiService || new AIService();
    this.bnccService = bnccService || new BNCCService();
  }

  /**
   * Gera uma atividade avaliativa completa para uma unidade
   */
  async generate(params: GenerateActivityParams): Promise<Omit<Activity, 'id' | 'createdAt'>> {
    const basePrompt = this.bnccService.buildBasePrompt({
      component: params.subject.name,
      year: params.year || params.subject.schoolYears[0],
      theme: params.unit.theme,
      materialType: 'activity',
    });

    const specificPrompt = this.buildActivityPrompt(params, basePrompt);

    const aiRequest: AIGenerationRequest = {
      prompt: specificPrompt,
      maxTokens: 2000,
      temperature: 0.7,
    };

    const aiResponse = await this.aiService.generateText(aiRequest);
    const parsedContent = this.parseAIGeneratedContent(aiResponse.content);

    return {
      unitId: params.unit.id,
      title: parsedContent.title || `Atividade - ${params.unit.title}`,
      description: parsedContent.description || 'Atividade avaliativa relacionada à unidade',
      type: parsedContent.type || params.activityType || 'exercicio',
      questions: parsedContent.questions || [],
      instructions: parsedContent.instructions || 'Leia atentamente as questões e responda de forma clara e objetiva',
      evaluationCriteria: parsedContent.evaluationCriteria || 'Será avaliado: compreensão dos conceitos, clareza e adequação às diretrizes BNCC',
    };
  }

  /**
   * Constrói prompt específico para geração de atividade avaliativa
   */
  private buildActivityPrompt(
    params: GenerateActivityParams,
    basePrompt: string
  ): string {
    const numberOfQuestions = params.numberOfQuestions || 5;

    return `
${basePrompt}

TAREFA: Gerar uma atividade avaliativa completa em formato JSON para a seguinte unidade:

Disciplina: ${params.subject.name}
Unidade: ${params.unit.title}
Tema: ${params.unit.theme}
Tipo de atividade: ${params.activityType || 'exercício'}
Número de questões: ${numberOfQuestions}
${params.year ? `Ano/Série: ${params.year}` : ''}
${params.additionalContext ? `Contexto adicional: ${params.additionalContext}` : ''}

FORMATO DE RESPOSTA (JSON):
{
  "title": "Título da atividade",
  "description": "Descrição da atividade",
  "type": "exercicio",
  "questions": [
    {
      "id": "q1",
      "question": "Texto da questão",
      "type": "multiple_choice",
      "options": ["Opção A", "Opção B", "Opção C", "Opção D"],
      "correctAnswer": "Opção A",
      "points": 10
    }
  ],
  "instructions": "Instruções para o aluno",
  "evaluationCriteria": "Critérios de avaliação"
}

TIPOS DE QUESTÕES POSSÍVEIS:
- "multiple_choice": Múltipla escolha (requer options e correctAnswer)
- "open": Questão aberta (não requer options ou correctAnswer)
- "true_false": Verdadeiro ou Falso (requer correctAnswer: "true" ou "false")
- "essay": Dissertativa (não requer options ou correctAnswer)

IMPORTANTE:
- A atividade deve estar alinhada às competências BNCC de Cultura Digital
- Inclua uma variedade de tipos de questões
- Seja claro e objetivo
- Pontuação total sugerida: 100 pontos (distribuir entre questões)
    `.trim();
  }

  /**
   * Faz parse do conteúdo JSON gerado pela IA
   */
  private parseAIGeneratedContent(content: string): Partial<Activity> {
    try {
      // Tenta extrair JSON do conteúdo
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        // Garante que questions seja um array válido
        if (parsed.questions && Array.isArray(parsed.questions)) {
          parsed.questions = parsed.questions.map((q: any, index: number) => ({
            id: q.id || `q${index + 1}`,
            question: q.question || '',
            type: q.type || 'open',
            options: q.options || undefined,
            correctAnswer: q.correctAnswer || undefined,
            points: q.points || 10,
          }));
        }
        return parsed;
      }
      return JSON.parse(content);
    } catch (error) {
      console.error('Erro ao fazer parse do conteúdo gerado pela IA:', error);
      // Fallback: retorna estrutura básica com questões padrão
      return {
        title: 'Atividade Avaliativa - Cultura Digital',
        description: 'Atividade relacionada à unidade',
        type: 'exercicio',
        questions: [
          {
            id: 'q1',
            question: 'Explique os conceitos abordados nesta unidade',
            type: 'essay',
            points: 50,
          },
          {
            id: 'q2',
            question: 'Como você relacionaria os conteúdos com a BNCC?',
            type: 'open',
            points: 50,
          },
        ],
        instructions: 'Responda as questões de forma clara e objetiva',
        evaluationCriteria: 'Será avaliado: compreensão dos conceitos e alinhamento com BNCC',
      };
    }
  }
}
