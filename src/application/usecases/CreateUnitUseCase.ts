import { Unit } from '@/core/entities/Unit';
import { ISubjectRepository } from '@/repository/interfaces/ISubjectRepository';
import { IUnitRepository } from '@/repository/interfaces/IUnitRepository';
import { CreateUnitDTO } from '../dto/CreateUnitDTO';

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
    // Validação de entrada
    if (!dto.subjectId || dto.subjectId.trim().length === 0) {
      throw new Error('ID da disciplina é obrigatório');
    }

    if (!dto.title || dto.title.trim().length === 0) {
      throw new Error('Título da unidade é obrigatório');
    }

    if (!dto.theme || dto.theme.trim().length === 0) {
      throw new Error('Tema da unidade é obrigatório');
    }

    // Valida se a disciplina existe
    const subject = await this.subjectRepository.findById(dto.subjectId);
    if (!subject) {
      throw new Error('Disciplina não encontrada');
    }

    // Cria a unidade através do repositório
    const unit = await this.unitRepository.create({
      subjectId: dto.subjectId,
      title: dto.title,
      theme: dto.theme,
      isAIGenerated: dto.isAIGenerated || false,
    });

    return unit;
  }
}
