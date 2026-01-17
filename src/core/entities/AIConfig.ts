/**
 * Entidade de Domínio: Configuração de IA
 * 
 * Armazena a preferência do usuário sobre qual provedor de IA usar.
 * 
 * Clean Architecture: Core Layer - Entidade de Domínio
 */

export type AIProviderType = 'google' | 'openai' | 'auto';

export interface AIConfig {
  /** Tipo de provedor de IA preferido */
  provider: AIProviderType;
  /** Chave API personalizada do Google AI (opcional, sobrescreve env var) */
  googleApiKey?: string;
  /** Chave API personalizada do OpenAI (opcional, sobrescreve env var) */
  openaiApiKey?: string;
  /** Data da última atualização */
  updatedAt: string;
}

/**
 * Cria uma configuração padrão de IA
 */
export function createDefaultAIConfig(): AIConfig {
  return {
    provider: 'auto', // Auto-detecta baseado em variáveis de ambiente
    updatedAt: new Date().toISOString(),
  };
}

/**
 * Valida uma configuração de IA
 */
export function validateAIConfig(config: Partial<AIConfig>): boolean {
  if (!config.provider) {
    return false;
  }

  const validProviders: AIProviderType[] = ['google', 'openai', 'auto'];
  if (!validProviders.includes(config.provider)) {
    return false;
  }

  return true;
}

/**
 * Verifica quais provedores estão disponíveis (baseado em env vars)
 */
export function getAvailableProviders(): {
  google: boolean;
  openai: boolean;
  auto: boolean;
} {
  const googleApiKey = typeof window !== 'undefined' 
    ? (window as any).__NEXT_PUBLIC_GOOGLE_AI_API_KEY || ''
    : '';
  const openaiApiKey = typeof window !== 'undefined'
    ? (window as any).__NEXT_PUBLIC_OPENAI_API_KEY || ''
    : '';

  // Tenta pegar das env vars do servidor também
  const hasGoogleEnv = !!process.env.NEXT_PUBLIC_GOOGLE_AI_API_KEY;
  const hasOpenAIEnv = !!process.env.NEXT_PUBLIC_OPENAI_API_KEY;

  return {
    google: hasGoogleEnv || !!googleApiKey,
    openai: hasOpenAIEnv || !!openaiApiKey,
    auto: true, // Sempre disponível (auto-detecta)
  };
}
