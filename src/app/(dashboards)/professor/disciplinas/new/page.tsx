// src/app/(dashboards)/professor/disciplinas/new/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { getLessonPlanService } from '@/lib/service';
import type { SchoolYearViewModel } from '@/application/viewmodels';
import { SCHOOL_YEARS } from '@/core/constants/SchoolYears';
import { PageContainer } from '@/components/layout/PageContainer';
import { Button, BackButton } from '@/components';
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-primary-50/30 to-gray-50">
        {/* Header Moderno */}
        <div className="bg-gradient-to-r from-primary-600 via-primary-500 to-indigo-600 shadow-xl border-b border-primary-700/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-3">
                  <BackButton href="/professor" className="bg-white/20 hover:bg-white/30 text-white border-white/30" />
                </div>
                <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
                  <span className="text-5xl">➕</span>
                  <span>Nova Disciplina</span>
                </h1>
                <p className="text-primary-100 text-lg">Crie uma nova disciplina para organizar seus materiais didáticos</p>
              </div>
            </div>
          </div>
        </div>

        <PageContainer maxWidth="md">
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 hover:shadow-2xl transition-all duration-300">
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
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Séries/Anos (opcional)
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {SCHOOL_YEARS.map((year) => (
                    <label
                      key={year}
                      className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                        formData.gradeYears.includes(year)
                          ? 'bg-primary-50 border-primary-500 text-primary-700 shadow-md'
                          : 'bg-white border-gray-200 hover:bg-primary-50 hover:border-primary-300'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={formData.gradeYears.includes(year)}
                        className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500 mr-3"
                        onChange={() => toggleGradeYear(year)}
                      />
                      <span className="text-sm font-medium">{year}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <Button type="submit" disabled={loading} className="flex-1 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all">
                  {loading ? (
                    <>
                      <span className="mr-2">⏳</span>
                      Criando...
                    </>
                  ) : (
                    <>
                      <span className="mr-2">✅</span>
                      Criar Disciplina
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => router.push('/professor')}
                  className="flex-1 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
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
