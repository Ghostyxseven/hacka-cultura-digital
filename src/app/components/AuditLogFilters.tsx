// src/app/components/AuditLogFilters.tsx
'use client';

import { AuditActionType, AuditSeverity } from '@/core/entities/AuditLog';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';

interface AuditLogFiltersProps {
  filters: {
    action?: AuditActionType;
    severity?: AuditSeverity;
    userId?: string;
    startDate?: string;
    endDate?: string;
    unreviewedOnly?: boolean;
  };
  onFilterChange: (filters: any) => void;
  onReset: () => void;
}

/**
 * Componente de filtros para logs de auditoria
 */
export function AuditLogFilters({ filters, onFilterChange, onReset }: AuditLogFiltersProps) {
  const actionOptions: { value: AuditActionType; label: string }[] = [
    { value: 'lesson_plan_created', label: 'Plano Criado' },
    { value: 'lesson_plan_updated', label: 'Plano Atualizado' },
    { value: 'lesson_plan_deleted', label: 'Plano Excluído' },
    { value: 'lesson_plan_shared', label: 'Plano Compartilhado' },
    { value: 'subject_created', label: 'Disciplina Criada' },
    { value: 'subject_deleted', label: 'Disciplina Excluída' },
    { value: 'grade_updated', label: 'Nota Atualizada' },
    { value: 'user_created', label: 'Usuário Criado' },
    { value: 'user_deleted', label: 'Usuário Excluído' },
  ];

  const severityOptions: { value: AuditSeverity; label: string }[] = [
    { value: 'info', label: 'Info' },
    { value: 'warning', label: 'Aviso' },
    { value: 'error', label: 'Erro' },
    { value: 'critical', label: 'Crítico' },
  ];

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tipo de Ação
          </label>
          <Select
            value={filters.action || ''}
            onChange={(e) => onFilterChange({ ...filters, action: e.target.value as AuditActionType || undefined })}
          >
            <option value="">Todas</option>
            {actionOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Severidade
          </label>
          <Select
            value={filters.severity || ''}
            onChange={(e) => onFilterChange({ ...filters, severity: e.target.value as AuditSeverity || undefined })}
          >
            <option value="">Todas</option>
            {severityOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Data Inicial
          </label>
          <Input
            type="date"
            value={filters.startDate || ''}
            onChange={(e) => onFilterChange({ ...filters, startDate: e.target.value || undefined })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Data Final
          </label>
          <Input
            type="date"
            value={filters.endDate || ''}
            onChange={(e) => onFilterChange({ ...filters, endDate: e.target.value || undefined })}
          />
        </div>
      </div>

      <div className="mt-4 flex items-center gap-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={filters.unreviewedOnly || false}
            onChange={(e) => onFilterChange({ ...filters, unreviewedOnly: e.target.checked })}
            className="w-4 h-4"
          />
          <span className="text-sm text-gray-700">Apenas não revisados</span>
        </label>

        <Button onClick={onReset} variant="secondary" size="sm">
          Limpar Filtros
        </Button>
      </div>
    </div>
  );
}
