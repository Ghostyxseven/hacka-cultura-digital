// src/application/usecases/GetAlertsUseCase.ts
import { Alert } from '../../core/entities/Alert';
import { IAlertRepository } from '../../core/repositories/IAlertRepository';

/**
 * Caso de uso: Buscar alertas
 */
export interface GetAlertsRequest {
  status?: Alert['status'];
  type?: Alert['type'];
  severity?: Alert['severity'];
  priority?: Alert['priority'];
  studentId?: string;
  unresolvedOnly?: boolean;
  newOnly?: boolean;
}

export class GetAlertsUseCase {
  constructor(private repository: IAlertRepository) {}

  execute(request: GetAlertsRequest = {}): Alert[] {
    let alerts: Alert[];

    // Busca baseada em critérios
    if (request.newOnly) {
      alerts = this.repository.getNew();
    } else if (request.unresolvedOnly) {
      alerts = this.repository.getUnresolved();
    } else if (request.status) {
      alerts = this.repository.findByStatus(request.status);
    } else {
      alerts = this.repository.getAll();
    }

    // Aplica filtros adicionais
    if (request.type) {
      alerts = alerts.filter(a => a.type === request.type);
    }

    if (request.severity) {
      alerts = alerts.filter(a => a.severity === request.severity);
    }

    if (request.priority) {
      alerts = alerts.filter(a => a.priority === request.priority);
    }

    if (request.studentId) {
      alerts = alerts.filter(a => a.studentId === request.studentId);
    }

    // Ordena por prioridade e data (mais recentes primeiro)
    alerts.sort((a, b) => {
      const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
      const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
      if (priorityDiff !== 0) return priorityDiff;
      
      return b.createdAt.getTime() - a.createdAt.getTime();
    });

    return alerts;
  }
}
