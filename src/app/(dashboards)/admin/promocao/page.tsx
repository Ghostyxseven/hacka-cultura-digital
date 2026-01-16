'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PageContainer } from '@/components';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { getClassService } from '@/lib/service';
import { getAuthService } from '@/lib/authService';
import { Class } from '@/core/entities/Class';
import { User } from '@/core/entities/User';
import { SchoolYear } from '@/core/entities/LessonPlan';
import { showError, showSuccess } from '@/utils/notifications';

const SCHOOL_YEARS: SchoolYear[] = [
    '6º Ano', '7º Ano', '8º Ano', '9º Ano',
    '1º Ano EM', '2º Ano EM', '3º Ano EM'
];

export default function PromocaoPage() {
    const router = useRouter();
    const classService = getClassService();
    const authService = getAuthService(); // Assuming we might need this or userManagement hook

    const [classes, setClasses] = useState<Class[]>([]);
    const [students, setStudents] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);

    // Filters
    const [sourceGrade, setSourceGrade] = useState<SchoolYear | ''>('');
    const [sourceClassId, setSourceClassId] = useState('');

    const [targetGrade, setTargetGrade] = useState<SchoolYear | ''>('');
    const [targetClassId, setTargetClassId] = useState('');

    // Selection
    const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);

    useEffect(() => {
        loadClasses();
    }, []);

    useEffect(() => {
        if (sourceClassId) {
            loadStudents(sourceClassId);
        } else {
            setStudents([]);
            setSelectedStudentIds([]);
        }
    }, [sourceClassId]);

    const loadClasses = () => {
        const all = classService.getClasses();
        setClasses(all);
    };

    const loadStudents = (classId: string) => {
        const classStudents = classService.getClassStudents(classId);
        setStudents(classStudents);
        // Auto-select all by default? Maybe not.
        setSelectedStudentIds([]);
    };

    // Logic to toggle student selection
    const toggleStudent = (id: string) => {
        setSelectedStudentIds(prev =>
            prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
        );
    };

    const toggleAll = () => {
        if (selectedStudentIds.length === students.length) {
            setSelectedStudentIds([]);
        } else {
            setSelectedStudentIds(students.map(s => s.id));
        }
    };

    const handlePromote = async () => {
        if (!targetClassId) {
            showError('Selecione a turma de destino');
            return;
        }
        if (selectedStudentIds.length === 0) {
            showError('Selecione pelo menos um aluno');
            return;
        }

        setLoading(true);
        try {
            const promotedCount = await classService.promoteStudents(selectedStudentIds, targetClassId);
            showSuccess(`${promotedCount} alunos promovidos com sucesso!`);

            // Refresh
            loadStudents(sourceClassId);
            setSelectedStudentIds([]);
        } catch (error) {
            showError('Erro ao promover alunos');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    // Derived lists
    const sourceClasses = classes.filter(c => !sourceGrade || c.gradeYear === sourceGrade);
    const targetClasses = classes.filter(c => !targetGrade || c.gradeYear === targetGrade);

    return (
        <PageContainer>
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Promoção de Alunos</h1>
                <p className="text-gray-600">Transfira alunos entre turmas em lote (Ex: 6º Ano para 7º Ano)</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Origem */}
                <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                    <h2 className="text-xl font-semibold mb-4 text-blue-800">1. Origem (Atual)</h2>

                    <div className="space-y-4 mb-6">
                        <Select
                            id="sourceGrade"
                            label="Ano Escolar"
                            value={sourceGrade}
                            onChange={(e) => {
                                setSourceGrade(e.target.value as SchoolYear);
                                setSourceClassId('');
                            }}
                            options={[{ value: '', label: 'Todos' }, ...SCHOOL_YEARS.map(y => ({ value: y, label: y }))]}
                        />

                        <Select
                            id="sourceClass"
                            label="Turma"
                            value={sourceClassId}
                            onChange={(e) => setSourceClassId(e.target.value)}
                            options={[{ value: '', label: 'Selecione a turma...' }, ...sourceClasses.map(c => ({ value: c.id, label: `${c.name} (${c.gradeYear})` }))]}
                            disabled={!sourceClasses.length}
                        />
                    </div>

                    {sourceClassId && (
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <span className="font-medium text-gray-700">{students.length} Alunos encontrados</span>
                                <Button variant="secondary" size="sm" onClick={toggleAll}>
                                    {selectedStudentIds.length === students.length ? 'Desmarcar Todos' : 'Marcar Todos'}
                                </Button>
                            </div>

                            <div className="border rounded-md max-h-96 overflow-y-auto">
                                {students.map(student => (
                                    <div
                                        key={student.id}
                                        className={`flex items-center p-3 border-b last:border-0 hover:bg-gray-50 cursor-pointer ${selectedStudentIds.includes(student.id) ? 'bg-blue-50' : ''}`}
                                        onClick={() => toggleStudent(student.id)}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={selectedStudentIds.includes(student.id)}
                                            onChange={() => { }} // Handled by div click
                                            className="mr-3 h-4 w-4 text-blue-600 rounded"
                                        />
                                        <div>
                                            <p className="font-medium text-gray-900">{student.name}</p>
                                            <p className="text-xs text-gray-500">{student.email}</p>
                                        </div>
                                    </div>
                                ))}
                                {students.length === 0 && (
                                    <div className="p-4 text-center text-gray-500">Nenhum aluno nesta turma.</div>
                                )}
                            </div>
                            <p className="text-sm text-gray-500 mt-2 text-right">{selectedStudentIds.length} selecionados</p>
                        </div>
                    )}
                </div>

                {/* Destino */}
                <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm h-fit">
                    <h2 className="text-xl font-semibold mb-4 text-green-800">2. Destino (Novo)</h2>

                    <div className="space-y-4 mb-6">
                        <div className="p-4 bg-blue-50 text-blue-800 rounded-md text-sm mb-4">
                            Selecione para onde os <strong>{selectedStudentIds.length} alunos selecionados</strong> serão transferidos.
                        </div>

                        <Select
                            id="targetGrade"
                            label="Novo Ano Escolar"
                            value={targetGrade}
                            onChange={(e) => {
                                setTargetGrade(e.target.value as SchoolYear);
                                setTargetClassId('');
                            }}
                            options={[{ value: '', label: 'Selecione o ano...' }, ...SCHOOL_YEARS.map(y => ({ value: y, label: y }))]}
                        />

                        <Select
                            id="targetClass"
                            label="Nova Turma"
                            value={targetClassId}
                            onChange={(e) => setTargetClassId(e.target.value)}
                            options={[{ value: '', label: 'Selecione a turma...' }, ...targetClasses.map(c => ({ value: c.id, label: `${c.name} (${c.gradeYear})` }))]}
                            disabled={!targetGrade}
                        />

                        <Button
                            className="w-full mt-6"
                            onClick={handlePromote}
                            disabled={loading || selectedStudentIds.length === 0 || !targetClassId}
                        >
                            {loading ? 'Processando...' : `Promover ${selectedStudentIds.length} Alunos`}
                        </Button>
                    </div>
                </div>
            </div>
        </PageContainer>
    );
}
