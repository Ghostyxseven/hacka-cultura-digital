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

TAREFA: Gerar uma PROVA/ATIVIDADE AVALIATIVA COMPLETA e DETALHADA em formato JSON para a seguinte unidade:

Disciplina: ${params.subject.name}
Unidade: ${params.unit.title}
Tema: ${params.unit.theme}
Tipo de atividade: ${params.activityType || 'prova'}
Número de questões: ${numberOfQuestions}
${params.year ? `Ano/Série: ${params.year}` : ''}
${params.additionalContext ? `Contexto adicional: ${params.additionalContext}` : ''}

FORMATO DE RESPOSTA (JSON):
{
  "title": "PROVA DE [DISCIPLINA] - [TEMA] - [ANO/SÉRIE]",
  "description": "Descrição DETALHADA da atividade (mínimo 300 palavras). Inclua: objetivos da avaliação, competências e habilidades BNCC avaliadas, instruções gerais, tempo estimado, pontuação total, critérios de avaliação",
  "type": "prova",
  "questions": [
    {
      "id": "q1",
      "question": "Texto da questão DETALHADO e contextualizado. Questões devem ser: claras, alinhadas à BNCC, relacionadas ao tema de Cultura Digital, apropriadas para o ano/série",
      "type": "multiple_choice",
      "options": ["Opção A - descrita completa", "Opção B - descrita completa", "Opção C - descrita completa", "Opção D - descrita completa"],
      "correctAnswer": "Opção A",
      "points": 10,
      "bnccSkill": "Código BNCC (ex: EF04MA27)"
    }
  ],
  "instructions": "Instruções COMPLETAS para o aluno (mínimo 200 palavras). Inclua: como preencher, tempo disponível, forma de entrega, materiais permitidos, critérios de avaliação",
  "evaluationCriteria": "Critérios de avaliação DETALHADOS (mínimo 300 palavras). Inclua: rubrica de avaliação, pontuação por questão, níveis de desempenho (Excelente, Bom, Regular, Em desenvolvimento), habilidades específicas avaliadas"
}

TIPOS DE QUESTÕES POSSÍVEIS:
- "multiple_choice": Múltipla escolha (requer options e correctAnswer). Use para questões objetivas sobre conceitos.
- "open": Questão aberta (não requer options ou correctAnswer). Use para respostas curtas e diretas.
- "true_false": Verdadeiro ou Falso (requer correctAnswer: "true" ou "false"). Use para afirmações sobre segurança digital.
- "essay": Dissertativa (não requer options ou correctAnswer). Use para reflexões e análises críticas.

DISTRIBUIÇÃO SUGERIDA DE QUESTÕES:
- 40% Múltipla escolha (conceitos e definições)
- 30% Questões abertas (aplicação prática)
- 20% Dissertativas (análise crítica)
- 10% Verdadeiro/Falso (conceitos rápidos)

ESTRUTURA DAS QUESTÕES:
Cada questão deve incluir:
1. Enunciado claro e contextualizado
2. Contexto relacionado à Cultura Digital
3. Relação com habilidades BNCC
4. Dificuldade apropriada para o ano/série
5. Opções plausíveis e bem elaboradas (para múltipla escolha)

EXEMPLO DE BOA QUESTÃO (Múltipla Escolha):
{
  "id": "q1",
  "question": "Mariana, aluna do 4º ano, está navegando na internet e encontra um site que oferece um jogo gratuito. Para acessar, o site pede que ela digite seu endereço de casa e o telefone da mãe. Considerando o que aprendemos sobre navegação segura, o que Mariana deve fazer?",
  "type": "multiple_choice",
  "options": [
    "A) Informar os dados rapidamente para poder jogar",
    "B) Pedir ajuda de um adulto responsável antes de fornecer qualquer informação pessoal",
    "C) Fechar o site e procurar outro jogo em qualquer site",
    "D) Compartilhar apenas o telefone, mas não o endereço"
  ],
  "correctAnswer": "B) Pedir ajuda de um adulto responsável antes de fornecer qualquer informação pessoal",
  "points": 10,
  "bnccSkill": "EF04CI08 - Cultura Digital (Cidadania Digital)"
}

IMPORTANTE:
- A atividade DEVE estar extremamente alinhada às competências BNCC de Cultura Digital
- Inclua variedade de tipos de questões (mínimo 5 questões variadas)
- Seja MUITO claro, objetivo e pedagógico
- Questões devem avaliar competências, não apenas memorização
- Contextualize questões em situações reais de uso digital
- Pontuação total: 100 pontos (distribuir proporcionalmente)
- Cada questão deve ter habilidade BNCC associada
- Questões progressivas em dificuldade
- Inclua questões que avaliam pensamento crítico sobre tecnologia
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
