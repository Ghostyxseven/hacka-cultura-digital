import { useState, useCallback } from 'react';
import { ApplicationServiceFactory } from '@/application';
import type { Subject } from '@/application/viewmodels';

export interface SubjectFormData {
  name: string;
  description: string;
  schoolYears: string[];
}

/**
 * Hook customizado para lógica do formulário de disciplina
 * Separa lógica de negócio da apresentação
 */
export function useSubjectForm() {
  const [formData, setFormData] = useState<SubjectFormData>({
    name: '',
    description: '',
    schoolYears: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleSchoolYear = useCallback((year: string) => {
    setFormData((prev) => ({
      ...prev,
      schoolYears: prev.schoolYears.includes(year)
        ? prev.schoolYears.filter((y) => y !== year)
        : [...prev.schoolYears, year],
    }));
  }, []);

  const createSubject = useCallback(async (data: SubjectFormData): Promise<Subject> => {
    try {
      setLoading(true);
      setError(null);

      if (!data.name.trim()) {
        throw new Error('Nome da disciplina é obrigatório');
      }

      if (data.schoolYears.length === 0) {
        throw new Error('Selecione pelo menos um ano escolar');
      }

      const subjectService = ApplicationServiceFactory.createSubjectService();
      const subject = await subjectService.create({
        name: data.name.trim(),
        description: data.description.trim(),
        schoolYears: data.schoolYears,
      });

      return subject;
    } catch (err: any) {
      setError(err.message || 'Erro ao criar disciplina');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    formData,
    setFormData,
    loading,
    error,
    toggleSchoolYear,
    createSubject,
  };
}
