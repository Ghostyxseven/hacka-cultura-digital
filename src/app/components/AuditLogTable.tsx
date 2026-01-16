// src/app/components/AuditLogTable.tsx
'use client';

import { AuditLog, AuditActionType, AuditSeverity } from '@/core/entities/AuditLog';
import { Button } from '@/components/ui/Button';

interface AuditLogTableProps {
  logs: AuditLog[];
  onReview?: (logId: string) => void;
  onViewDetails?: (log: AuditLog) => void;
}

/**
 * Componente de tabela para exibir logs de auditoria
 */
export function AuditLogTable({ logs, onReview, onViewDetails }: AuditLogTableProps) {
  const getSeverityColor = (severity: AuditSeverity) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'error':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'info':
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const getActionLabel = (action: AuditActionType): string => {
    const labels: Record<AuditActionType, string> = {
      lesson_plan_created: 'Plano Criado',
      lesson_plan_updated: 'Plano Atualizado',
      lesson_plan_deleted: 'Plano Excluído',
      lesson_plan_shared: 'Plano Compartilhado',
      lesson_plan_refined: 'Plano Refinado',
      subject_created: 'Disciplina Criada',
      subject_updated: 'Disciplina Atualizada',
      subject_deleted: 'Disciplina Excluída',
      unit_created: 'Unidade Criada',
      unit_updated: 'Unidade Atualizada',
      unit_deleted: 'Unidade Excluída',
      quiz_result_updated: 'Resultado Atualizado',
      grade_updated: 'Nota Atualizada',
      user_created: 'Usuário Criado',
      user_updated: 'Usuário Atualizado',
      user_deleted: 'Usuário Excluído',
      announcement_created: 'Aviso Criado',
      announcement_deleted: 'Aviso Excluído',
      material_uploaded: 'Material Enviado',
      material_deleted: 'Material Excluído',
      system_config_changed: 'Configuração Alterada',
    };
    return labels[action] || action;
  };

  if (logs.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p>Nenhum log encontrado</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Data/Hora
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Ação
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Usuário
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Descrição
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Severidade
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Ações
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {logs.map((log) => (
            <tr key={log.id} className="hover:bg-gray-50">
              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                {new Date(log.timestamp).toLocaleString('pt-BR')}
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                {getActionLabel(log.action)}
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                <div>
                  <div className="font-medium">{log.userEmail || log.userId}</div>
                  <div className="text-xs text-gray-400">{log.userRole}</div>
                </div>
              </td>
              <td className="px-4 py-3 text-sm text-gray-900 max-w-md truncate">
                {log.description}
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                <span
                  className={`
                    inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border
                    ${getSeverityColor(log.severity)}
                  `}
                >
                  {log.severity}
                </span>
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-sm">
                {log.reviewed ? (
                  <span className="text-green-600 font-medium">✓ Revisado</span>
                ) : (
                  <span className="text-yellow-600 font-medium">Pendente</span>
                )}
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                <div className="flex gap-2">
                  {onViewDetails && (
                    <Button
                      onClick={() => onViewDetails(log)}
                      variant="secondary"
                      size="sm"
                    >
                      Ver
                    </Button>
                  )}
                  {!log.reviewed && onReview && (
                    <Button
                      onClick={() => onReview(log.id)}
                      variant="secondary"
                      size="sm"
                      className="bg-green-50 text-green-700 hover:bg-green-100"
                    >
                      Revisar
                    </Button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
