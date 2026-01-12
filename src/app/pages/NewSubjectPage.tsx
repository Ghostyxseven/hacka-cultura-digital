// src/app/pages/NewSubjectPage.tsx
// Componente de página para Nova Disciplina
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { getLessonPlanService } from '@/lib/service';
import type { SchoolYearViewModel } from '@/app/types';
import { SCHOOL_YEARS } from '@/constants/schoolYears';
import { PageContainer, Button, Input, Textarea } from '@/components';
import { HeaderWithAuth } from '@/components/layout/HeaderWithAuth';
import { useFormValidation } from '@/hooks';
import { showError, showSuccess } from '@/utils/notifications';
import Link from 'next/link';

export function NewSubjectPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color: 'blue-500',
    icon: 'book',
    gradeYears: [] as SchoolYearViewModel[],
  });

  // Validação de formulário
  const { validateForm, validateAndSetError, getError, clearError } = useFormValidation({
    name: [
      {
        validator: (value: string) => !!value && value.trim().length > 0,
        message: 'Nome da disciplina é obrigatório',
      },
      {
        validator: (value: string) => !value || value.trim().length >= 3,
        message: 'O nome deve ter pelo menos 3 caracteres',
      },
      {
        validator: (value: string) => !value || value.trim().length <= 100,
        message: 'O nome não pode ter mais de 100 caracteres',
      },
    ],
    description: [
      {
        validator: (value: string) => !value || value.trim().length <= 500,
        message: 'A descrição não pode ter mais de 500 caracteres',
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

    // Validação do formulário
    if (!validateForm(formData)) {
      showError('Por favor, corrija os erros no formulário');
      return;
    }

    setLoading(true);

    try {
      const service = getLessonPlanService();
      await service.createSubjectViewModel(
        formData.name.trim(),
        formData.description.trim() || undefined,
        formData.color.trim() || undefined,
        formData.icon.trim() || undefined,
        formData.gradeYears.length > 0 ? formData.gradeYears : undefined
      );
      
      showSuccess('Disciplina criada com sucesso!');
      router.push('/');
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
    // Validação em tempo real
    if (getError(field)) {
      validateAndSetError(field, value);
    }
  };

  const handleFieldBlur = (field: string, value: any) => {
    validateAndSetError(field, value);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <HeaderWithAuth title="Nova Disciplina" backHref="/professor" />

      <PageContainer maxWidth="md">
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
          <div className="space-y-6">
            {/* Nome */}
            <Input
              id="name"
              label="Nome da Disciplina"
              type="text"
              required
              value={formData.name}
              onChange={(e) => handleFieldChange('name', e.target.value)}
              onBlur={(e) => handleFieldBlur('name', e.target.value)}
              placeholder="Ex: Matemática, História, Cultura Digital"
              error={getError('name')}
              helperText="Nome único da disciplina"
            />

            {/* Descrição */}
            <Textarea
              id="description"
              label="Descrição"
              value={formData.description}
              onChange={(e) => handleFieldChange('description', e.target.value)}
              onBlur={(e) => handleFieldBlur('description', e.target.value)}
              rows={3}
              placeholder="Breve descrição da disciplina"
              error={getError('description')}
              helperText="Opcional: descrição breve da disciplina"
            />

            {/* Séries/Anos */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Séries/Anos Associados
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {SCHOOL_YEARS.map((year) => (
                  <button
                    key={year}
                    type="button"
                    onClick={() => toggleGradeYear(year)}
                    className={`px-4 py-2 rounded-lg border transition-colors ${
                      formData.gradeYears.includes(year)
                        ? 'bg-primary-600 text-white border-primary-600'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-primary-500'
                    }`}
                  >
                    {year}
                  </button>
                ))}
              </div>
              {formData.gradeYears.length > 0 && (
                <p className="mt-2 text-sm text-gray-500">
                  {formData.gradeYears.length} série(s) selecionada(s)
                </p>
              )}
            </div>

            {/* Cor e Ícone */}
            <div className="grid grid-cols-2 gap-4">
              <Input
                id="color"
                label="Cor"
                type="text"
                value={formData.color}
                onChange={(e) => handleFieldChange('color', e.target.value)}
                onBlur={(e) => handleFieldBlur('color', e.target.value)}
                placeholder="blue-500"
                error={getError('color')}
                helperText="Formato: nome-numero (ex: blue-500)"
              />
              <Input
                id="icon"
                label="Ícone"
                type="text"
                value={formData.icon}
                onChange={(e) => handleFieldChange('icon', e.target.value)}
                placeholder="book"
                helperText="Nome do ícone (opcional)"
              />
            </div>

            {/* Botões */}
            <div className="flex gap-4 pt-4">
              <Button type="submit" disabled={loading} className="flex-1">
                {loading ? 'Salvando...' : 'Salvar Disciplina'}
              </Button>
              <Link href="/">
                <Button variant="secondary">Cancelar</Button>
              </Link>
            </div>
          </div>
        </form>
      </PageContainer>
    </div>
  );
}
