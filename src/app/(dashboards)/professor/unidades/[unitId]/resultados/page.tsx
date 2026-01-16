// src/app/(dashboards)/professor/unidades/[unitId]/resultados/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { getLessonPlanService } from '@/lib/service';
import { getAuthService } from '@/lib/authService';
import { QuizResult } from '@/core/entities/QuizResult';
import { User } from '@/core/entities/User';
import { PageContainer } from '@/components/layout/PageContainer';
import { Loading } from '@/components/ui/Loading';
import { Button, BackButton } from '@/components';
import { showError, showSuccess } from '@/utils/notifications';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

export default function UnitResultsPage() {
    const params = useParams();
    const router = useRouter();
    const unitId = params.unitId as string;
    const { isProfessor } = useAuth();

    const [results, setResults] = useState<(QuizResult & { studentName: string })[]>([]);
    const [unitTopic, setUnitTopic] = useState('');
    const [loading, setLoading] = useState(true);
    const [selectedResult, setSelectedResult] = useState<QuizResult | null>(null);
    const [comment, setComment] = useState('');
    const [saving, setSaving] = useState(false);
    const [trends, setTrends] = useState<string | null>(null);
    const [analyzing, setAnalyzing] = useState(false);
    const [lessonPlanId, setLessonPlanId] = useState<string | null>(null);

    const lessonPlanService = getLessonPlanService();
    const authService = getAuthService();

    useEffect(() => {
        loadData();
    }, [unitId]);

    const loadData = () => {
        try {
            const unit = lessonPlanService.getUnitById(unitId);
            if (!unit) {
                showError('Unidade não encontrada');
                router.push('/professor');
                return;
            }
            setUnitTopic(unit.topic);
            setLessonPlanId(unit.lessonPlanId || null);

            if (unit.lessonPlanId) {
                const resultsData = lessonPlanService.getQuizResults(unit.lessonPlanId);
                const enrichedResults = resultsData.map(res => {
                    const student = authService.getUserById(res.userId);
                    return {
                        ...res,
                        studentName: student?.name || 'Aluno Desconhecido'
                    };
                });
                setResults(enrichedResults);
            }
        } catch (error) {
            console.error('Erro ao carregar resultados:', error);
            showError('Erro ao carregar resultados');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenComment = (result: QuizResult) => {
        setSelectedResult(result);
        setComment(result.teacherComments || '');
    };

    const handleSaveComment = () => {
        if (!selectedResult) return;

        setSaving(true);
        try {
            lessonPlanService.addTeacherComment(selectedResult.id, comment);
            showSuccess('Feedback enviado com sucesso!');
            setSelectedResult(null);
            loadData();
        } catch (error) {
            showError('Erro ao salvar comentário');
        } finally {
            setSaving(false);
        }
    };

    const handleAnalyzeTrends = async () => {
        if (!lessonPlanId) return;
        setAnalyzing(true);
        try {
            const result = await lessonPlanService.getClassTrends(lessonPlanId);
            setTrends(result);
            showSuccess('Análise de tendências gerada!');
        } catch (error) {
            showError('Não foi possível gerar a análise.');
        } finally {
            setAnalyzing(false);
        }
    };

    if (loading) return <Loading />;

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-gray-50">
                <div className="bg-gradient-to-r from-green-600 to-emerald-600 shadow-xl border-b border-green-700/20">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        <div className="flex items-center gap-4 mb-3">
                            <BackButton href={`/professor/unidades/${unitId}/plano`} className="bg-white/20 hover:bg-white/30 text-white border-white/30" />
                        </div>
                        <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-2">
                            <span className="text-5xl">📊</span>
                            <span>Desempenho da Turma: {unitTopic}</span>
                        </h1>
                        <p className="text-green-100 text-lg">Acompanhe as notas e dê feedback personalizado</p>
                    </div>
                </div>

                <PageContainer>
                    {/* Análise de Tendências (IA) */}
                    <div className="mb-8 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl p-6 border border-indigo-100 shadow-inner">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <span className="text-3xl">🧩</span>
                                <h2 className="text-xl font-bold text-indigo-900">Análise de Tendências da Turma</h2>
                            </div>
                            <Button
                                onClick={handleAnalyzeTrends}
                                disabled={analyzing || !lessonPlanId || results.length === 0}
                                className="bg-indigo-600 hover:bg-indigo-700 shadow-md"
                            >
                                {analyzing ? 'Analisando...' : '🪄 Gerar Insights com IA'}
                            </Button>
                        </div>

                        {trends ? (
                            <div className="bg-white/80 backdrop-blur-sm p-5 rounded-xl border border-white/50 shadow-sm animate-in fade-in duration-500">
                                <p className="text-gray-700 whitespace-pre-line leading-relaxed italic">
                                    {trends}
                                </p>
                            </div>
                        ) : (
                            <div className="text-center py-6 text-indigo-400">
                                <p className="text-sm">Clique em "Gerar Insights" para que a IA analise os erros mais comuns e sugira intervenções.</p>
                            </div>
                        )}
                    </div>

                    <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-4 text-sm font-bold text-gray-700">Aluno</th>
                                        <th className="px-6 py-4 text-sm font-bold text-gray-700">Data</th>
                                        <th className="px-6 py-4 text-sm font-bold text-gray-700">Nota</th>
                                        <th className="px-6 py-4 text-sm font-bold text-gray-700">Acertos</th>
                                        <th className="px-6 py-4 text-sm font-bold text-gray-700">Feedback IA</th>
                                        <th className="px-6 py-4 text-sm font-bold text-gray-700">Sua Nota/Obs</th>
                                        <th className="px-6 py-4 text-sm font-bold text-gray-700">Ações</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {results.length === 0 ? (
                                        <tr>
                                            <td colSpan={7} className="px-6 py-12 text-center text-gray-500 italic">
                                                Nenhum aluno realizou esta atividade ainda.
                                            </td>
                                        </tr>
                                    ) : (
                                        results.map((res) => (
                                            <tr key={res.id} className="hover:bg-green-50/30 transition-colors">
                                                <td className="px-6 py-4 font-semibold text-gray-900">{res.studentName}</td>
                                                <td className="px-6 py-4 text-sm text-gray-600">
                                                    {new Date(res.completedAt).toLocaleDateString('pt-BR')}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-3 py-1 rounded-full font-bold text-sm ${res.score >= 70 ? 'bg-green-100 text-green-700' :
                                                        res.score >= 50 ? 'bg-yellow-100 text-yellow-700' :
                                                            'bg-red-100 text-red-700'
                                                        }`}>
                                                        {res.score}%
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-sm">
                                                    {res.correctAnswers} / {res.totalQuestions}
                                                </td>
                                                <td className="px-6 py-4 max-w-xs">
                                                    <p className="text-xs text-gray-600 italic line-clamp-2">{res.aiFeedback || 'N/A'}</p>
                                                </td>
                                                <td className="px-6 py-4 max-w-xs">
                                                    <p className="text-xs text-blue-600 font-medium line-clamp-2">{res.teacherComments || 'Sem comentário'}</p>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <Button
                                                        variant="secondary"
                                                        onClick={() => handleOpenComment(res)}
                                                        className="text-xs bg-blue-50 text-blue-700 border-blue-100 hover:bg-blue-100 px-3 py-1"
                                                    >
                                                        💬 Intervir
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </PageContainer>

                {/* Modal de Comentário (Simplificado) */}
                {selectedResult && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-gray-100">
                            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
                                <h3 className="text-xl font-bold">Enviar Feedback</h3>
                                <p className="text-blue-100 text-sm">Feedback para: {results.find(r => r.id === selectedResult.id)?.studentName}</p>
                            </div>
                            <div className="p-6">
                                <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 mb-4">
                                    <p className="text-xs font-bold text-gray-500 uppercase mb-2">Feedback da IA:</p>
                                    <p className="text-sm text-gray-600 italic">"{selectedResult.aiFeedback}"</p>
                                </div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Suas Observações Pessoais</label>
                                <textarea
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    className="w-full h-32 p-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                                    placeholder="Elogie os acertos ou aponte pontos de melhoria específicos..."
                                />
                            </div>
                            <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
                                <Button variant="secondary" onClick={() => setSelectedResult(null)}>Cancelar</Button>
                                <Button onClick={handleSaveComment} disabled={saving}>
                                    {saving ? 'Enviando...' : '💾 Salvar Feedback'}
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </ProtectedRoute>
    );
}
