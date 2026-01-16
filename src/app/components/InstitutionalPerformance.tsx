// src/app/components/InstitutionalPerformance.tsx
'use client';

import { useState, useEffect } from 'react';
import { getInstitutionalService } from '@/lib/institutionalService';
import { InstitutionalOverview } from '@/core/entities/SchoolPerformance';
import { Loading } from '@/components/ui/Loading';

export function InstitutionalPerformance() {
    const [data, setData] = useState<InstitutionalOverview | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const service = getInstitutionalService();
        const result = service.getOverview();
        setData(result);
        setLoading(false);
    }, []);

    const handleExport = () => {
        if (!data) return;

        let csvContent = "data:text/csv;charset=utf-8,";
        csvContent += "Ano/Serie,Disciplina,Media,Total Atividades\n";

        data.performanceByGrade.forEach(grade => {
            grade.subjectStats.forEach(sub => {
                csvContent += `${grade.gradeYear},${sub.subjectName},${sub.averageScore}%,${sub.totalQuizzes}\n`;
            });
        });

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `relatorio-institucional-${new Date().toLocaleDateString()}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (loading) return <Loading />;
    if (!data) return null;

    return (
        <div className="space-y-8">
            {/* Alunos em Risco */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
                <div className="bg-gradient-to-r from-red-500 to-rose-600 px-6 py-4 flex items-center gap-3 text-white">
                    <span className="text-2xl">⚠️</span>
                    <h2 className="text-xl font-bold">Alunos com Baixo Desempenho (Alerta de Risco)</h2>
                </div>
                <div className="p-6">
                    {data.studentsAtRisk.length === 0 ? (
                        <p className="text-center text-gray-500 italic py-4">Nenhum aluno em situação de risco identificada.</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="text-xs uppercase text-gray-400 border-b">
                                        <th className="pb-3 font-semibold">Aluno</th>
                                        <th className="pb-3 font-semibold text-center">Média</th>
                                        <th className="pb-3 font-semibold text-center">Última Nota</th>
                                        <th className="pb-3 font-semibold">Professor Responsável</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {data.studentsAtRisk.map((s) => (
                                        <tr key={s.studentId} className="hover:bg-red-50/30 transition-colors">
                                            <td className="py-4 font-semibold text-gray-900">{s.studentName}</td>
                                            <td className="py-4 text-center">
                                                <span className="text-red-600 font-bold">{s.averageScore}%</span>
                                            </td>
                                            <td className="py-4 text-center text-gray-600">{s.lastScore}%</td>
                                            <td className="py-4 text-gray-500 text-sm">👨‍🏫 {s.professorName}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* Desempenho por Ano/Série */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {data.performanceByGrade.map((grade) => (
                    <div key={grade.gradeYear} className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                        <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                            <h3 className="font-bold text-gray-800 text-lg">{grade.gradeYear}</h3>
                            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">
                                Média Geral: {grade.averageScore}%
                            </span>
                        </div>
                        <div className="p-6">
                            <div className="space-y-4">
                                {grade.subjectStats.map((sub) => (
                                    <div key={sub.subjectName} className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="font-medium text-gray-700">{sub.subjectName}</span>
                                            <span className="text-gray-500">{sub.totalQuizzes} atividades</span>
                                        </div>
                                        <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                                            <div
                                                className={`h-full transition-all duration-1000 ${sub.averageScore >= 70 ? 'bg-green-500' : sub.averageScore >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                                                    }`}
                                                style={{ width: `${sub.averageScore}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Botão de Exportação */}
            <div className="flex justify-center">
                <button
                    className="bg-gray-800 text-white px-8 py-3 rounded-xl font-bold hover:bg-gray-900 transition-all shadow-lg flex items-center gap-2"
                    onClick={handleExport}
                >
                    <span>📥</span>
                    Exportar Relatório Consolidado (CSV)
                </button>
            </div>
        </div>
    );
}
