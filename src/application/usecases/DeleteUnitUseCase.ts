// src/application/usecases/DeleteUnitUseCase.ts
import { ILessonRepository } from "../../repository/ILessonRepository";

/**
 * Caso de uso: Exclusão de Unidade
 * RF02 - Criação manual de unidades
 * 
 * Remove uma unidade do sistema.
 */
export class DeleteUnitUseCase {
  constructor(private repository: ILessonRepository) {}

  /**
   * Remove uma unidade pelo ID
   * 
   * @param id - ID da unidade a ser removida
   * @throws Error se o ID não for fornecido ou a unidade não existir
   */
  execute(id: string): void {
    // Validação de ID
    if (!id || id.trim().length === 0) {
      throw new Error("ID da unidade é obrigatório");
    }

    // Verifica se a unidade existe
    const unit = this.repository.getUnitById(id);
    if (!unit) {
      throw new Error(`Unidade com ID "${id}" não encontrada`);
    }

    // Remove o plano de aula associado se existir
    if (unit.lessonPlanId) {
      // O plano será removido automaticamente quando a unidade for deletada
      // ou pode ser mantido se necessário (dependendo da regra de negócio)
    }

    // Remove a unidade
    this.repository.deleteUnit(id);
  }
}
