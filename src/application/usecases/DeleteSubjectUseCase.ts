import { ISubjectRepository } from '@/repository/interfaces/ISubjectRepository';
import { IUnitRepository } from '@/repository/interfaces/IUnitRepository';
import { NotFoundError, ValidationError } from '../errors';

/**
 * Caso de uso: Deletar disciplina
 * Responsabilidade única: Remover uma disciplina e validar regras de negócio
 */
export class DeleteSubjectUseCase {
  constructor(
    private readonly subjectRepository: ISubjectRepository,
    private readonly unitRepository: IUnitRepository
  ) {}

  async execute(id: string): Promise<void> {
    // Verifica se a disciplina existe
    const subject = await this.subjectRepository.findById(id);
    if (!subject) {
      throw new NotFoundError('Disciplina', id);
    }

    // Verifica se existem unidades associadas
    const units = await this.unitRepository.findBySubjectId(id);
    if (units.length > 0) {
      throw new ValidationError(
        `Não é possível deletar a disciplina. Existem ${units.length} unidade(s) associada(s).`
      );
    }

    // Deleta a disciplina
    await this.subjectRepository.delete(id);
  }
}
