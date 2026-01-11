// src/app/subjects/[id]/units/new/page.tsx
// Wireframe 4: Tela de Nova Unidade
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getLessonPlanService } from '@/lib/service';
import { Subject } from '@/core/entities/Subject';
import { SchoolYear } from '@/core/entities/LessonPlan';
import { SCHOOL_YEARS } from '@/constants/schoolYears';
import { Header } from '@/components/layout/Header';
import { PageContainer } from '@/components/layout/PageContainer';
import { Loading } from '@/components/ui/Loading';
import { Button } from '@/components/ui/Button';
import { showError, showSuccess } from '@/utils/notifications';
import Link from 'next/link';

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
      
      showSuccess('Unidade criada com sucesso!');
      router.push(`/subjects/${subjectId}`);
    } catch (error: any) {
      showError(error.message || 'Erro ao criar unidade');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (!subject) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        title={`Nova Unidade - ${subject.name}`}
        backHref={`/subjects/${subjectId}`}
      />

      <PageContainer maxWidth="md">
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
              <Button type="submit" disabled={saving} className="flex-1">
                {saving ? 'Salvando...' : 'Salvar Unidade'}
              </Button>
              <Link href={`/subjects/${subjectId}`}>
                <Button variant="secondary">Cancelar</Button>
              </Link>
            </div>
          </div>
        </form>
      </PageContainer>
    </div>
  );
}
