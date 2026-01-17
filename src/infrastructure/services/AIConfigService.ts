/**
 * Serviço de Configurações de IA
 * 
 * Gerencia preferências do usuário sobre qual provedor de IA usar.
 * Armazena configurações no localStorage.
 * 
 * Clean Architecture: Infrastructure Layer - Serviço de Infraestrutura
 */

import { AIConfig, createDefaultAIConfig, validateAIConfig, AIProviderType, getAvailableProviders } from '@/core/entities/AIConfig';

const STORAGE_KEY = 'ai_config';

export class AIConfigService {
  /**
   * Busca a configuração atual de IA
   */
  getConfig(): AIConfig {
    if (typeof window === 'undefined') {
      return createDefaultAIConfig();
    }

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        return createDefaultAIConfig();
      }

      const config = JSON.parse(stored) as AIConfig;
      if (!validateAIConfig(config)) {
        return createDefaultAIConfig();
      }

      return config;
    } catch (error) {
      console.error('Erro ao ler configuração de IA:', error);
      return createDefaultAIConfig();
    }
  }

  /**
   * Salva a configuração de IA
   */
  saveConfig(config: Partial<AIConfig>): AIConfig {
    if (typeof window === 'undefined') {
      throw new Error('localStorage não está disponível');
    }

    const currentConfig = this.getConfig();
    const updatedConfig: AIConfig = {
      ...currentConfig,
      ...config,
      updatedAt: new Date().toISOString(),
    };

    if (!validateAIConfig(updatedConfig)) {
      throw new Error('Configuração de IA inválida');
    }

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedConfig));
      return updatedConfig;
    } catch (error) {
      console.error('Erro ao salvar configuração de IA:', error);
      throw new Error('Falha ao salvar configuração de IA');
    }
  }

  /**
   * Define o provedor de IA preferido
   */
  setProvider(provider: AIProviderType): AIConfig {
    return this.saveConfig({ provider });
  }

  /**
   * Define chave API personalizada do Google AI
   */
  setGoogleApiKey(apiKey: string): AIConfig {
    return this.saveConfig({ googleApiKey: apiKey });
  }

  /**
   * Define chave API personalizada do OpenAI
   */
  setOpenAIApiKey(apiKey: string): AIConfig {
    return this.saveConfig({ openaiApiKey: apiKey });
  }

  /**
   * Remove chave API personalizada
   */
  clearApiKey(provider: 'google' | 'openai'): AIConfig {
    if (provider === 'google') {
      return this.saveConfig({ googleApiKey: undefined });
    } else {
      return this.saveConfig({ openaiApiKey: undefined });
    }
  }

  /**
   * Retorna quais provedores estão disponíveis
   * Verifica env vars E chaves personalizadas do usuário
   */
  getAvailableProviders(): {
    google: boolean;
    openai: boolean;
    auto: boolean;
  } {
    // Verifica env vars
    const googleEnv = typeof process !== 'undefined' && !!process.env?.NEXT_PUBLIC_GOOGLE_AI_API_KEY;
    const openaiEnv = typeof process !== 'undefined' && !!process.env?.NEXT_PUBLIC_OPENAI_API_KEY;

    // Verifica também chaves personalizadas do usuário
    const config = this.getConfig();
    const hasGoogleKey = !!config.googleApiKey || googleEnv;
    const hasOpenAIKey = !!config.openaiApiKey || openaiEnv;

    return {
      google: hasGoogleKey,
      openai: hasOpenAIKey,
      auto: true, // Sempre disponível
    };
  }

  /**
   * Reseta para configuração padrão
   */
  reset(): AIConfig {
    if (typeof window === 'undefined') {
      return createDefaultAIConfig();
    }

    try {
      localStorage.removeItem(STORAGE_KEY);
      return createDefaultAIConfig();
    } catch (error) {
      console.error('Erro ao resetar configuração de IA:', error);
      return createDefaultAIConfig();
    }
  }
}
