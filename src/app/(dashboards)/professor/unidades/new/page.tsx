// src/app/(dashboards)/professor/unidades/new/page.tsx
'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getLessonPlanService } from '@/lib/service';
import { PresentationMapper } from '@/application';
import type { SubjectViewModel, SchoolYearViewModel } from '@/application/viewmodels';
import { SCHOOL_YEARS } from '@/core/constants/SchoolYears';
import { PageContainer } from '@/components/layout/PageContainer';
import { Loading } from '@/components/ui/Loading';
import { Button } from '@/components';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { useFormValidation } from '@/hooks';
import { showError, showSuccess } from '@/utils/notifications';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

function NewUnitPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const subjectId = searchParams.get('subjectId') || '';

  const [subject, setSubject] = useState<SubjectViewModel | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    topic: '',
    description: '',
    gradeYear: '8º Ano' as SchoolYearViewModel,
  });

  const { validateForm, getError, validateAndSetError, clearError } = useFormValidation({
    topic: [
      {
        validator: (value: string) => value.trim().length > 0,
        message: 'Tema da unidade é obrigatório',
      },
      {
        validator: (value: string) => value.trim().length >= 5,
        message: 'Tema deve ter pelo menos 5 caracteres',
      },
    ],
    description: [
      {
        validator: (value: string) => !value || value.trim().length <= 500,
        message: 'Descrição deve ter no máximo 500 caracteres',
      },
    ],
  });

  const availableGradeYears: SchoolYearViewModel[] = subject?.gradeYears && subject.gradeYears.length > 0
    ? SCHOOL_YEARS.filter(year => subject.gradeYears!.includes(year))
    : SCHOOL_YEARS;

  const gradeYearOptions = availableGradeYears.map(year => ({
    value: year,
    label: year,
  }));

  useEffect(() => {
    if (!subjectId) {
      router.push('/professor');
      return;
    }

    const service = getLessonPlanService();

    try {
      const foundSubjectEntity = service.getSubjectById(subjectId);
      const foundSubject = foundSubjectEntity ? PresentationMapper.toSubjectViewModel(foundSubjectEntity) : undefined;

      if (!foundSubject) {
        router.push('/professor');
        return;
      }

      setSubject(foundSubject);
      if (foundSubject.gradeYears && foundSubject.gradeYears.length > 0) {
        setFormData(prev => ({ ...prev, gradeYear: foundSubject.gradeYears![0] as SchoolYearViewModel }));
      }
    } catch (error) {
      console.error('Erro ao carregar disciplina:', error);
      showError('Erro ao carregar disciplina');
    } finally {
      setLoading(false);
    }
  }, [subjectId, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm(formData)) {
      showError('Por favor, corrija os erros no formulário');
      return;
    }

    setSaving(true);

    try {
      const service = getLessonPlanService();
      service.createUnit(
        subjectId,
        formData.gradeYear as any,
        formData.topic.trim(),
        formData.description.trim() || undefined
      );

      showSuccess('Unidade criada com sucesso!');
      router.push(`/professor/disciplinas/${subjectId}`);
    } catch (error: any) {
      showError(error.message || 'Erro ao criar unidade');
    } finally {
      setSaving(false);
    }
  };

  const handleFieldChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (getError(field)) {
      clearError(field);
    }
  };

  const handleFieldBlur = (field: string, value: any) => {
    validateAndSetError(field, value);
  };

  if (loading) {
    return <Loading />;
  }

  if (!subject) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-primary-50/30 to-gray-50">
      {/* Header Moderno */}
      <div className="bg-gradient-to-r from-primary-600 via-primary-500 to-indigo-600 shadow-xl border-b border-primary-700/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-3">
                <BackButton 
                  href={`/professor/disciplinas/${subjectId}`} 
                  className="bg-white/20 hover:bg-white/30 text-white border-white/30" 
                />
              </div>
              <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
                <span className="text-5xl">➕</span>
                <span>Nova Unidade - {subject.name}</span>
              </h1>
              <p className="text-primary-100 text-lg">Crie uma nova unidade de ensino para esta disciplina</p>
            </div>
          </div>
        </div>
      </div>

      <PageContainer maxWidth="md">
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 hover:shadow-2xl transition-all duration-300">
          <div className="space-y-6">
            <Input
              id="topic"
              label="Tema da Unidade"
              value={formData.topic}
              onChange={(e) => handleFieldChange('topic', e.target.value)}
              onBlur={(e) => handleFieldBlur('topic', e.target.value)}
              error={getError('topic')}
              required
              placeholder="Ex: Introdução à Cultura Digital"
            />

            <Textarea
              id="description"
              label="Descrição (opcional)"
              value={formData.description}
              onChange={(e) => handleFieldChange('description', e.target.value)}
              onBlur={(e) => handleFieldBlur('description', e.target.value)}
              error={getError('description')}
              rows={3}
              placeholder="Breve descrição do que será abordado nesta unidade"
            />

            <Select
              id="gradeYear"
              label="Série/Ano"
              value={formData.gradeYear}
              onChange={(e) => handleFieldChange('gradeYear', e.target.value)}
              required
              options={gradeYearOptions}
            />

            <div className="flex gap-4 pt-4">
              <Button type="submit" disabled={saving} className="flex-1 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all">
                {saving ? (
                  <>
                    <span className="mr-2">⏳</span>
                    Criando...
                  </>
                ) : (
                  <>
                    <span className="mr-2">✅</span>
                    Criar Unidade
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => router.push(`/professor/disciplinas/${subjectId}`)}
                className="flex-1 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
              >
                Cancelar
              </Button>
            </div>
          </div>
        </form>
      </PageContainer>
    </div>
  );
}

export default function NewUnitPage() {
  return (
    <ProtectedRoute allowedRoles={['professor', 'admin']}>
      <Suspense fallback={<Loading />}>
        <NewUnitPageContent />
      </Suspense>
    </ProtectedRoute>
  );
}
