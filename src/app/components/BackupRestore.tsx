'use client';

import { useState, useRef } from 'react';
import { useToast } from '@/app/hooks';

/**
 * Componente de Backup e Restore
 * 
 * Permite exportar e importar dados do sistema
 * Útil para backup e migração de dados
 */
export function BackupRestore() {
  const [isOpen, setIsOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { showToast } = useToast();

  const exportData = async () => {
    try {
      setIsExporting(true);

      // Coleta todos os dados do localStorage
      const data = {
        subjects: localStorage.getItem('subjects') ? JSON.parse(localStorage.getItem('subjects') || '[]') : [],
        units: localStorage.getItem('units') ? JSON.parse(localStorage.getItem('units') || '[]') : [],
        lessonPlans: localStorage.getItem('lessonPlans') ? JSON.parse(localStorage.getItem('lessonPlans') || '[]') : [],
        activities: localStorage.getItem('activities') ? JSON.parse(localStorage.getItem('activities') || '[]') : [],
        exportedAt: new Date().toISOString(),
        version: '1.0',
      };

      // Cria arquivo JSON
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `backup-cultura-digital-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      showToast('Backup exportado com sucesso!', 'success');
      setIsOpen(false);
    } catch (error: any) {
      showToast(`Erro ao exportar backup: ${error.message}`, 'error');
    } finally {
      setIsExporting(false);
    }
  };

  const importData = async (file: File) => {
    try {
      const text = await file.text();
      const data = JSON.parse(text);

      // Valida estrutura do arquivo
      if (!data.version || !data.exportedAt) {
        throw new Error('Arquivo de backup inválido');
      }

      // Confirmação antes de importar
      const confirmed = confirm(
        '⚠️ ATENÇÃO: Esta ação irá substituir todos os seus dados atuais!\n\n' +
        'Deseja continuar?'
      );

      if (!confirmed) {
        return;
      }

      // Importa dados
      if (data.subjects) {
        localStorage.setItem('subjects', JSON.stringify(data.subjects));
      }
      if (data.units) {
        localStorage.setItem('units', JSON.stringify(data.units));
      }
      if (data.lessonPlans) {
        localStorage.setItem('lessonPlans', JSON.stringify(data.lessonPlans));
      }
      if (data.activities) {
        localStorage.setItem('activities', JSON.stringify(data.activities));
      }

      showToast('Dados importados com sucesso! Recarregue a página para ver as mudanças.', 'success');
      setIsOpen(false);

      // Recarrega após 1 segundo
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error: any) {
      showToast(`Erro ao importar backup: ${error.message}`, 'error');
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      importData(file);
    }
    // Limpa o input para permitir selecionar o mesmo arquivo novamente
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 right-6 w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110 flex items-center justify-center z-40"
        aria-label="Backup e Restore"
        title="Backup e Restore"
      >
        <span className="text-2xl">💾</span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-24 right-6 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 flex flex-col z-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-t-xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl">💾</span>
          <div>
            <h3 className="font-bold text-lg">Backup e Restore</h3>
            <p className="text-xs text-blue-100">Gerencie seus dados</p>
          </div>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="text-white hover:bg-white/20 rounded-lg p-1 transition-colors"
          aria-label="Fechar"
        >
          <span className="text-xl">✕</span>
        </button>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        {/* Exportar */}
        <div className="border border-gray-200 rounded-lg p-4">
          <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
            <span>📤</span>
            Exportar Backup
          </h4>
          <p className="text-sm text-gray-600 mb-3">
            Salve todos os seus dados em um arquivo JSON
          </p>
          <button
            onClick={exportData}
            disabled={isExporting}
            className="w-full px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm font-semibold"
          >
            {isExporting ? 'Exportando...' : '📥 Exportar Dados'}
          </button>
        </div>

        {/* Importar */}
        <div className="border border-gray-200 rounded-lg p-4">
          <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
            <span>📥</span>
            Importar Backup
          </h4>
          <p className="text-sm text-gray-600 mb-3">
            Restaure dados de um arquivo JSON de backup
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleFileSelect}
            className="hidden"
            id="backup-file-input"
          />
          <label
            htmlFor="backup-file-input"
            className="block w-full px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all text-sm font-semibold text-center cursor-pointer"
          >
            📤 Selecionar Arquivo
          </label>
        </div>

        <div className="text-xs text-gray-500 pt-2 border-t border-gray-200">
          💡 Dica: Faça backup regularmente para não perder seus dados
        </div>
      </div>
    </div>
  );
}
