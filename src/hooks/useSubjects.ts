import { useState, useCallback } from 'react';

export interface Subject {
  id: string;
  name: string;
  description: string;
  schoolYears: string[];
}

export function useSubjects() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadSubjects = useCallback(() => {
    setLoading(true);
    try {
      const stored = localStorage.getItem('subjects');
      if (stored) {
        setSubjects(JSON.parse(stored));
      }
    } catch (err) {
      setError('Erro ao carregar disciplinas');
    } finally {
      setLoading(false);
    }
  }, []);

  const addSubject = useCallback((subject: Subject) => {
    try {
      setSubjects((prev) => [...prev, subject]);
      const allSubjects = [...subjects, subject];
      localStorage.setItem('subjects', JSON.stringify(allSubjects));
    } catch (err) {
      setError('Erro ao adicionar disciplina');
    }
  }, [subjects]);

  const deleteSubject = useCallback((id: string) => {
    try {
      const filtered = subjects.filter((s) => s.id !== id);
      setSubjects(filtered);
      localStorage.setItem('subjects', JSON.stringify(filtered));
    } catch (err) {
      setError('Erro ao deletar disciplina');
    }
  }, [subjects]);

  return { subjects, loading, error, loadSubjects, addSubject, deleteSubject };
}
