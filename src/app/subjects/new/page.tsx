// src/app/subjects/new/page.tsx
// Wireframe 3: Tela de Nova Disciplina
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { getLessonPlanService } from '@/lib/service';
import { SchoolYear } from '@/core/entities/LessonPlan';
import { SCHOOL_YEARS } from '@/constants/schoolYears';
import { Header } from '@/components/layout/Header';
import { PageContainer } from '@/components/layout/PageContainer';
import { Button } from '@/components/ui/Button';
import { showError, showSuccess } from '@/utils/notifications';
import Link from 'next/link';

export default function NewSubjectPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color: 'blue-500',
    icon: 'book',
    gradeYears: [] as SchoolYear[],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const service = getLessonPlanService();
      service.createSubject(
        formData.name,
        formData.description || undefined,
        formData.color,
        formData.icon,
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

  const toggleGradeYear = (year: SchoolYear) => {
    setFormData(prev => ({
      ...prev,
      gradeYears: prev.gradeYears.includes(year)
        ? prev.gradeYears.filter(y => y !== year)
        : [...prev.gradeYears, year],
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Nova Disciplina" backHref="/" />

      <PageContainer maxWidth="md">
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
          <div className="space-y-6">
            {/* Nome */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nome da Disciplina *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Ex: Matemática, História, Cultura Digital"
              />
            </div>

            {/* Descrição */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descrição
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Breve descrição da disciplina"
              />
            </div>

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
            </div>

            {/* Cor e Ícone */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cor
                </label>
                <input
                  type="text"
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  placeholder="blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ícone
                </label>
                <input
                  type="text"
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  placeholder="book"
                />
              </div>
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
