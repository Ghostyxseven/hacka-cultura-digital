'use client';

import { useState, useRef, useEffect } from 'react';
import type { LessonPlan, Activity } from '@/application/viewmodels';
import { exportToMarkdown, exportToHTML, downloadFile, exportToPDF } from '@/app/utils/exportUtils';

interface ExportButtonProps {
  onExport?: () => void;
  lessonPlan?: LessonPlan | null;
  activity?: Activity | null;
  disabled?: boolean;
}

/**
 * Botão para exportar materiais em múltiplos formatos (PDF, Markdown, Word/HTML)
 * 
 * @example
 * ```tsx
 * <ExportButton onExport={handleExportPDF} lessonPlan={plan} activity={act} />
 * ```
 */
export function ExportButton({ onExport, lessonPlan, activity, disabled = false }: ExportButtonProps) {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMenu]);

  const handleExportPDF = () => {
    if (onExport) {
      onExport();
    } else if (lessonPlan) {
      const htmlContent = exportToHTML(lessonPlan, activity || null);
      const fullHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${lessonPlan.title}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      line-height: 1.6; color: #333; padding: 40px; background: white;
    }
    h1 { color: #1e3a8a; margin-bottom: 10px; font-size: 28px; }
    h2 { color: #1e40af; margin-top: 30px; margin-bottom: 15px; font-size: 22px; border-bottom: 2px solid #3b82f6; padding-bottom: 5px; }
    p { margin-bottom: 12px; text-align: justify; }
    ul { margin-left: 20px; margin-bottom: 15px; }
    li { margin-bottom: 8px; }
  </style>
</head>
<body>${htmlContent.match(/<body[^>]*>([\s\S]*)<\/body>/)?.[1] || ''}</body>
</html>`;
      exportToPDF(fullHtml, lessonPlan.title, () => setShowMenu(false));
    }
    setShowMenu(false);
  };

  const handleExportMarkdown = () => {
    if (lessonPlan) {
      const markdown = exportToMarkdown(lessonPlan, activity || null);
      const filename = `${lessonPlan.title.replace(/[^a-z0-9]/gi, '_')}.md`;
      downloadFile(markdown, filename, 'text/markdown');
    }
    setShowMenu(false);
  };

  const handleExportWord = () => {
    if (lessonPlan) {
      const html = exportToHTML(lessonPlan, activity || null);
      const filename = `${lessonPlan.title.replace(/[^a-z0-9]/gi, '_')}.html`;
      // HTML pode ser aberto no Word
      downloadFile(html, filename, 'application/msword');
    }
    setShowMenu(false);
  };

  return (
    <div className="relative inline-block" ref={menuRef}>
      <button
        onClick={() => setShowMenu(!showMenu)}
        disabled={disabled}
        className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
        aria-label="Exportar materiais"
        aria-expanded={showMenu}
        aria-haspopup="true"
        title="Exportar em múltiplos formatos"
      >
        <span className="mr-2 text-lg" aria-hidden="true">📄</span>
        Exportar
        <span className="ml-2 text-xs" aria-hidden="true">▼</span>
      </button>

      {showMenu && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-2xl border border-gray-200 py-2 z-50">
          <button
            onClick={handleExportPDF}
            className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
            aria-label="Exportar como PDF"
          >
            <span>📄</span>
            <span>PDF</span>
          </button>
          <button
            onClick={handleExportMarkdown}
            disabled={!lessonPlan}
            className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Exportar como Markdown"
          >
            <span>📝</span>
            <span>Markdown (.md)</span>
          </button>
          <button
            onClick={handleExportWord}
            disabled={!lessonPlan}
            className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Exportar como Word (HTML)"
          >
            <span>📘</span>
            <span>Word (.html)</span>
          </button>
        </div>
      )}
    </div>
  );
}
