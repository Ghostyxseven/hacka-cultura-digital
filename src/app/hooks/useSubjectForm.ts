import { useState, useCallback, useEffect, useRef } from 'react';
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
  const [nameValidation, setNameValidation] = useState<{
    isValidating: boolean;
    isAvailable: boolean | null;
    message: string | null;
  }>({
    isValidating: false,
    isAvailable: null,
    message: null,
  });
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Validação de nome único em tempo real (com debounce)
  const validateNameAvailability = useCallback(async (name: string) => {
    const trimmedName = name.trim();
    
    // Reset validação se campo vazio
    if (!trimmedName || trimmedName.length < 2) {
      setNameValidation({
        isValidating: false,
        isAvailable: null,
        message: null,
      });
      return;
    }

    // Validação de comprimento mínimo
    if (trimmedName.length < 2) {
      setNameValidation({
        isValidating: false,
        isAvailable: false,
        message: 'Nome deve ter pelo menos 2 caracteres',
      });
      return;
    }

    // Validação de comprimento máximo
    if (trimmedName.length > 100) {
      setNameValidation({
        isValidating: false,
        isAvailable: false,
        message: 'Nome não pode ter mais de 100 caracteres',
      });
      return;
    }

    // Debounce: espera 500ms antes de validar
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    setNameValidation({
      isValidating: true,
      isAvailable: null,
      message: null,
    });

    debounceTimerRef.current = setTimeout(async () => {
      try {
        const subjectService = ApplicationServiceFactory.createSubjectService();
        const allSubjects = await subjectService.findAll();
        
        const exists = allSubjects.some(
          (s) => !s.archived && s.name.toLowerCase().trim() === trimmedName.toLowerCase().trim()
        );

        setNameValidation({
          isValidating: false,
          isAvailable: !exists,
          message: exists ? `Já existe uma disciplina com o nome "${trimmedName}"` : 'Nome disponível',
        });
      } catch (err: any) {
        setNameValidation({
          isValidating: false,
          isAvailable: null,
          message: null,
        });
      }
    }, 500);
  }, []);

  // Limpar timer ao desmontar
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  // Valida nome quando mudar
  useEffect(() => {
    validateNameAvailability(formData.name);
  }, [formData.name, validateNameAvailability]);

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
    nameValidation,
    toggleSchoolYear,
    createSubject,
  };
}
