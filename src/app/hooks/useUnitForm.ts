import { useState, useEffect, useCallback } from 'react';
import { ApplicationServiceFactory } from '@/application';
import type { Subject } from '@/application/viewmodels';
import { getErrorMessage } from '@/app/utils/errorHandler';

export interface UnitFormData {
  subjectId: string;
  title: string;
  theme: string;
  isAIGenerated: boolean;
}

/**
 * Hook customizado para lógica do formulário de unidade
 * Separa lógica de negócio da apresentação
 */
export function useUnitForm(initialSubjectId?: string) {
  const [formData, setFormData] = useState<UnitFormData>({
    subjectId: initialSubjectId || '',
    title: '',
    theme: '',
    isAIGenerated: false,
  });
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [suggestions, setSuggestions] = useState<Array<{ title: string; theme: string }>>([]);
  const [loading, setLoading] = useState(false);
  const [loadingSubjects, setLoadingSubjects] = useState(true);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadSubjects();
  }, []);

  useEffect(() => {
    if (formData.subjectId && subjects.length > 0) {
      loadSuggestions(formData.subjectId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.subjectId, subjects.length]);

  const loadSubjects = useCallback(async () => {
    try {
      setLoadingSubjects(true);
      const subjectService = ApplicationServiceFactory.createSubjectService();
      const allSubjects = await subjectService.findAll();
      setSubjects(allSubjects);
      if (allSubjects.length > 0 && !formData.subjectId && !initialSubjectId) {
        setFormData((prev) => ({ ...prev, subjectId: allSubjects[0].id }));
      }
    } catch (err: any) {
      setError(getErrorMessage(err));
    } finally {
      setLoadingSubjects(false);
    }
  }, [formData.subjectId, initialSubjectId]);

  const loadSuggestions = useCallback(async (subjectId: string) => {
    try {
      setLoadingSuggestions(true);
      const unitService = ApplicationServiceFactory.createUnitService();
      const suggested = await unitService.suggest({
        subjectId,
        numberOfSuggestions: 5,
      });
      setSuggestions(suggested);
    } catch (err: any) {
      console.error('Erro ao carregar sugestões:', err);
      setSuggestions([]);
    } finally {
      setLoadingSuggestions(false);
    }
  }, []);

  const selectSuggestion = useCallback((suggestion: { title: string; theme: string }) => {
    setFormData((prev) => ({
      ...prev,
      title: suggestion.title,
      theme: suggestion.theme,
      isAIGenerated: true,
    }));
  }, []);

  const createUnit = useCallback(async (data: UnitFormData) => {
    try {
      setLoading(true);
      setError(null);

      const unitService = ApplicationServiceFactory.createUnitService();
      const unit = await unitService.create({
        subjectId: data.subjectId,
        title: data.title.trim(),
        theme: data.theme.trim(),
        isAIGenerated: data.isAIGenerated,
      });

      return unit;
    } catch (err: any) {
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    formData,
    setFormData,
    subjects,
    suggestions,
    loading,
    loadingSubjects,
    loadingSuggestions,
    error,
    selectSuggestion,
    createUnit,
  };
}
