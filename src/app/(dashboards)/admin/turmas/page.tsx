// src/app/(dashboards)/admin/turmas/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { PageContainer } from '@/components';
import { Button } from '@/components/ui/Button';
import { Input, Select } from '@/components';
import { ClassCard } from '@/app/components/ClassCard';
import { Class } from '@/core/entities/Class';
import { SchoolYear } from '@/core/entities/LessonPlan';
import { getClassService } from '@/lib/service';
import { showSuccess, showError } from '@/utils/notifications';

const SCHOOL_YEARS: SchoolYear[] = [
  '6º Ano',
  '7º Ano',
  '8º Ano',
  '9º Ano',
  '1º Ano EM',
  '2º Ano EM',
  '3º Ano EM',
];

export default function TurmasPage() {
  const { isAdmin } = useAuth();
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [filterGradeYear, setFilterGradeYear] = useState<SchoolYear | ''>('');
  const [filterSchoolYear, setFilterSchoolYear] = useState('');

  // Formulário de criação
  const [formData, setFormData] = useState({
    name: '',
    gradeYear: '' as SchoolYear | '',
    schoolYear: new Date().getFullYear().toString(),
  });

  const classService = getClassService();

  useEffect(() => {
    if (isAdmin) {
      loadClasses();
    }
  }, [isAdmin]);

  const loadClasses = () => {
    try {
      const allClasses = classService.getClasses();
      setClasses(allClasses);
    } catch (error) {
      showError('Erro ao carregar turmas');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.gradeYear || !formData.schoolYear) {
      showError('Preencha todos os campos');
      return;
    }

    try {
      classService.createClass(
        formData.name,
        formData.gradeYear as SchoolYear,
        formData.schoolYear
      );
      showSuccess('Turma criada com sucesso!');
      setShowCreateForm(false);
      setFormData({
        name: '',
        gradeYear: '' as SchoolYear | '',
        schoolYear: new Date().getFullYear().toString(),
      });
      loadClasses();
    } catch (error: any) {
      showError(error.message || 'Erro ao criar turma');
    }
  };

  const handleDelete = (id: string) => {
    try {
      classService.deleteClass(id);
      showSuccess('Turma excluída com sucesso!');
      loadClasses();
    } catch (error: any) {
      showError(error.message || 'Erro ao excluir turma');
    }
  };

  if (!isAdmin) {
    return (
      <PageContainer>
        <div className="text-center py-12">
          <p className="text-red-600">Acesso negado. Apenas administradores podem acessar esta página.</p>
        </div>
      </PageContainer>
    );
  }

  // Filtra turmas
  let filteredClasses = classes;
  if (filterGradeYear) {
    filteredClasses = filteredClasses.filter(c => c.gradeYear === filterGradeYear);
  }
  if (filterSchoolYear) {
    filteredClasses = filteredClasses.filter(c => c.schoolYear === filterSchoolYear);
  }

  return (
    <PageContainer>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Gerenciar Turmas</h1>
          <p className="text-gray-600">Gerencie as turmas do sistema</p>
        </div>
        <Button
          onClick={() => setShowCreateForm(!showCreateForm)}
          variant="primary"
        >
          + Nova Turma
        </Button>
      </div>

      {showCreateForm && (
        <div className="mb-6 bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-bold mb-4">Criar Nova Turma</h2>
          <form onSubmit={handleCreate} className="space-y-4 max-w-md">
            <Input
              id="name"
              label="Nome da Turma"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Ex: 6º Ano A"
              required
            />
            <Select
              id="gradeYear"
              label="Série/Ano"
              value={formData.gradeYear}
              onChange={(e) => setFormData({ ...formData, gradeYear: e.target.value as SchoolYear })}
              placeholder="Selecione a série"
              options={SCHOOL_YEARS.map(gy => ({ value: gy, label: gy }))}
              required
            />
            <Input
              id="schoolYear"
              label="Ano Letivo"
              value={formData.schoolYear}
              onChange={(e) => setFormData({ ...formData, schoolYear: e.target.value })}
              placeholder="Ex: 2024"
              required
            />
            <div className="flex gap-2">
              <Button type="submit">Criar Turma</Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => setShowCreateForm(false)}
              >
                Cancelar
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Filtros */}
      <div className="mb-6 bg-white rounded-lg border border-gray-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            id="filterGradeYear"
            label="Filtrar por Série"
            value={filterGradeYear}
            onChange={(e) => setFilterGradeYear(e.target.value as SchoolYear || '')}
            placeholder="Todas as séries"
            options={[
              { value: '', label: 'Todas as séries' },
              ...SCHOOL_YEARS.map(gy => ({ value: gy, label: gy })),
            ]}
          />
          <Input
            id="filterSchoolYear"
            label="Filtrar por Ano Letivo"
            value={filterSchoolYear}
            onChange={(e) => setFilterSchoolYear(e.target.value)}
            placeholder="Ex: 2024"
          />
        </div>
      </div>

      {/* Lista de Turmas */}
      {loading ? (
        <div className="text-center py-12 text-gray-500">Carregando...</div>
      ) : filteredClasses.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <p className="text-gray-500">
            {classes.length === 0
              ? 'Nenhuma turma cadastrada. Crie a primeira turma!'
              : 'Nenhuma turma encontrada com os filtros selecionados.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClasses.map((classEntity) => (
            <ClassCard
              key={classEntity.id}
              classEntity={classEntity}
              showActions
              onView={() => window.location.href = `/admin/turmas/${classEntity.id}`}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </PageContainer>
  );
}
