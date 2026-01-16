// src/app/components/MaterialRAGManager.tsx
'use client';

import { useState, useEffect } from 'react';
import { getLessonPlanService } from '@/lib/service';
import { Material } from '@/core/entities/Material';
import { Button } from '@/components/ui/Button';
import { showError, showSuccess } from '@/utils/notifications';

interface MaterialRAGManagerProps {
    unitId: string;
}

export function MaterialRAGManager({ unitId }: MaterialRAGManagerProps) {
    const [materials, setMaterials] = useState<Material[]>([]);
    const [isAdding, setIsAdding] = useState(false);
    const [fileName, setFileName] = useState('');
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);

    const service = getLessonPlanService();

    useEffect(() => {
        refreshMaterials();
    }, [unitId]);

    const refreshMaterials = () => {
        const data = service.getMaterialsByUnit(unitId);
        setMaterials(data);
    };

    const handleUpload = () => {
        if (!fileName || !content) {
            showError('Preencha o nome e o conteúdo do material');
            return;
        }

        setLoading(true);
        try {
            service.uploadMaterial({
                unitId,
                fileName,
                fileType: 'text/plain',
                content
            });
            showSuccess('Material adicionado! A IA usará este contexto na próxima geração.');
            setFileName('');
            setContent('');
            setIsAdding(false);
            refreshMaterials();
        } catch (error) {
            showError('Erro ao salvar material');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-bold text-gray-700 flex items-center gap-2">
                    <span>📚</span> Base de Conhecimento (RAG)
                </h4>
                <button
                    onClick={() => setIsAdding(!isAdding)}
                    className="text-xs text-purple-600 hover:text-purple-800 font-bold"
                >
                    {isAdding ? '✕ Cancelar' : '➕ Adicionar Material'}
                </button>
            </div>

            {isAdding && (
                <div className="mb-4 p-4 bg-purple-50 rounded-xl border border-purple-100 space-y-3">
                    <input
                        type="text"
                        placeholder="Nome do material (ex: Livro Didático Cap 4)"
                        value={fileName}
                        onChange={(e) => setFileName(e.target.value)}
                        className="w-full text-xs px-3 py-2 rounded-lg border border-purple-200 outline-none focus:ring-2 focus:ring-purple-400"
                    />
                    <textarea
                        placeholder="Cole aqui o texto do material que a IA deve considerar como verdade absoluta para esta aula..."
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="w-full text-xs px-3 py-2 rounded-lg border border-purple-200 outline-none focus:ring-2 focus:ring-purple-400 min-h-[80px]"
                    />
                    <Button
                        onClick={handleUpload}
                        disabled={loading}
                        className="w-full py-1.5 text-xs bg-purple-600 hover:bg-purple-700"
                    >
                        {loading ? 'Salvando...' : 'Confirmar Material'}
                    </Button>
                </div>
            )}

            {materials.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                    {materials.map(m => (
                        <div key={m.id} className="flex items-center gap-1.5 px-2 py-1 bg-gray-100 border border-gray-200 rounded-md text-[10px] text-gray-600">
                            <span>📄</span>
                            <span className="truncate max-w-[120px]">{m.fileName}</span>
                        </div>
                    ))}
                </div>
            ) : !isAdding && (
                <p className="text-[10px] text-gray-400 italic">Nenhum material customizado. A IA usará conhecimento geral.</p>
            )}
        </div>
    );
}
