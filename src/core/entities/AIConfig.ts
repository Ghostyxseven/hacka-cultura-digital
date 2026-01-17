/**
 * Entidade de Domínio: Configuração de IA
 * 
 * Armazena a preferência do usuário sobre qual provedor de IA usar.
 * 
 * Clean Architecture: Core Layer - Entidade de Domínio
 */

export type AIProviderType = 'google' | 'openai' | 'auto';

/**
 * Modelos disponíveis do Google Gemini
 * Apenas modelos que funcionam e estão disponíveis
 */
export type GoogleModel = 
  | 'gemini-2.5-flash'    // Rápido e eficiente (recomendado)
  | 'gemini-2.5-pro';     // Mais poderoso, melhor qualidade

/**
 * Modelos disponíveis do OpenAI
 */
export type OpenAIModel =
  | 'gpt-4o'              // Mais recente, otimizado (recomendado)
  | 'gpt-4-turbo'         // Alta performance
  | 'gpt-4'               // Poderoso, alta qualidade
  | 'gpt-3.5-turbo';      // Rápido e econômico

export interface AIConfig {
  /** Tipo de provedor de IA preferido */
  provider: AIProviderType;
  /** Modelo do Google AI a ser usado */
  googleModel?: GoogleModel;
  /** Modelo do OpenAI a ser usado */
  openaiModel?: OpenAIModel;
  /** Chave API personalizada do Google AI (opcional, sobrescreve env var) */
  googleApiKey?: string;
  /** Chave API personalizada do OpenAI (opcional, sobrescreve env var) */
  openaiApiKey?: string;
  /** Data da última atualização */
  updatedAt: string;
}

/**
 * Modelos padrão recomendados
 * Usando modelos mais baratos e rápidos por padrão
 */
export const DEFAULT_GOOGLE_MODEL: GoogleModel = 'gemini-2.5-flash'; // Rápido e barato
export const DEFAULT_OPENAI_MODEL: OpenAIModel = 'gpt-3.5-turbo'; // Mais barato e rápido

/**
 * Lista de modelos do Google com descrições
 * Apenas modelos que funcionam e estão disponíveis
 */
export const GOOGLE_MODELS: Array<{ value: GoogleModel; label: string; description: string }> = [
  { value: 'gemini-2.5-flash', label: 'Gemini 2.5 Flash', description: 'Rápido e eficiente (Recomendado)' },
  { value: 'gemini-2.5-pro', label: 'Gemini 2.5 Pro', description: 'Mais poderoso, melhor qualidade' },
];

/**
 * Lista de modelos do OpenAI com descrições
 * Ordenados do mais barato/rápido para o mais caro/poderoso
 */
export const OPENAI_MODELS: Array<{ value: OpenAIModel; label: string; description: string }> = [
  { value: 'gpt-3.5-turbo', label: 'GPT-3.5 Turbo', description: 'Mais barato e rápido (Recomendado)' },
  { value: 'gpt-4o', label: 'GPT-4o', description: 'Mais recente, otimizado' },
  { value: 'gpt-4-turbo', label: 'GPT-4 Turbo', description: 'Alta performance' },
  { value: 'gpt-4', label: 'GPT-4', description: 'Poderoso, alta qualidade' },
];

/**
 * Cria uma configuração padrão de IA
 */
export function createDefaultAIConfig(): AIConfig {
  return {
    provider: 'auto', // Auto-detecta baseado em variáveis de ambiente
    googleModel: DEFAULT_GOOGLE_MODEL,
    openaiModel: DEFAULT_OPENAI_MODEL,
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
