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
      className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium shadow-sm"
      title="Exportar/Salvar em PDF"
    >
      <span className="mr-2">📄</span>
      Exportar PDF
    </button>
  );
}
