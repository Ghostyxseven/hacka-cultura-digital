import { Subject } from '@/core/entities/Subject';
import { ISubjectRepository } from '@/repository/interfaces/ISubjectRepository';

/**
 * Caso de uso: Listar todas as disciplinas
 * Responsabilidade única: Recuperar todas as disciplinas cadastradas
 */
export class GetAllSubjectsUseCase {
  constructor(private readonly subjectRepository: ISubjectRepository) {}

  async execute(): Promise<Subject[]> {
    return this.subjectRepository.findAll();
  }
}
