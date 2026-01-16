import { Unit } from '@/core/entities/Unit';
import { IUnitRepository } from '@/repository/interfaces/IUnitRepository';
import { ISubjectRepository } from '@/repository/interfaces/ISubjectRepository';

/**
 * Caso de uso: Buscar unidades por disciplina
 * Responsabilidade única: Recuperar todas as unidades de uma disciplina
 */
export class GetUnitsBySubjectUseCase {
  constructor(
    private readonly unitRepository: IUnitRepository,
    private readonly subjectRepository: ISubjectRepository
  ) {}

  async execute(subjectId: string): Promise<Unit[]> {
    // Valida se a disciplina existe
    const subject = await this.subjectRepository.findById(subjectId);
    if (!subject) {
      throw new Error('Disciplina não encontrada');
    }

    // Retorna as unidades da disciplina
    return this.unitRepository.findBySubjectId(subjectId);
  }
}
