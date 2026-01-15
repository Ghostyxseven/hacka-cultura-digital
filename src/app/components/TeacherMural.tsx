// src/app/components/TeacherMural.tsx
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getAnnouncementService } from '@/lib/announcementService';
import { Announcement } from '@/core/entities/Announcement';
import { Button } from '@/components/ui/Button';
import { showError, showSuccess } from '@/utils/notifications';

export function TeacherMural() {
    const { user } = useAuth();
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [isAdding, setIsAdding] = useState(false);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);

    const service = getAnnouncementService();

    useEffect(() => {
        refreshAnnouncements();
    }, []);

    const refreshAnnouncements = () => {
        if (user?.id) {
            const data = service.getAnnouncements({ professorId: user.id });
            setAnnouncements(data);
        }
    };

    const handleCreate = () => {
        if (!title || !content || !user?.id) {
            showError('Preencha o título e o conteúdo');
            return;
        }

        setLoading(true);
        try {
            service.createAnnouncement({
                professorId: user.id,
                title,
                content
            });
            showSuccess('Aviso publicado no mural!');
            setTitle('');
            setContent('');
            setIsAdding(false);
            refreshAnnouncements();
        } catch (error) {
            showError('Erro ao publicar aviso');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = (id: string) => {
        try {
            service.deleteAnnouncement(id);
            showSuccess('Aviso removido');
            refreshAnnouncements();
        } catch (error) {
            showError('Erro ao remover aviso');
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-orange-500 to-amber-500 px-6 py-5 flex justify-between items-center">
                <div className="flex items-center gap-3 text-white">
                    <span className="text-2xl">📢</span>
                    <h2 className="text-2xl font-bold">Mural de Avisos</h2>
                </div>
                <Button
                    variant="secondary"
                    onClick={() => setIsAdding(!isAdding)}
                    className="bg-white/20 hover:bg-white/30 border-white/30 text-white"
                >
                    {isAdding ? 'Cancelar' : '➕ Novo Aviso'}
                </Button>
            </div>

            <div className="p-6">
                {isAdding && (
                    <div className="mb-8 p-6 bg-orange-50 rounded-xl border border-orange-100 shadow-inner">
                        <h3 className="font-bold text-orange-800 mb-4">Novo Comunicado</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-orange-900 mb-1">Título</label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full px-4 py-2 rounded-lg border border-orange-200 focus:ring-2 focus:ring-orange-500 outline-none"
                                    placeholder="Ex: Próxima aula prática"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-orange-900 mb-1">Mensagem</label>
                                <textarea
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    className="w-full px-4 py-2 rounded-lg border border-orange-200 focus:ring-2 focus:ring-orange-500 outline-none min-h-[100px]"
                                    placeholder="Digite aqui o que os alunos precisam saber..."
                                />
                            </div>
                            <Button
                                onClick={handleCreate}
                                disabled={loading}
                                className="w-full bg-orange-600 hover:bg-orange-700"
                            >
                                {loading ? 'Publicando...' : 'Publicar no Mural'}
                            </Button>
                        </div>
                    </div>
                )}

                <div className="space-y-4">
                    {announcements.length === 0 ? (
                        <div className="text-center py-12 text-gray-400">
                            <span className="text-4xl block mb-2">📭</span>
                            <p>Seu mural está vazio. Publique algo para seus alunos!</p>
                        </div>
                    ) : (
                        announcements.map((ann) => (
                            <div key={ann.id} className="group p-5 border border-gray-100 rounded-xl hover:bg-gray-50 transition-all border-l-4 border-l-orange-500 relative">
                                <button
                                    onClick={() => handleDelete(ann.id)}
                                    className="absolute top-4 right-4 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                    title="Remover aviso"
                                >
                                    🗑️
                                </button>
                                <h4 className="font-bold text-gray-900 text-lg mb-2 pr-8">{ann.title}</h4>
                                <p className="text-gray-600 whitespace-pre-wrap mb-3 text-sm leading-relaxed">{ann.content}</p>
                                <div className="text-xs text-gray-400 flex items-center gap-2">
                                    <span>📅 {new Date(ann.createdAt).toLocaleDateString('pt-BR')}</span>
                                    <span>•</span>
                                    <span>📍 Mural Geral</span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
