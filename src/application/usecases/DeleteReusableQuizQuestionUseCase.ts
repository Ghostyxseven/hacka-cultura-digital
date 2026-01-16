// src/application/usecases/DeleteReusableQuizQuestionUseCase.ts
import { IReusableQuizQuestionRepository } from '../../core/repositories/IReusableQuizQuestionRepository';

/**
 * Caso de uso: Excluir questão reutilizável
 */
export interface DeleteReusableQuizQuestionRequest {
  questionId: string;
  userId: string; // ID do usuário que está tentando excluir
}

export class DeleteReusableQuizQuestionUseCase {
  constructor(private repository: IReusableQuizQuestionRepository) {}

  /**
   * Exclui uma questão reutilizável
   * Apenas o criador pode excluir
   */
  execute(request: DeleteReusableQuizQuestionRequest): void {
    if (!request.questionId) {
      throw new Error('ID da questão é obrigatório');
    }

    const question = this.repository.getById(request.questionId);

    if (!question) {
      throw new Error('Questão não encontrada');
    }

    // Verifica se o usuário é o criador
    if (question.createdBy !== request.userId) {
      throw new Error('Você não tem permissão para excluir esta questão');
    }

    // Exclui a questão
    this.repository.delete(request.questionId);
  }
}
