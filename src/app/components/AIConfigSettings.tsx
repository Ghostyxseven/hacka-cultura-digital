'use client';

import { useState, useEffect, FormEvent } from 'react';
import { AIConfigService } from '@/infrastructure/services/AIConfigService';
import { AIProviderType } from '@/core/entities/AIConfig';
import { useToast } from '@/app/hooks/useToast';

interface AIConfigSettingsProps {
  onClose?: () => void;
  className?: string;
}

/**
 * Componente de configurações de IA
 * Permite ao usuário escolher qual provedor de IA usar
 */
export function AIConfigSettings({ onClose, className = '' }: AIConfigSettingsProps) {
  const [configService] = useState(() => new AIConfigService());
  const [selectedProvider, setSelectedProvider] = useState<AIProviderType>('auto');
  const [googleApiKey, setGoogleApiKey] = useState('');
  const [openaiApiKey, setOpenaiApiKey] = useState('');
  const [showApiKeys, setShowApiKeys] = useState(false);
  const [availableProviders, setAvailableProviders] = useState({
    google: false,
    openai: false,
    auto: true,
  });
  const [saving, setSaving] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    // Carrega configuração atual
    const config = configService.getConfig();
    setSelectedProvider(config.provider);
    setGoogleApiKey(config.googleApiKey || '');
    setOpenaiApiKey(config.openaiApiKey || '');
    setAvailableProviders(configService.getAvailableProviders());
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Salva configuração
      const config = configService.saveConfig({
        provider: selectedProvider,
        googleApiKey: googleApiKey.trim() || undefined,
        openaiApiKey: openaiApiKey.trim() || undefined,
      });

      showToast('Configuração de IA salva com sucesso!', 'success');
      
      // Recarrega a página para aplicar as mudanças
      setTimeout(() => {
        window.location.reload();
      }, 500);
    } catch (error: any) {
      showToast(error.message || 'Erro ao salvar configuração', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (!confirm('Tem certeza que deseja resetar as configurações de IA para o padrão?')) {
      return;
    }

    try {
      configService.reset();
      const config = configService.getConfig();
      setSelectedProvider(config.provider);
      setGoogleApiKey('');
      setOpenaiApiKey('');
      showToast('Configurações resetadas para o padrão', 'success');
    } catch (error: any) {
      showToast(error.message || 'Erro ao resetar configuração', 'error');
    }
  };

  return (
    <div className={`bg-white rounded-xl shadow-lg p-6 border border-gray-200 ${className}`}>
      <div className="mb-6 pb-4 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
          <span className="text-2xl">🤖</span>
          Configurações de IA
        </h2>
        <p className="text-gray-600 text-sm">
          Escolha qual provedor de IA usar para gerar os materiais didáticos
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="space-y-6 mb-6">
          {/* Seleção de Provedor */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Provedor de IA *
            </label>
            <div className="space-y-3">
              <label className="flex items-center p-4 border-2 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                <input
                  type="radio"
                  name="provider"
                  value="auto"
                  checked={selectedProvider === 'auto'}
                  onChange={(e) => setSelectedProvider(e.target.value as AIProviderType)}
                  className="mr-3 w-4 h-4 text-indigo-600 focus:ring-indigo-500"
                />
                <div className="flex-1">
                  <div className="font-semibold text-gray-900">Auto (Recomendado)</div>
                  <div className="text-sm text-gray-600">
                    Detecta automaticamente qual IA está disponível
                    {availableProviders.google && availableProviders.openai && ' (Google AI ou OpenAI)'}
                    {availableProviders.google && !availableProviders.openai && ' (Google AI)'}
                    {!availableProviders.google && availableProviders.openai && ' (OpenAI)'}
                    {!availableProviders.google && !availableProviders.openai && ' (Mock - Sem chaves configuradas)'}
                  </div>
                </div>
                {selectedProvider === 'auto' && (
                  <span className="ml-2 text-indigo-600">✓</span>
                )}
              </label>

              <label className={`flex items-center p-4 border-2 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors ${
                !availableProviders.google ? 'opacity-50 cursor-not-allowed' : ''
              }`}>
                <input
                  type="radio"
                  name="provider"
                  value="google"
                  checked={selectedProvider === 'google'}
                  onChange={(e) => setSelectedProvider(e.target.value as AIProviderType)}
                  disabled={!availableProviders.google}
                  className="mr-3 w-4 h-4 text-indigo-600 focus:ring-indigo-500 disabled:opacity-50"
                />
                <div className="flex-1">
                  <div className="font-semibold text-gray-900 flex items-center gap-2">
                    Google Gemini
                    {!availableProviders.google && (
                      <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-700 rounded">
                        Não configurado
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-gray-600">
                    Usa o modelo Gemini 2.5 Flash (rápido e eficiente)
                  </div>
                </div>
                {selectedProvider === 'google' && (
                  <span className="ml-2 text-indigo-600">✓</span>
                )}
              </label>

              <label className={`flex items-center p-4 border-2 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors ${
                !availableProviders.openai ? 'opacity-50 cursor-not-allowed' : ''
              }`}>
                <input
                  type="radio"
                  name="provider"
                  value="openai"
                  checked={selectedProvider === 'openai'}
                  onChange={(e) => setSelectedProvider(e.target.value as AIProviderType)}
                  disabled={!availableProviders.openai}
                  className="mr-3 w-4 h-4 text-indigo-600 focus:ring-indigo-500 disabled:opacity-50"
                />
                <div className="flex-1">
                  <div className="font-semibold text-gray-900 flex items-center gap-2">
                    OpenAI GPT
                    {!availableProviders.openai && (
                      <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-700 rounded">
                        Não configurado
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-gray-600">
                    Usa o modelo GPT-3.5 Turbo
                  </div>
                </div>
                {selectedProvider === 'openai' && (
                  <span className="ml-2 text-indigo-600">✓</span>
                )}
              </label>
            </div>
          </div>

          {/* Chaves API Personalizadas (Opcional) */}
          <div>
            <button
              type="button"
              onClick={() => setShowApiKeys(!showApiKeys)}
              className="text-sm text-indigo-600 hover:text-indigo-700 font-medium mb-3 flex items-center gap-2"
            >
              <span>{showApiKeys ? '▼' : '▶'}</span>
              Chaves API Personalizadas (Opcional)
            </button>
            {showApiKeys && (
              <div className="space-y-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div>
                  <label htmlFor="googleApiKey" className="block text-sm font-medium text-gray-700 mb-2">
                    Google AI API Key
                  </label>
                  <input
                    type="password"
                    id="googleApiKey"
                    value={googleApiKey}
                    onChange={(e) => setGoogleApiKey(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Deixe vazio para usar variável de ambiente"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Sobrescreve NEXT_PUBLIC_GOOGLE_AI_API_KEY se fornecida
                  </p>
                </div>
                <div>
                  <label htmlFor="openaiApiKey" className="block text-sm font-medium text-gray-700 mb-2">
                    OpenAI API Key
                  </label>
                  <input
                    type="password"
                    id="openaiApiKey"
                    value={openaiApiKey}
                    onChange={(e) => setOpenaiApiKey(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Deixe vazio para usar variável de ambiente"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Sobrescreve NEXT_PUBLIC_OPENAI_API_KEY se fornecida
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Botões de Ação */}
        <div className="flex gap-3 pt-4 border-t border-gray-200">
          <button
            type="submit"
            disabled={saving}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-xl hover:from-indigo-700 hover:to-indigo-800 transition-all font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? 'Salvando...' : 'Salvar Configuração'}
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all font-semibold border border-gray-300"
          >
            Resetar
          </button>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all font-semibold border border-gray-300"
            >
              Fechar
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
