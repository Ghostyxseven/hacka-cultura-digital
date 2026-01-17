/**
 * Serviço de Integração com IA Generativa
 * Suporta múltiplos provedores (Google Gemini, OpenAI, mock para desenvolvimento)
 */

export interface AIGenerationRequest {
  prompt: string;
  maxTokens?: number;
  temperature?: number;
  /** Se true, detecta e retenta respostas truncadas automaticamente */
  detectTruncation?: boolean;
}

export interface AIGenerationResponse {
  content: string;
  model?: string;
  tokensUsed?: number;
}

/**
 * Tipos de erros da API
 */
export enum AIErrorType {
  NETWORK_ERROR = 'NETWORK_ERROR',
  API_KEY_INVALID = 'API_KEY_INVALID',
  RATE_LIMIT = 'RATE_LIMIT',
  QUOTA_EXCEEDED = 'QUOTA_EXCEEDED',
  INVALID_REQUEST = 'INVALID_REQUEST',
  SERVER_ERROR = 'SERVER_ERROR',
  UNKNOWN = 'UNKNOWN',
}

/**
 * Erro customizado da API de IA com tipo e mensagem específica
 */
export class AIError extends Error {
  constructor(
    message: string,
    public type: AIErrorType,
    public originalError?: any,
    public retryable: boolean = false
  ) {
    super(message);
    this.name = 'AIError';
  }
}

/**
 * Interface para provedores de IA
 */
export interface AIProvider {
  generateText(request: AIGenerationRequest, maxRetries?: number): Promise<AIGenerationResponse>;
}

/**
 * Provedor Mock - Usado quando não há chave API ou para desenvolvimento
 */
export class MockAIProvider implements AIProvider {
  async generateText(request: AIGenerationRequest, maxRetries?: number): Promise<AIGenerationResponse> {
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
 * Provedor Google Gemini - Integração com Google AI (Gemini API)
 */
export class GoogleAIProvider implements AIProvider {
  private apiKey: string;
  private baseUrl: string;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.NEXT_PUBLIC_GOOGLE_AI_API_KEY || '';
    // Usando v1 ao invés de v1beta para modelos mais recentes
    this.baseUrl = 'https://generativelanguage.googleapis.com/v1';
  }

  private parseError(error: any, status?: number): AIError {
    // Erros de rede
    if (error instanceof TypeError && error.message.includes('fetch')) {
      return new AIError(
        'Erro de conexão com a API. Verifique sua conexão com a internet e tente novamente.',
        AIErrorType.NETWORK_ERROR,
        error,
        true
      );
    }

    // Erros de status HTTP
    if (status === 400) {
      return new AIError(
        'Requisição inválida. Verifique os parâmetros e tente novamente.',
        AIErrorType.INVALID_REQUEST,
        error,
        false
      );
    }

    if (status === 401 || status === 403) {
      return new AIError(
        'Chave API inválida ou sem permissão. Verifique sua chave API do Google AI.',
        AIErrorType.API_KEY_INVALID,
        error,
        false
      );
    }

    if (status === 429) {
      return new AIError(
        'Limite de requisições excedido. Aguarde alguns instantes e tente novamente.',
        AIErrorType.RATE_LIMIT,
        error,
        true
      );
    }

    if (status === 503 || status === 504) {
      return new AIError(
        'Serviço temporariamente indisponível. Tente novamente em alguns instantes.',
        AIErrorType.SERVER_ERROR,
        error,
        true
      );
    }

    if (status && status >= 500) {
      return new AIError(
        'Erro no servidor da API. Tente novamente mais tarde.',
        AIErrorType.SERVER_ERROR,
        error,
        true
      );
    }

    // Erro genérico
    const message = error?.error?.message || error?.message || 'Erro desconhecido ao gerar conteúdo';
    return new AIError(
      `Erro na API Google Gemini: ${message}`,
      AIErrorType.UNKNOWN,
      error,
      false
    );
  }

  async generateText(
    request: AIGenerationRequest,
    maxRetries: number = 3
  ): Promise<AIGenerationResponse> {
    if (!this.apiKey) {
      throw new AIError(
        'Chave API do Google AI não configurada. Configure NEXT_PUBLIC_GOOGLE_AI_API_KEY',
        AIErrorType.API_KEY_INVALID
      );
    }

    let lastError: AIError | null = null;

    // Retry lógico com backoff exponencial
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        // Usando gemini-2.5-flash (mais recente e rápido) ou gemini-2.5-pro (mais poderoso)
        const model = 'models/gemini-2.5-flash';
        const url = `${this.baseUrl}/${model}:generateContent?key=${this.apiKey}`;

        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `Você é um assistente pedagógico especializado em materiais didáticos alinhados à BNCC.\n\n${request.prompt}`,
                  },
                ],
              },
            ],
            generationConfig: {
              temperature: request.temperature || 0.7,
              maxOutputTokens: request.maxTokens || 2000,
            },
          }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          const error = this.parseError(errorData, response.status);

          // Se não for retryable, lança imediatamente
          if (!error.retryable || attempt === maxRetries - 1) {
            throw error;
          }

          lastError = error;
          // Backoff exponencial: 1s, 2s, 4s
          await new Promise((resolve) => setTimeout(resolve, Math.pow(2, attempt) * 1000));
          continue;
        }

        const data = await response.json();
        const candidate = data.candidates?.[0];
        const content = candidate?.content?.parts?.[0]?.text || '';
        const finishReason = candidate?.finishReason || candidate?.finish_reason || '';

        // Detecta se a resposta foi truncada (finishReason indica truncamento por limite de tokens)
        const isTruncatedByMaxTokens = finishReason === 'MAX_TOKENS' || 
                                       finishReason === 'MAX_OUTPUT_TOKENS';

        // Detecta se a resposta parece incompleta (termina abruptamente sem pontuação final)
        const endsAbruptly = content.trim().length > 500 && 
                            !content.trim().match(/[.!?]"?\s*$/) && 
                            !content.trim().endsWith('}') && 
                            !content.trim().endsWith(']');

        if (!content) {
          throw new AIError(
            'A API retornou uma resposta vazia. Tente novamente.',
            AIErrorType.INVALID_REQUEST,
            data,
            true
          );
        }

        // Se detectar truncamento e detectTruncation estiver habilitado, retenta com mais tokens
        if ((isTruncatedByMaxTokens || endsAbruptly) && 
            (request.detectTruncation !== false) && 
            attempt < maxRetries - 1) {
          console.warn(`Resposta truncada ou incompleta detectada (finishReason: ${finishReason}, endsAbruptly: ${endsAbruptly}). Retentando com mais tokens...`);
          lastError = new AIError(
            'Resposta foi truncada. Tentando novamente com mais tokens...',
            AIErrorType.UNKNOWN,
            { finishReason, contentLength: content.length },
            true
          );
          // Aumenta maxTokens para próxima tentativa (dobra ou usa mínimo de 4000)
          request.maxTokens = Math.max((request.maxTokens || 2000) * 2, 4000);
          await new Promise((resolve) => setTimeout(resolve, Math.pow(2, attempt) * 1000));
          continue;
        }

        return {
          content,
          model: 'gemini-2.5-flash',
          tokensUsed: data.usageMetadata?.totalTokenCount,
        };
      } catch (error) {
        if (error instanceof AIError) {
          if (!error.retryable || attempt === maxRetries - 1) {
            throw error;
          }
          lastError = error;
          // Backoff exponencial
          await new Promise((resolve) => setTimeout(resolve, Math.pow(2, attempt) * 1000));
          continue;
        }

        // Erro de rede ou outro erro não tipado
        const aiError = this.parseError(error);
        if (!aiError.retryable || attempt === maxRetries - 1) {
          throw aiError;
        }
        lastError = aiError;
        // Backoff exponencial
        await new Promise((resolve) => setTimeout(resolve, Math.pow(2, attempt) * 1000));
      }
    }

    // Se chegou aqui, todas as tentativas falharam
    throw lastError || new AIError('Erro ao gerar conteúdo após múltiplas tentativas', AIErrorType.UNKNOWN);
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

  async generateText(request: AIGenerationRequest, maxRetries: number = 3): Promise<AIGenerationResponse> {
    if (!this.apiKey) {
      throw new AIError(
        'Chave API do OpenAI não configurada. Configure NEXT_PUBLIC_OPENAI_API_KEY',
        AIErrorType.API_KEY_INVALID
      );
    }

    let lastError: AIError | null = null;

    // Retry lógico com backoff exponencial
    for (let attempt = 0; attempt < maxRetries; attempt++) {
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
          const errorData = await response.json().catch(() => ({}));
          const error = this.parseError(errorData, response.status);

          if (!error.retryable || attempt === maxRetries - 1) {
            throw error;
          }

          lastError = error;
          await new Promise((resolve) => setTimeout(resolve, Math.pow(2, attempt) * 1000));
          continue;
        }

        const data = await response.json();
        const choice = data.choices?.[0];
        const content = choice?.message?.content || '';
        const finishReason = choice?.finish_reason || '';

        if (!content) {
          throw new AIError(
            'A API retornou uma resposta vazia. Tente novamente.',
            AIErrorType.INVALID_REQUEST,
            data,
            true
          );
        }

        // Detecta se a resposta foi truncada (OpenAI retorna 'length' quando atinge max_tokens)
        const isTruncatedByMaxTokens = finishReason === 'length';

        // Detecta se a resposta parece incompleta (termina abruptamente sem pontuação final)
        const endsAbruptly = content.trim().length > 500 && 
                            !content.trim().match(/[.!?]"?\s*$/) && 
                            !content.trim().endsWith('}') && 
                            !content.trim().endsWith(']') &&
                            !content.trim().endsWith('...');

        // Se detectar truncamento e detectTruncation estiver habilitado, retenta com mais tokens
        if ((isTruncatedByMaxTokens || endsAbruptly) && 
            (request.detectTruncation !== false) && 
            attempt < maxRetries - 1) {
          console.warn(`Resposta truncada ou incompleta detectada (finish_reason: ${finishReason}, endsAbruptly: ${endsAbruptly}). Retentando com mais tokens...`);
          // Aumenta maxTokens para próxima tentativa (dobra ou usa mínimo de 4000)
          request.maxTokens = Math.max((request.maxTokens || 2000) * 2, 4000);
          await new Promise((resolve) => setTimeout(resolve, Math.pow(2, attempt) * 1000));
          continue;
        }

        return {
          content,
          model: data.model,
          tokensUsed: data.usage?.total_tokens,
        };
      } catch (error) {
        if (error instanceof AIError) {
          if (!error.retryable || attempt === maxRetries - 1) {
            throw error;
          }
          lastError = error;
          await new Promise((resolve) => setTimeout(resolve, Math.pow(2, attempt) * 1000));
          continue;
        }

        const aiError = this.parseError(error);
        if (!aiError.retryable || attempt === maxRetries - 1) {
          throw aiError;
        }
        lastError = aiError;
        await new Promise((resolve) => setTimeout(resolve, Math.pow(2, attempt) * 1000));
      }
    }

    throw lastError || new AIError('Erro ao gerar conteúdo após múltiplas tentativas', AIErrorType.UNKNOWN);
  }

  private parseError(error: any, status?: number): AIError {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      return new AIError(
        'Erro de conexão com a API. Verifique sua conexão com a internet e tente novamente.',
        AIErrorType.NETWORK_ERROR,
        error,
        true
      );
    }

    if (status === 401 || status === 403) {
      return new AIError(
        'Chave API inválida ou sem permissão. Verifique sua chave API do OpenAI.',
        AIErrorType.API_KEY_INVALID,
        error,
        false
      );
    }

    if (status === 429) {
      return new AIError(
        'Limite de requisições excedido. Aguarde alguns instantes e tente novamente.',
        AIErrorType.RATE_LIMIT,
        error,
        true
      );
    }

    if (status && status >= 500) {
      return new AIError(
        'Erro no servidor da API. Tente novamente mais tarde.',
        AIErrorType.SERVER_ERROR,
        error,
        true
      );
    }

    const message = error?.error?.message || error?.message || 'Erro desconhecido ao gerar conteúdo';
    return new AIError(
      `Erro na API OpenAI: ${message}`,
      AIErrorType.UNKNOWN,
      error,
      false
    );
  }
}

/**
 * Serviço principal de IA - Gerencia qual provedor usar
 * Agora usa configuração do usuário se disponível
 */
export class AIService {
  private provider: AIProvider;

  constructor(provider?: AIProvider, preferredProvider?: 'google' | 'openai' | 'auto') {
    // Se não for fornecido um provedor, usa a lógica de seleção
    if (provider) {
      this.provider = provider;
    } else {
      this.provider = this.selectProvider(preferredProvider);
    }
  }

  /**
   * Seleciona o provedor baseado na preferência do usuário ou auto-detecta
   */
  private selectProvider(preferredProvider?: 'google' | 'openai' | 'auto'): AIProvider {
    // Tenta importar o serviço de configuração (só funciona no cliente)
    let userConfig: { provider?: string; googleApiKey?: string; openaiApiKey?: string } | null = null;
    
    if (typeof window !== 'undefined') {
      try {
        // Importa dinamicamente para evitar erro de SSR
        const { AIConfigService } = require('./AIConfigService');
        const configService = new AIConfigService();
        userConfig = configService.getConfig();
      } catch (error) {
        // Se não conseguir carregar, continua com auto-detect
        console.warn('Não foi possível carregar configuração de IA:', error);
      }
    }

    // Determina qual provedor usar
    const providerToUse = preferredProvider || userConfig?.provider || 'auto';

    // Obtém chaves API (preferência: config do usuário > env vars)
    const googleApiKey = userConfig?.googleApiKey || process.env.NEXT_PUBLIC_GOOGLE_AI_API_KEY || '';
    const openAiApiKey = userConfig?.openaiApiKey || process.env.NEXT_PUBLIC_OPENAI_API_KEY || '';

    // Seleciona o provedor baseado na preferência
    if (providerToUse === 'google') {
      if (googleApiKey) {
        return new GoogleAIProvider(googleApiKey);
      }
      // Fallback se não tiver chave mas usuário escolheu Google
      if (openAiApiKey) {
        return new OpenAIProvider(openAiApiKey);
      }
      return new MockAIProvider();
    }

    if (providerToUse === 'openai') {
      if (openAiApiKey) {
        return new OpenAIProvider(openAiApiKey);
      }
      // Fallback se não tiver chave mas usuário escolheu OpenAI
      if (googleApiKey) {
        return new GoogleAIProvider(googleApiKey);
      }
      return new MockAIProvider();
    }

    // Auto-detect: Google AI > OpenAI > Mock
    if (googleApiKey) {
      return new GoogleAIProvider(googleApiKey);
    }
    if (openAiApiKey) {
      return new OpenAIProvider(openAiApiKey);
    }
    return new MockAIProvider();
  }

  async generateText(request: AIGenerationRequest, maxRetries: number = 3): Promise<AIGenerationResponse> {
    return this.provider.generateText(request, maxRetries);
  }

  /**
   * Verifica se o serviço está usando um provedor real ou mock
   */
  isUsingMockProvider(): boolean {
    return this.provider instanceof MockAIProvider;
  }
}
