'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ApplicationServiceFactory } from '@/application';
import { Subject } from '@/core/entities/Subject';

/**
 * Dashboard Principal - Single User Application
 * Acesso direto sem autenticação
 */
export default function Home() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSubjects();
  }, []);

  const loadSubjects = async () => {
    try {
      setLoading(true);
      const subjectService = ApplicationServiceFactory.createSubjectService();
      const allSubjects = await subjectService.findAll();
      setSubjects(allSubjects);
    } catch (error) {
      console.error('Erro ao carregar disciplinas:', error);
    } finally {
      setLoading(false);
    }
  };

  const totalUnits = subjects.reduce((acc, subject) => acc + (subject as any).unitsCount || 0, 0);
  const totalPlans = subjects.reduce((acc, subject) => acc + (subject as any).plansCount || 0, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Plataforma de Materiais Didáticos
          </h1>
          <p className="text-gray-600">
            Geração automática de materiais didáticos de Cultura Digital alinhados à BNCC
          </p>
        </header>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-gray-600 text-sm font-medium mb-2">Disciplinas</h3>
            <p className="text-3xl font-bold text-indigo-600">
              {loading ? '...' : subjects.length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-gray-600 text-sm font-medium mb-2">Unidades</h3>
            <p className="text-3xl font-bold text-indigo-600">
              {loading ? '...' : totalUnits}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-gray-600 text-sm font-medium mb-2">Planos de Aula</h3>
            <p className="text-3xl font-bold text-indigo-600">
              {loading ? '...' : totalPlans}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="mb-8">
          <Link
            href="/professor/disciplinas/new"
            className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-md"
          >
            <span className="mr-2">+</span>
            Nova Disciplina
          </Link>
        </div>

        {/* Subjects List */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Carregando...</p>
          </div>
        ) : subjects.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <p className="text-gray-600 mb-4">Nenhuma disciplina cadastrada</p>
            <Link
              href="/professor/disciplinas/new"
              className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Criar Primeira Disciplina
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subjects.map((subject) => (
              <Link
                key={subject.id}
                href={`/professor/disciplinas/${subject.id}`}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <h3 className="text-xl font-bold text-gray-800 mb-2">{subject.name}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {subject.description || 'Sem descrição'}
                </p>
                <div className="flex flex-wrap gap-2">
                  {subject.schoolYears.map((year) => (
                    <span
                      key={year}
                      className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded text-xs"
                    >
                      {year}
                    </span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
