import { Unit } from '@/core/entities/Unit';
import { ISubjectRepository } from '@/repository/interfaces/ISubjectRepository';
import { IUnitRepository } from '@/repository/interfaces/IUnitRepository';
import { CreateUnitDTO, validateCreateUnitDTO } from '../dto/CreateUnitDTO';
import { NotFoundError, ValidationError } from '../errors';

/**
 * Caso de uso: Criar unidade de ensino
 * Responsabilidade única: Orquestrar a criação de uma unidade
 */
export class CreateUnitUseCase {
  constructor(
    private readonly unitRepository: IUnitRepository,
    private readonly subjectRepository: ISubjectRepository
  ) {}

  async execute(dto: CreateUnitDTO): Promise<Unit> {
    // Validação de entrada usando função de validação do DTO
    if (!validateCreateUnitDTO(dto)) {
      throw new ValidationError('Dados da unidade inválidos');
    }

    // Valida se a disciplina existe
    const subject = await this.subjectRepository.findById(dto.subjectId);
    if (!subject) {
      throw new NotFoundError('Disciplina', dto.subjectId);
    }

    // Cria a unidade através do repositório
    const unit = await this.unitRepository.create({
      subjectId: dto.subjectId,
      title: dto.title.trim(),
      theme: dto.theme.trim(),
      isAIGenerated: dto.isAIGenerated || false,
    });

    return unit;
  }
}
