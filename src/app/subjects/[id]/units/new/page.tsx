// src/app/subjects/[id]/units/new/page.tsx
// Wireframe 4: Tela de Nova Unidade
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getLessonPlanService } from '@/lib/service';
import { Subject } from '@/core/entities/Subject';
import { SchoolYear } from '@/core/entities/LessonPlan';
import Link from 'next/link';

const SCHOOL_YEARS: SchoolYear[] = [
  '6º Ano',
  '7º Ano',
  '8º Ano',
  '9º Ano',
  '1º Ano EM',
  '2º Ano EM',
  '3º Ano EM',
];

export default function NewUnitPage() {
  const params = useParams();
  const router = useRouter();
  const subjectId = params.id as string;
  
  const [subject, setSubject] = useState<Subject | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    topic: '',
    description: '',
    gradeYear: '8º Ano' as SchoolYear,
  });

  useEffect(() => {
    const service = getLessonPlanService();
    const allSubjects = service.getSubjects();
    const foundSubject = allSubjects.find(s => s.id === subjectId);
    
    if (!foundSubject) {
      router.push('/');
      return;
    }
    
    setSubject(foundSubject);
    // Usa o primeiro gradeYear da disciplina se disponível
    if (foundSubject.gradeYears && foundSubject.gradeYears.length > 0) {
      setFormData(prev => ({ ...prev, gradeYear: foundSubject.gradeYears![0] }));
    }
    setLoading(false);
  }, [subjectId, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const service = getLessonPlanService();
      service.createUnit(
        subjectId,
        formData.gradeYear,
        formData.topic,
        formData.description || undefined
      );
      
      router.push(`/subjects/${subjectId}`);
    } catch (error: any) {
      alert(error.message || 'Erro ao criar unidade');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-gray-600">Carregando...</div>
      </div>
    );
  }

  if (!subject) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href={`/subjects/${subjectId}`} className="text-primary-600 hover:text-primary-700">
            ← Voltar
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 mt-2">
            Nova Unidade - {subject.name}
          </h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
          <div className="space-y-6">
            {/* Tema */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tema da Unidade/Aula *
              </label>
              <input
                type="text"
                required
                value={formData.topic}
                onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Ex: Equações do 2º grau, Revolução Francesa, etc."
              />
            </div>

            {/* Ano/Série */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ano/Série *
              </label>
              <select
                value={formData.gradeYear}
                onChange={(e) => setFormData({ ...formData, gradeYear: e.target.value as SchoolYear })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                {SCHOOL_YEARS.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>

            {/* Descrição */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descrição (Opcional)
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Descrição adicional da unidade de ensino"
              />
            </div>

            {/* Botões */}
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 transition-colors"
              >
                {saving ? 'Salvando...' : 'Salvar Unidade'}
              </button>
              <Link
                href={`/subjects/${subjectId}`}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </Link>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}
