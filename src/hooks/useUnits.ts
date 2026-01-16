import { useState, useCallback } from 'react';

export interface Unit {
  id: string;
  subjectId: string;
  title: string;
  theme: string;
  createdAt: string;
}

export function useUnits() {
  const [units, setUnits] = useState<Unit[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadUnits = useCallback(() => {
    setLoading(true);
    try {
      const stored = localStorage.getItem('units');
      if (stored) {
        setUnits(JSON.parse(stored));
      }
    } catch (err) {
      setError('Erro ao carregar unidades');
    } finally {
      setLoading(false);
    }
  }, []);

  const addUnit = useCallback((unit: Unit) => {
    try {
      setUnits((prev) => [...prev, unit]);
      const allUnits = [...units, unit];
      localStorage.setItem('units', JSON.stringify(allUnits));
    } catch (err) {
      setError('Erro ao adicionar unidade');
    }
  }, [units]);

  const deleteUnit = useCallback((id: string) => {
    try {
      const filtered = units.filter((u) => u.id !== id);
      setUnits(filtered);
      localStorage.setItem('units', JSON.stringify(filtered));
    } catch (err) {
      setError('Erro ao deletar unidade');
    }
  }, [units]);

  return { units, loading, error, loadUnits, addUnit, deleteUnit };
}
