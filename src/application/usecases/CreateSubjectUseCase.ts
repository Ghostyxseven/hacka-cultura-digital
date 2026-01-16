import { Subject } from '@/core/entities/Subject';
import { ISubjectRepository } from '@/repository/interfaces/ISubjectRepository';
import { CreateSubjectDTO } from '../dto/CreateSubjectDTO';

/**
 * Caso de uso: Criar disciplina
 * Responsabilidade única: Orquestrar a criação de uma disciplina
 */
export class CreateSubjectUseCase {
  constructor(private readonly subjectRepository: ISubjectRepository) {}

  async execute(dto: CreateSubjectDTO): Promise<Subject> {
    // Validação de entrada
    if (!dto.name || dto.name.trim().length === 0) {
      throw new Error('Nome da disciplina é obrigatório');
    }

    if (!dto.schoolYears || dto.schoolYears.length === 0) {
      throw new Error('Pelo menos um ano escolar deve ser informado');
    }

    // Cria a disciplina através do repositório
    const subject = await this.subjectRepository.create({
      name: dto.name,
      description: dto.description || '',
      schoolYears: dto.schoolYears,
    });

    return subject;
  }
}
