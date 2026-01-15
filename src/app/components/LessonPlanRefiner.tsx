// src/app/components/LessonPlanRefiner.tsx
'use client';

import { useState } from 'react';
import { getLessonPlanService } from '@/lib/service';
import { Button } from '@/components/ui/Button';
import { Loading } from '@/components/ui/Loading';
import { showError, showSuccess } from '@/utils/notifications';

interface LessonPlanRefinerProps {
    lessonPlanId: string;
    onRefined: () => void;
}

export function LessonPlanRefiner({ lessonPlanId, onRefined }: LessonPlanRefinerProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [command, setCommand] = useState('');
    const [loading, setLoading] = useState(false);

    const service = getLessonPlanService();

    const handleRefine = async () => {
        if (!command.trim()) return;

        setLoading(true);
        try {
            await service.refineLessonPlan(lessonPlanId, command);
            showSuccess('Plano de aula refinado com sucesso!');
            setCommand('');
            setIsOpen(false);
            onRefined();
        } catch (error: any) {
            showError(error.message || 'Erro ao refinar o plano');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 px-6 py-3 bg-indigo-600 text-white rounded-full shadow-2xl flex items-center gap-2 hover:bg-indigo-700 hover:scale-105 transition-all z-40 border-2 border-white"
            >
                <span>✨</span> Refinar com IA
            </button>
        );
    }

    return (
        <div className="fixed bottom-6 right-6 w-80 md:w-96 bg-white rounded-2xl shadow-2xl flex flex-col z-50 border border-indigo-100 overflow-hidden animate-in slide-in-from-bottom-5">
            <div className="bg-indigo-600 p-4 text-white flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <span>✨</span>
                    <h3 className="font-bold">Assistente de Refinamento</h3>
                </div>
                <button onClick={() => setIsOpen(false)} className="hover:bg-indigo-700 rounded-lg p-1">
                    ✕
                </button>
            </div>

            <div className="p-4 space-y-4">
                <p className="text-xs text-gray-500 italic">
                    Peça à IA para ajustar o plano. Ex: "Mude o quiz para 5 questões", "Adicione uma atividade prática no final", "Torne a linguagem mais simples".
                </p>

                <textarea
                    value={command}
                    onChange={(e) => setCommand(e.target.value)}
                    placeholder="O que você deseja mudar?"
                    className="w-full h-32 text-sm p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                />

                <Button
                    onClick={handleRefine}
                    disabled={loading || !command.trim()}
                    className="w-full bg-indigo-600 hover:bg-indigo-700"
                >
                    {loading ? 'Refinando...' : '🪄 Aplicar Mudanças'}
                </Button>
            </div>
        </div>
    );
}
