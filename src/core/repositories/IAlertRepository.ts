// src/core/repositories/IAlertRepository.ts
import { Alert } from '../entities/Alert';

/**
 * Interface para repositório de alertas
 */
export interface IAlertRepository {
  /**
   * Salva um alerta
   */
  save(alert: Alert): void;

  /**
   * Busca todos os alertas
   */
  getAll(): Alert[];

  /**
   * Busca um alerta por ID
   */
  getById(id: string): Alert | undefined;

  /**
   * Busca alertas por status
   */
  findByStatus(status: Alert['status']): Alert[];

  /**
   * Busca alertas por tipo
   */
  findByType(type: Alert['type']): Alert[];

  /**
   * Busca alertas por severidade
   */
  findBySeverity(severity: Alert['severity']): Alert[];

  /**
   * Busca alertas por prioridade
   */
  findByPriority(priority: Alert['priority']): Alert[];

  /**
   * Busca alertas relacionados a um aluno
   */
  findByStudent(studentId: string): Alert[];

  /**
   * Busca alertas não resolvidos
   */
  getUnresolved(): Alert[];

  /**
   * Busca alertas novos (não reconhecidos)
   */
  getNew(): Alert[];

  /**
   * Marca um alerta como reconhecido
   */
  acknowledge(id: string, userId: string): void;

  /**
   * Marca um alerta como resolvido
   */
  resolve(id: string): void;

  /**
   * Descarta um alerta
   */
  dismiss(id: string): void;

  /**
   * Exclui um alerta
   */
  delete(id: string): void;
}
