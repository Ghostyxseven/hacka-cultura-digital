import { useState, useEffect } from 'react';
import { Class } from '@/core/entities/Class';
import { getLessonPlanService, getClassService } from '@/lib/service';
import { Loading } from '@/components/ui/Loading';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

interface ClassHealthWidgetProps {
    classes: Class[];
}

interface StudentRisk {
    studentId: string;
    studentName: string;
    className: string;
    classId: string;
    averageScore: number;
}

export function ClassHealthWidget({ classes }: ClassHealthWidgetProps) {
    const [riskyStudents, setRiskyStudents] = useState<StudentRisk[]>([]);
    const [loading, setLoading] = useState(true);
    const lessonPlanService = getLessonPlanService();
    const classService = getClassService();

    useEffect(() => {
        const fetchHealthData = async () => {
            try {
                const risks: StudentRisk[] = [];

                // Para cada turma
                for (const cls of classes) {
                    // Buscar alunos da turma
                    const students = classService.getClassStudents(cls.id);

                    // Para cada aluno
                    for (const student of students) {
                        // Calcular média (usando o novo UseCase)
                        const avg = lessonPlanService.getStudentAverageScore(student.id);

                        // Se média < 6, adicionar à lista de risco
                        if (avg > 0 && avg < 60) { // Assumindo base 100
                            risks.push({
                                studentId: student.id,
                                studentName: student.name,
                                className: cls.name,
                                classId: cls.id,
                                averageScore: avg
                            });
                        }
                    }
                }

                // Ordenar por menor nota
                risks.sort((a, b) => a.averageScore - b.averageScore);
                setRiskyStudents(risks.slice(0, 5)); // Top 5
            } catch (error) {
                console.error("Failed to fetch class health", error);
            } finally {
                setLoading(false);
            }
        };

        if (classes.length > 0) {
            fetchHealthData();
        } else {
            setLoading(false);
        }
    }, [classes]);

    if (loading) return <Loading />;

    if (classes.length === 0) {
        return null;
    }

    return (
        <div className="bg-surface rounded-2xl shadow-sm hover:shadow-md border border-border overflow-hidden transition-all duration-300">
            <div className="px-6 py-4 border-b border-border flex justify-between items-center bg-gray-50/50">
                <div className="flex items-center gap-2">
                    <span className="text-2xl">❤️‍🩹</span>
                    <div>
                        <h2 className="text-lg font-bold text-text-main font-heading">Saúde da Turma</h2>
                        <p className="text-sm text-text-secondary">Alunos que precisam de atenção imediata</p>
                    </div>
                </div>
            </div>

            <div className="p-6">
                {riskyStudents.length === 0 ? (
                    <div className="text-center py-6 text-gray-500">
                        <span className="text-4xl block mb-2">🎉</span>
                        <p>Ótimo! Nenhum aluno com média abaixo de 60 detectado.</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {riskyStudents.map(student => (
                            <div key={student.studentId} className="flex items-center justify-between p-4 bg-red-50 rounded-xl border border-red-100 hover:bg-red-100/50 transition-colors">
                                <div className="flex-1 min-w-0">
                                    <p className="font-bold text-text-main truncate">{student.studentName}</p>
                                    <p className="text-xs text-text-secondary mt-1">{student.className}</p>
                                </div>
                                <div className="flex items-center gap-3 ml-4">
                                    <div className="text-right">
                                        <span className="block text-xl font-bold text-red-600">{student.averageScore.toFixed(1)}</span>
                                        <span className="text-xs text-red-500">Média</span>
                                    </div>
                                    <Link href={`/professor/turmas/${student.classId}`}>
                                        <Button size="sm" variant="secondary" className="text-xs whitespace-nowrap">
                                            Ver
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
