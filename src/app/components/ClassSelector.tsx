// src/app/components/ClassSelector.tsx
'use client';

import { Select } from '@/components/ui/Select';
import { Class } from '@/core/entities/Class';
import { SchoolYear } from '@/core/entities/LessonPlan';

interface ClassSelectorProps {
  classes: Class[];
  value: string;
  onChange: (classId: string) => void;
  label?: string;
  placeholder?: string;
  filterByGradeYear?: SchoolYear;
  error?: string;
  required?: boolean;
  disabled?: boolean;
}

/**
 * Componente seletor de turma com filtros
 */
export function ClassSelector({
  classes,
  value,
  onChange,
  label = 'Turma',
  placeholder = 'Selecione uma turma',
  filterByGradeYear,
  error,
  required,
  disabled,
}: ClassSelectorProps) {
  // Filtra por série se especificado
  let filteredClasses = classes;
  if (filterByGradeYear) {
    filteredClasses = classes.filter(c => c.gradeYear === filterByGradeYear);
  }

  // Ordena por nome
  const sortedClasses = [...filteredClasses].sort((a, b) => a.name.localeCompare(b.name));

  const options = sortedClasses.map(c => ({
    value: c.id,
    label: `${c.name} (${c.gradeYear} - ${c.schoolYear})`,
  }));

  return (
    <Select
      id="classId"
      label={label}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      options={options}
      error={error}
      required={required}
      disabled={disabled}
    />
  );
}
