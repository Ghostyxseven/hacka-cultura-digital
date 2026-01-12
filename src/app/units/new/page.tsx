// src/app/units/new/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getLessonPlanService } from '@/lib/service';
import type { SubjectViewModel, SchoolYearViewModel } from '@/app/types';
import { SCHOOL_YEARS } from '@/constants/schoolYears';
import { HeaderWithAuth } from '@/components/layout/HeaderWithAuth';
import { PageContainer } from '@/components/layout/PageContainer';
import { Loading } from '@/components/ui/Loading';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { useFormValidation } from '@/hooks';
import { showError, showSuccess } from '@/utils/notifications';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

export default function NewUnitPage() {
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

  const { validateForm, validateAndSetError, getError, clearError } = useFormValidation({
    topic: [
      {
        validator: (value: string) => !!value && value.trim().length > 0,
        message: 'Tema da unidade é obrigatório',
      },
      {
        validator: (value: string) => !value || value.trim().length >= 3,
        message: 'O tema deve ter pelo menos 3 caracteres',
      },
    ],
    description: [
      {
        validator: (value: string) => !value || value.trim().length <= 500,
        message: 'A descrição não pode ter mais de 500 caracteres',
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
      const foundSubject = service.getSubjectByIdViewModel(subjectId);
      
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
      service.createUnitViewModel(
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
    <ProtectedRoute allowedRoles={['professor', 'admin']}>
      <div className="min-h-screen bg-gray-50">
        <div className="bg-gradient-to-r from-primary-50 to-white shadow-md border-b border-gray-200 p-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Nova Unidade - {subject.name}</h2>
          <p className="text-gray-600">Crie uma nova unidade de ensino para esta disciplina</p>
        </div>

        <PageContainer maxWidth="md">

          <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 hover:shadow-xl transition-all duration-200">
            <div className="space-y-6">
              <Input
                id="topic"
                label="Tema da Unidade"
                value={formData.topic}
                onChange={(e) => handleFieldChange('topic', e.target.value)}
                onBlur={(e) => handleFieldBlur('topic', e.target.value)}
                error={getError('topic')}
                required
                placeholder="Ex: Introdução à Programação"
              />

              <Textarea
                id="description"
                label="Descrição (opcional)"
                value={formData.description}
                onChange={(e) => handleFieldChange('description', e.target.value)}
                onBlur={(e) => handleFieldBlur('description', e.target.value)}
                error={getError('description')}
                rows={4}
                placeholder="Descrição detalhada da unidade de ensino"
              />

              <Select
                id="gradeYear"
                label="Ano/Série"
                value={formData.gradeYear}
                onChange={(e) => handleFieldChange('gradeYear', e.target.value)}
                error={getError('gradeYear')}
                required
                options={gradeYearOptions}
              />

              <div className="flex gap-4">
                <Button type="submit" disabled={saving} className="flex-1">
                  {saving ? 'Criando...' : 'Criar Unidade'}
                </Button>
              </div>
            </div>
          </form>
        </PageContainer>
      </div>
    </ProtectedRoute>
  );
}
