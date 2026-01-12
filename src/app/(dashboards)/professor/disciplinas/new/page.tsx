// src/app/(dashboards)/professor/disciplinas/new/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { getLessonPlanService } from '@/lib/service';
import type { SchoolYearViewModel } from '@/application/viewmodels';
import { SCHOOL_YEARS } from '@/core/constants/SchoolYears';
import { PageContainer } from '@/components/layout/PageContainer';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { useFormValidation } from '@/hooks';
import { showError, showSuccess } from '@/utils/notifications';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

export default function NewSubjectPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color: '',
    icon: '',
    gradeYears: [] as SchoolYearViewModel[],
  });

  const { validateForm, getError, validateAndSetError, clearError } = useFormValidation({
    name: [
      {
        validator: (value: string) => value.trim().length > 0,
        message: 'Nome da disciplina é obrigatório',
      },
      {
        validator: (value: string) => value.trim().length >= 3,
        message: 'Nome deve ter pelo menos 3 caracteres',
      },
    ],
    description: [
      {
        validator: (value: string) => !value || value.trim().length <= 500,
        message: 'Descrição deve ter no máximo 500 caracteres',
      },
    ],
    color: [
      {
        validator: (value: string) => !value || /^[a-z]+-[0-9]{1,3}$/.test(value.trim()),
        message: 'Formato de cor inválido. Use o formato Tailwind (ex: blue-500, red-600)',
      },
    ],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm(formData)) {
      showError('Por favor, corrija os erros no formulário');
      return;
    }

    setLoading(true);

    try {
      const service = getLessonPlanService();
      await service.createSubject(
        formData.name.trim(),
        formData.description.trim() || undefined,
        formData.color.trim() || undefined,
        formData.icon.trim() || undefined,
        formData.gradeYears.length > 0 ? formData.gradeYears : undefined
      );

      showSuccess('Disciplina criada com sucesso!');
      router.push('/professor');
    } catch (error: any) {
      showError(error.message || 'Erro ao criar disciplina');
    } finally {
      setLoading(false);
    }
  };

  const toggleGradeYear = (year: SchoolYearViewModel) => {
    setFormData(prev => ({
      ...prev,
      gradeYears: prev.gradeYears.includes(year)
        ? prev.gradeYears.filter(y => y !== year)
        : [...prev.gradeYears, year],
    }));
  };

  const handleFieldChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (getError(field)) {
      validateAndSetError(field, value);
    }
  };

  const handleFieldBlur = (field: string, value: any) => {
    validateAndSetError(field, value);
  };

  return (
    <ProtectedRoute allowedRoles={['professor', 'admin']}>
      <div className="min-h-screen bg-gray-50">
        <div className="bg-gradient-to-r from-primary-50 to-white shadow-md border-b border-gray-200 p-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Nova Disciplina</h2>
          <p className="text-gray-600">Crie uma nova disciplina para organizar seus materiais didáticos</p>
        </div>

        <PageContainer maxWidth="md">
          <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 hover:shadow-xl transition-all duration-200">
            <div className="space-y-6">
              <Input
                id="name"
                label="Nome da Disciplina"
                value={formData.name}
                onChange={(e) => handleFieldChange('name', e.target.value)}
                onBlur={(e) => handleFieldBlur('name', e.target.value)}
                error={getError('name')}
                required
                placeholder="Ex: Matemática, História, Cultura Digital"
              />

              <Textarea
                id="description"
                label="Descrição (opcional)"
                value={formData.description}
                onChange={(e) => handleFieldChange('description', e.target.value)}
                onBlur={(e) => handleFieldBlur('description', e.target.value)}
                error={getError('description')}
                rows={3}
                placeholder="Breve descrição da disciplina"
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Séries/Anos (opcional)
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {SCHOOL_YEARS.map((year) => (
                    <label
                      key={year}
                      className="flex items-center p-3 border border-gray-200 rounded-xl cursor-pointer hover:bg-primary-50 hover:border-primary-300 transition-all duration-200 bg-white"
                    >
                      <input
                        type="checkbox"
                        checked={formData.gradeYears.includes(year)}
                        className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500 mr-2"
                        onChange={() => toggleGradeYear(year)}
                      />
                      <span className="text-sm">{year}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex gap-4">
                <Button type="submit" disabled={loading} className="flex-1">
                  {loading ? 'Criando...' : 'Criar Disciplina'}
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => router.push('/professor')}
                  className="flex-1"
                >
                  Cancelar
                </Button>
              </div>
            </div>
          </form>
        </PageContainer>
      </div>
    </ProtectedRoute>
  );
}
