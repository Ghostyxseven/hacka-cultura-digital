'use client';

import Link from 'next/link';
import { AIConfigSettings } from '@/app/components';
import { useToast } from '@/app/hooks/useToast';
import { ToastContainer } from '@/app/components';

/**
 * Página de Configurações
 * Permite ao usuário configurar preferências do sistema, especialmente a escolha de IA
 */
export default function ConfiguracoesPage() {
  const { toasts, removeToast } = useToast();

  return (
    <>
      <ToastContainer toasts={toasts} onRemove={removeToast} />
      <div className="min-h-screen bg-gray-50">
        <div className="px-4 py-4 md:px-8 md:py-8">
          <div className="max-w-3xl mx-auto">
            <Link
              href="/professor"
              className="text-gray-600 hover:text-gray-900 mb-6 inline-flex items-center gap-2 text-sm font-medium transition-colors"
            >
              <span>←</span>
              <span>Voltar para Dashboard</span>
            </Link>

            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Configurações</h1>
              <p className="text-gray-600">
                Gerencie as preferências do sistema e escolha qual provedor de IA usar
              </p>
            </div>

            <AIConfigSettings />
          </div>
        </div>
      </div>
    </>
  );
}
