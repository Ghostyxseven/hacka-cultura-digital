// src/application/usecases/ResolveAlertUseCase.ts
import { IAlertRepository } from '../../core/repositories/IAlertRepository';

/**
 * Caso de uso: Resolver alerta
 */
export interface ResolveAlertRequest {
  alertId: string;
}

export class ResolveAlertUseCase {
  constructor(private repository: IAlertRepository) {}

  execute(request: ResolveAlertRequest): void {
    if (!request.alertId) {
      throw new Error('ID do alerta é obrigatório');
    }

    const alert = this.repository.getById(request.alertId);

    if (!alert) {
      throw new Error('Alerta não encontrado');
    }

    if (alert.status === 'resolved') {
      throw new Error('Alerta já está resolvido');
    }

    this.repository.resolve(request.alertId);
  }
}
