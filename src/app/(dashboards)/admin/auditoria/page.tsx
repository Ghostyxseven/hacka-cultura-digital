// src/app/(dashboards)/admin/auditoria/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { AuditLog } from '@/core/entities/AuditLog';
import { GetAuditLogsUseCase } from '@/application/usecases/GetAuditLogsUseCase';
import { ReviewAuditLogUseCase } from '@/application/usecases/ReviewAuditLogUseCase';
import { LocalStorageAuditLogRepository } from '@/repository/implementations/LocalStorageAuditLogRepository';
import { AuditLogTable } from '@/app/components/AuditLogTable';
import { AuditLogFilters } from '@/app/components/AuditLogFilters';
import { PageContainer } from '@/components';
import { Button } from '@/components/ui/Button';

export default function AuditoriaPage() {
  const { user, isAdmin } = useAuth();
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const [filters, setFilters] = useState({
    action: undefined as any,
    severity: undefined as any,
    userId: undefined,
    startDate: undefined,
    endDate: undefined,
    unreviewedOnly: false,
  });

  useEffect(() => {
    if (!isAdmin) return;
    loadLogs();
  }, [isAdmin, filters]);

  const loadLogs = () => {
    setLoading(true);
    try {
      const repository = LocalStorageAuditLogRepository.getInstance();
      const useCase = new GetAuditLogsUseCase(repository);

      const request: any = {
        limit: 100,
      };

      if (filters.action) request.action = filters.action;
      if (filters.severity) request.severity = filters.severity;
      if (filters.userId) request.userId = filters.userId;
      if (filters.unreviewedOnly) request.unreviewedOnly = true;
      if (filters.startDate && filters.endDate) {
        request.startDate = new Date(filters.startDate);
        request.endDate = new Date(filters.endDate);
      }

      const result = useCase.execute(request);
      setLogs(result);
    } catch (error) {
      console.error('Erro ao carregar logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReview = (logId: string) => {
    if (!user) return;

    try {
      const repository = LocalStorageAuditLogRepository.getInstance();
      const useCase = new ReviewAuditLogUseCase(repository);
      useCase.execute({
        logId,
        reviewedBy: user.id,
      });
      loadLogs();
    } catch (error) {
      console.error('Erro ao revisar log:', error);
      alert('Erro ao revisar log');
    }
  };

  const handleViewDetails = (log: AuditLog) => {
    setSelectedLog(log);
  };

  const handleResetFilters = () => {
    setFilters({
      action: undefined,
      severity: undefined,
      userId: undefined,
      startDate: undefined,
      endDate: undefined,
      unreviewedOnly: false,
    });
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

  return (
    <PageContainer>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Logs de Auditoria</h1>
        <p className="text-gray-600">
          Visualize e gerencie todos os logs de ações importantes do sistema
        </p>
      </div>

      <AuditLogFilters
        filters={filters}
        onFilterChange={setFilters}
        onReset={handleResetFilters}
      />

      {loading ? (
        <div className="text-center py-12 text-gray-500">Carregando...</div>
      ) : (
        <>
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Total: {logs.length} log{logs.length !== 1 ? 's' : ''}
            </p>
            <Button onClick={loadLogs} variant="secondary" size="sm">
              Atualizar
            </Button>
          </div>

          <AuditLogTable
            logs={logs}
            onReview={handleReview}
            onViewDetails={handleViewDetails}
          />
        </>
      )}

      {/* Modal de detalhes */}
      {selectedLog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">Detalhes do Log</h2>
                <Button onClick={() => setSelectedLog(null)} variant="secondary" size="sm">
                  ✕
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Data/Hora</label>
                  <p className="text-gray-900">
                    {new Date(selectedLog.timestamp).toLocaleString('pt-BR')}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500">Ação</label>
                  <p className="text-gray-900">{selectedLog.action}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500">Descrição</label>
                  <p className="text-gray-900">{selectedLog.description}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500">Usuário</label>
                  <p className="text-gray-900">
                    {selectedLog.userEmail || selectedLog.userId} ({selectedLog.userRole})
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500">Severidade</label>
                  <p className="text-gray-900">{selectedLog.severity}</p>
                </div>

                {selectedLog.resourceType && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Recurso</label>
                    <p className="text-gray-900">
                      {selectedLog.resourceType} {selectedLog.resourceId && `(ID: ${selectedLog.resourceId})`}
                    </p>
                  </div>
                )}

                {selectedLog.details && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Detalhes</label>
                    <pre className="bg-gray-50 p-3 rounded text-sm overflow-x-auto">
                      {JSON.stringify(selectedLog.details, null, 2)}
                    </pre>
                  </div>
                )}

                {selectedLog.userAgent && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">User Agent</label>
                    <p className="text-gray-900 text-sm break-all">{selectedLog.userAgent}</p>
                  </div>
                )}

                {selectedLog.reviewed && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Revisado</label>
                    <p className="text-gray-900">
                      Sim - {selectedLog.reviewedAt && new Date(selectedLog.reviewedAt).toLocaleString('pt-BR')}
                    </p>
                    {selectedLog.notes && (
                      <p className="text-gray-600 text-sm mt-1">{selectedLog.notes}</p>
                    )}
                  </div>
                )}
              </div>

              {!selectedLog.reviewed && (
                <div className="mt-6">
                  <Button
                    onClick={() => {
                      handleReview(selectedLog.id);
                      setSelectedLog(null);
                    }}
                    variant="primary"
                    className="w-full"
                  >
                    Marcar como Revisado
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </PageContainer>
  );
}
