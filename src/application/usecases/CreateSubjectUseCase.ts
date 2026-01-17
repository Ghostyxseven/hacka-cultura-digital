import { Subject } from '@/core/entities/Subject';
import { ISubjectRepository } from '@/repository/interfaces/ISubjectRepository';
import { CreateSubjectDTO, validateCreateSubjectDTO } from '../dto/CreateSubjectDTO';
import { ValidationError } from '../errors';

/**
 * Caso de uso: Criar disciplina
 * Responsabilidade única: Orquestrar a criação de uma disciplina
 */
export class CreateSubjectUseCase {
  constructor(private readonly subjectRepository: ISubjectRepository) {}

  async execute(dto: CreateSubjectDTO): Promise<Subject> {
    // Validação de entrada usando função de validação do DTO
    if (!validateCreateSubjectDTO(dto)) {
      throw new ValidationError('Dados da disciplina inválidos');
    }

    // Cria a disciplina através do repositório
    const subject = await this.subjectRepository.create({
      name: dto.name.trim(),
      description: dto.description?.trim() || '',
      schoolYears: dto.schoolYears,
    });

    return subject;
  }
}
