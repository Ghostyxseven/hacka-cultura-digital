'use client';

interface ExportButtonProps {
  onExport?: () => void;
  disabled?: boolean;
}

/**
 * Botão para exportar materiais em PDF ou copiar
 * 
 * @example
 * ```tsx
 * <ExportButton onExport={handleExportPDF} />
 * ```
 */
export function ExportButton({ onExport, disabled = false }: ExportButtonProps) {
  const handleExport = () => {
    if (onExport) {
      onExport();
    } else {
      // Fallback: copiar para clipboard
      const content = document.querySelector('.export-content')?.textContent || '';
      navigator.clipboard.writeText(content);
      alert('Conteúdo copiado para a área de transferência!');
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={disabled}
      className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
      title="Exportar/Salvar em PDF"
    >
      <span className="mr-2 text-lg">📄</span>
      Exportar PDF
    </button>
  );
}
