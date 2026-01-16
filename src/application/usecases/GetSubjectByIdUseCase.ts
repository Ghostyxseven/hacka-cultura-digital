import { Subject } from '@/core/entities/Subject';
import { ISubjectRepository } from '@/repository/interfaces/ISubjectRepository';

/**
 * Caso de uso: Buscar disciplina por ID
 * Responsabilidade única: Recuperar uma disciplina específica
 */
export class GetSubjectByIdUseCase {
  constructor(private readonly subjectRepository: ISubjectRepository) {}

  async execute(id: string): Promise<Subject> {
    const subject = await this.subjectRepository.findById(id);

    if (!subject) {
      throw new Error('Disciplina não encontrada');
    }

    return subject;
  }
}
