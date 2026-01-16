'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ApplicationServiceFactory } from '@/application';
import type { Subject, Unit } from '@/application/viewmodels';

export default function SubjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const subjectId = params.id as string;

  const [subject, setSubject] = useState<Subject | null>(null);
  const [units, setUnits] = useState<Unit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
  }, [subjectId]);

  const loadData = async () => {
    try {
      setLoading(true);
      const subjectService = ApplicationServiceFactory.createSubjectService();
      const unitService = ApplicationServiceFactory.createUnitService();

      const [subjectData, unitsData] = await Promise.all([
        subjectService.findById(subjectId),
        unitService.findBySubject(subjectId),
      ]);

      setSubject(subjectData);
      setUnits(unitsData);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Tem certeza que deseja deletar esta disciplina?')) {
      return;
    }

    try {
      const subjectService = ApplicationServiceFactory.createSubjectService();
      await subjectService.delete(subjectId);
      router.push('/');
    } catch (err: any) {
      setError(err.message || 'Erro ao deletar disciplina');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <p className="text-gray-600">Carregando...</p>
      </div>
    );
  }

  if (error || !subject) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Disciplina não encontrada'}</p>
          <Link href="/" className="text-indigo-600 hover:text-indigo-700">
            Voltar para Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <Link href="/" className="text-indigo-600 hover:text-indigo-700 mb-4 inline-block">
          ← Voltar para Dashboard
        </Link>

        <div className="bg-white rounded-lg shadow-md p-8 mb-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">{subject.name}</h1>
              {subject.description && (
                <p className="text-gray-600">{subject.description}</p>
              )}
            </div>
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Deletar
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {subject.schoolYears.map((year) => (
              <span
                key={year}
                className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded text-sm"
              >
                {year}
              </span>
            ))}
          </div>
        </div>

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Unidades de Ensino</h2>
          <Link
            href={`/professor/unidades/new?subjectId=${subjectId}`}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            + Nova Unidade
          </Link>
        </div>

        {units.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <p className="text-gray-600 mb-4">Nenhuma unidade cadastrada</p>
            <Link
              href={`/professor/unidades/new?subjectId=${subjectId}`}
              className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Criar Primeira Unidade
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {units.map((unit) => (
              <Link
                key={unit.id}
                href={`/professor/unidades/${unit.id}/plano`}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <h3 className="text-xl font-bold text-gray-800 mb-2">{unit.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{unit.theme}</p>
                {unit.isAIGenerated && (
                  <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">
                    Sugerida por IA
                  </span>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
