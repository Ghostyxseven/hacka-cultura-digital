// src/app/pages/NewUnitPage.tsx
// Componente de página para Nova Unidade
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getLessonPlanService } from '@/lib/service';
import type { SubjectViewModel, SchoolYearViewModel } from '@/app/types';
import { SCHOOL_YEARS } from '@/constants/schoolYears';
import { Header, PageContainer, Loading, Button, Input, Textarea, Select } from '@/components';
import { useFormValidation } from '@/hooks';
import { showError, showSuccess } from '@/utils/notifications';
import Link from 'next/link';

interface NewUnitPageProps {
  subjectId: string;
}

export function NewUnitPage({ subjectId }: NewUnitPageProps) {
  const router = useRouter();
  const [subject, setSubject] = useState<SubjectViewModel | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    topic: '',
    description: '',
    gradeYear: '8º Ano' as SchoolYearViewModel,
  });

  // Validação de formulário
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
      {
        validator: (value: string) => !value || value.trim().length <= 200,
        message: 'O tema não pode ter mais de 200 caracteres',
      },
    ],
    description: [
      {
        validator: (value: string) => !value || value.trim().length <= 1000,
        message: 'A descrição não pode ter mais de 1000 caracteres',
      },
    ],
  });

  // Filtrar séries disponíveis baseado na disciplina
  const availableGradeYears: SchoolYearViewModel[] = subject?.gradeYears && subject.gradeYears.length > 0
    ? SCHOOL_YEARS.filter(year => subject.gradeYears!.includes(year))
    : SCHOOL_YEARS;

  const gradeYearOptions = availableGradeYears.map(year => ({
    value: year,
    label: year,
  }));

  useEffect(() => {
    const service = getLessonPlanService();
    
    try {
      // Usa método do serviço que retorna ViewModel (sem lógica de negócio na página)
      const foundSubject = service.getSubjectByIdViewModel(subjectId);
      
      if (!foundSubject) {
        router.push('/');
        return;
      }
      
      setSubject(foundSubject);
      // Define o primeiro ano disponível como padrão
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

    // Validação do formulário
    if (!validateForm(formData)) {
      showError('Por favor, corrija os erros no formulário');
      return;
    }

    setSaving(true);

    try {
      const service = getLessonPlanService();
      service.createUnitViewModel(
        subjectId,
        formData.gradeYear as any, // Cast necessário devido à compatibilidade de tipos
        formData.topic.trim(),
        formData.description.trim() || undefined
      );
      
      showSuccess('Unidade criada com sucesso!');
      router.push(`/subjects/${subjectId}`);
    } catch (error: any) {
      showError(error.message || 'Erro ao criar unidade');
    } finally {
      setSaving(false);
    }
  };

  const handleFieldChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Limpa o erro quando o usuário começa a digitar
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
    <div className="min-h-screen bg-gray-50">
      <Header
        title={`Nova Unidade - ${subject.name}`}
        backHref={`/subjects/${subjectId}`}
      />

      <PageContainer maxWidth="md">
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
          <div className="space-y-6">
            {/* Tema */}
            <Input
              id="topic"
              label="Tema da Unidade/Aula"
              type="text"
              required
              value={formData.topic}
              onChange={(e) => handleFieldChange('topic', e.target.value)}
              onBlur={(e) => handleFieldBlur('topic', e.target.value)}
              placeholder="Ex: Equações do 2º grau, Revolução Francesa, etc."
              error={getError('topic')}
              helperText="Tema principal da unidade de ensino"
            />

            {/* Ano/Série */}
            <Select
              id="gradeYear"
              label="Ano/Série"
              required
              value={formData.gradeYear}
              onChange={(e) => handleFieldChange('gradeYear', e.target.value as SchoolYearViewModel)}
              options={gradeYearOptions}
              error={getError('gradeYear')}
              helperText={
                subject.gradeYears && subject.gradeYears.length > 0
                  ? `Séries disponíveis para ${subject.name}`
                  : 'Selecione o ano/série'
              }
            />

            {/* Descrição */}
            <Textarea
              id="description"
              label="Descrição"
              value={formData.description}
              onChange={(e) => handleFieldChange('description', e.target.value)}
              onBlur={(e) => handleFieldBlur('description', e.target.value)}
              rows={4}
              placeholder="Descrição adicional da unidade de ensino"
              error={getError('description')}
              helperText="Opcional: descrição detalhada da unidade"
            />

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
