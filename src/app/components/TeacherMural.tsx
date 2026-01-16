// src/app/components/TeacherMural.tsx
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getAnnouncementService } from '@/lib/announcementService';
import { Announcement } from '@/core/entities/Announcement';
import { Button } from '@/components/ui/Button';
import { showError, showSuccess } from '@/utils/notifications';

export function TeacherMural() {
    const { user, isProfessor } = useAuth();
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
            // Se for aluno, busca avisos do professor dele
            const professorId = isProfessor ? user.id : user.professorId;
            if (professorId) {
                const data = service.getAnnouncements({ professorId });
                setAnnouncements(data);
            }
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
        <div className="bg-surface rounded-2xl shadow-sm hover:shadow-md border border-border overflow-hidden">
            <div className="bg-surface px-6 py-5 flex justify-between items-center border-b border-border">
                <div className="flex items-center gap-3 text-text-main">
                    <span className="text-2xl">📢</span>
                    <h2 className="text-2xl font-bold">Mural de Avisos</h2>
                </div>
                {isProfessor && (
                    <Button
                        variant="primary"
                        onClick={() => setIsAdding(!isAdding)}
                        size="sm"
                    >
                        {isAdding ? 'Cancelar' : '➕ Novo Aviso'}
                    </Button>
                )}
            </div>

            <div className="p-6">
                {isAdding && (
                    <div className="mb-8 p-6 bg-surface rounded-xl border border-border shadow-inner">
                        <h3 className="font-bold text-text-main mb-4">Novo Comunicado</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-text-main mb-1">Título</label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full px-4 py-2 rounded-lg border border-border focus:ring-2 focus:ring-primary outline-none bg-surface"
                                    placeholder="Ex: Próxima aula prática"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-text-main mb-1">Mensagem</label>
                                <textarea
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    className="w-full px-4 py-2 rounded-lg border border-border focus:ring-2 focus:ring-primary outline-none min-h-[100px] bg-surface"
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
                            <p>{isProfessor ? 'Seu mural está vazio. Publique algo para seus alunos!' : 'Nenhum aviso no mural até o momento.'}</p>
                        </div>
                    ) : (
                        announcements.map((ann) => (
                            <div key={ann.id} className="group p-5 border border-border rounded-xl hover:bg-background/50 transition-all border-l-4 border-l-primary relative">
                                {isProfessor && (
                                    <button
                                        onClick={() => handleDelete(ann.id)}
                                        className="absolute top-4 right-4 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                        title="Remover aviso"
                                    >
                                        🗑️
                                    </button>
                                )}
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
