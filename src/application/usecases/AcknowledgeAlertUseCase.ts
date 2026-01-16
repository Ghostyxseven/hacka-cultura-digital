// src/application/usecases/AcknowledgeAlertUseCase.ts
import { IAlertRepository } from '../../core/repositories/IAlertRepository';

/**
 * Caso de uso: Reconhecer alerta
 */
export interface AcknowledgeAlertRequest {
  alertId: string;
  userId: string; // ID do usuário que está reconhecendo
}

export class AcknowledgeAlertUseCase {
  constructor(private repository: IAlertRepository) {}

  execute(request: AcknowledgeAlertRequest): void {
    if (!request.alertId) {
      throw new Error('ID do alerta é obrigatório');
    }

    if (!request.userId) {
      throw new Error('ID do usuário é obrigatório');
    }

    const alert = this.repository.getById(request.alertId);

    if (!alert) {
      throw new Error('Alerta não encontrado');
    }

    if (alert.status !== 'new') {
      throw new Error('Apenas alertas novos podem ser reconhecidos');
    }

    this.repository.acknowledge(request.alertId, request.userId);
  }
}
