/**
 * Serviço de Integração com IA Generativa
 * Suporta múltiplos provedores (OpenAI, mock para desenvolvimento)
 */

export interface AIGenerationRequest {
  prompt: string;
  maxTokens?: number;
  temperature?: number;
}

export interface AIGenerationResponse {
  content: string;
  model?: string;
  tokensUsed?: number;
}

/**
 * Interface para provedores de IA
 */
export interface AIProvider {
  generateText(request: AIGenerationRequest): Promise<AIGenerationResponse>;
}

/**
 * Provedor Mock - Usado quando não há chave API ou para desenvolvimento
 */
export class MockAIProvider implements AIProvider {
  async generateText(request: AIGenerationRequest): Promise<AIGenerationResponse> {
    // Simula delay de API
    await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 2000));

    // Gera resposta mockada baseada no prompt
    const mockResponse = this.generateMockResponse(request.prompt);

    return {
      content: mockResponse,
      model: 'mock-model-v1',
      tokensUsed: Math.floor(mockResponse.length / 4),
    };
  }

  private generateMockResponse(prompt: string): string {
    // Analisa o tipo de material solicitado
    if (prompt.includes('plano de aula') || prompt.includes('lesson plan')) {
      return this.generateMockLessonPlan();
    } else if (prompt.includes('atividade') || prompt.includes('activity')) {
      return this.generateMockActivity();
    } else if (prompt.includes('sugestão') || prompt.includes('suggestion')) {
      return this.generateMockUnitSuggestion();
    }

    return 'Conteúdo gerado pela IA. Configure uma chave API do OpenAI para obter conteúdo real.';
  }

  private generateMockLessonPlan(): string {
    return JSON.stringify({
      title: 'Plano de Aula - Cultura Digital',
      objective: 'Compreender e utilizar tecnologias digitais de forma crítica e ética',
      content: 'Conceitos fundamentais de Cultura Digital, navegação segura na internet, criação de conteúdos digitais responsáveis',
      methodology: 'Aula expositiva dialogada com atividades práticas no laboratório de informática',
      resources: ['Computadores', 'Projetor', 'Internet', 'Plataformas educacionais digitais'],
      evaluation: 'Participação nas atividades práticas e elaboração de conteúdo digital',
      bnccAlignment: 'Competência 5 da BNCC - Compreender, utilizar e criar tecnologias digitais de forma crítica',
      duration: 50,
    }, null, 2);
  }

  private generateMockActivity(): string {
    return JSON.stringify({
      title: 'Atividade Avaliativa - Cultura Digital',
      description: 'Atividade prática para avaliar compreensão dos conceitos de Cultura Digital',
      type: 'trabalho',
      questions: [
        {
          id: 'q1',
          question: 'Explique o que significa usar tecnologias digitais de forma crítica',
          type: 'essay',
          points: 10,
        },
        {
          id: 'q2',
          question: 'Cite três princípios éticos para uso da internet',
          type: 'open',
          points: 15,
        },
      ],
      instructions: 'Responda as questões de forma clara e objetiva, demonstrando compreensão dos conceitos abordados',
      evaluationCriteria: 'Serão avaliados: clareza da argumentação, domínio dos conceitos e adequação às diretrizes éticas',
    }, null, 2);
  }

  private generateMockUnitSuggestion(): string {
    return JSON.stringify([
      {
        title: 'Introdução à Cultura Digital',
        theme: 'Conceitos básicos de tecnologias digitais e sua importância na sociedade contemporânea',
      },
      {
        title: 'Navegação Segura na Internet',
        theme: 'Práticas de segurança digital, privacidade e proteção de dados pessoais',
      },
      {
        title: 'Criação de Conteúdos Digitais',
        theme: 'Ferramentas e técnicas para criação e edição de conteúdos digitais responsáveis',
      },
    ], null, 2);
  }
}

/**
 * Provedor OpenAI - Integração real com API do OpenAI
 */
export class OpenAIProvider implements AIProvider {
  private apiKey: string;
  private baseUrl: string;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.NEXT_PUBLIC_OPENAI_API_KEY || '';
    this.baseUrl = 'https://api.openai.com/v1';
  }

  async generateText(request: AIGenerationRequest): Promise<AIGenerationResponse> {
    if (!this.apiKey) {
      throw new Error('Chave API do OpenAI não configurada. Configure NEXT_PUBLIC_OPENAI_API_KEY');
    }

    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: 'Você é um assistente pedagógico especializado em materiais didáticos alinhados à BNCC.',
            },
            {
              role: 'user',
              content: request.prompt,
            },
          ],
          max_tokens: request.maxTokens || 2000,
          temperature: request.temperature || 0.7,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`Erro na API OpenAI: ${error.error?.message || 'Erro desconhecido'}`);
      }

      const data = await response.json();
      const content = data.choices[0]?.message?.content || '';

      return {
        content,
        model: data.model,
        tokensUsed: data.usage?.total_tokens,
      };
    } catch (error) {
      console.error('Erro ao gerar texto com OpenAI:', error);
      throw error;
    }
  }
}

/**
 * Serviço principal de IA - Gerencia qual provedor usar
 */
export class AIService {
  private provider: AIProvider;

  constructor(provider?: AIProvider) {
    // Se não for fornecido um provedor, tenta usar OpenAI ou fallback para Mock
    if (provider) {
      this.provider = provider;
    } else {
      const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
      this.provider = apiKey ? new OpenAIProvider(apiKey) : new MockAIProvider();
    }
  }

  async generateText(request: AIGenerationRequest): Promise<AIGenerationResponse> {
    return this.provider.generateText(request);
  }

  /**
   * Verifica se o serviço está usando um provedor real ou mock
   */
  isUsingMockProvider(): boolean {
    return this.provider instanceof MockAIProvider;
  }
}
