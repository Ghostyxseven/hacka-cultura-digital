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

      // Validação básica
      const trimmedName = data.name.trim();
      if (!trimmedName) {
        throw new Error('Nome da disciplina é obrigatório');
      }

      if (trimmedName.length < 2) {
        throw new Error('O nome da disciplina deve ter pelo menos 2 caracteres');
      }

      if (trimmedName.length > 100) {
        throw new Error('O nome da disciplina não pode ter mais de 100 caracteres');
      }

      if (data.schoolYears.length === 0) {
        throw new Error('Selecione pelo menos um ano escolar');
      }

      const subjectService = ApplicationServiceFactory.createSubjectService();
      const subject = await subjectService.create({
        name: trimmedName,
        description: data.description.trim(),
        schoolYears: data.schoolYears,
      });

      return subject;
    } catch (err: any) {
      const errorMessage = err.message || 'Erro ao criar disciplina';
      setError(errorMessage);
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
