import { Unit } from '@/core/entities/Unit';
import {
  CreateUnitUseCase,
  GetUnitsBySubjectUseCase,
  SuggestUnitsUseCase,
} from '../usecases';
import { CreateUnitDTO, SuggestUnitsDTO } from '../dto';
import { IUnitRepository } from '@/repository/interfaces/IUnitRepository';
import { ArchiveService } from './ArchiveService';

/**
 * Serviço de aplicação: Gerenciamento de unidades de ensino
 * Orquestra os casos de uso relacionados a unidades
 */
export class UnitService {
  constructor(
    private readonly createUnitUseCase: CreateUnitUseCase,
    private readonly getUnitsBySubjectUseCase: GetUnitsBySubjectUseCase,
    private readonly suggestUnitsUseCase: SuggestUnitsUseCase,
    private readonly unitRepository: IUnitRepository,
    private readonly archiveService?: ArchiveService // Opcional para não quebrar código existente
  ) {}

  /**
   * Cria uma nova unidade de ensino
   */
  async create(dto: CreateUnitDTO): Promise<Unit> {
    return this.createUnitUseCase.execute(dto);
  }

  /**
   * Lista todas as unidades de uma disciplina
   */
  async findBySubject(subjectId: string): Promise<Unit[]> {
    return this.getUnitsBySubjectUseCase.execute(subjectId);
  }

  /**
   * Sugere unidades de ensino via IA
   */
  async suggest(dto: SuggestUnitsDTO): Promise<Array<{ title: string; theme: string }>> {
    return this.suggestUnitsUseCase.execute(dto);
  }

  /**
   * Arquivar uma unidade
   * Se ArchiveService estiver disponível, usa arquivamento em cascata
   */
  async archive(id: string, cascade: boolean = true): Promise<Unit> {
    if (this.archiveService && cascade) {
      // ARQUIVAMENTO EM CASCATA: arquiva Unit → Plans/Activities
      await this.archiveService.archiveUnitCascade(id);
      return this.unitRepository.findById(id) as Promise<Unit>;
    }

    // Arquivamento simples (compatibilidade)
    return this.unitRepository.update(id, {
      archived: true,
      archivedAt: new Date().toISOString(),
    });
  }

  /**
   * Desarquivar uma unidade
   * Se ArchiveService estiver disponível, usa desarquivamento em cascata
   */
  async unarchive(id: string, cascade: boolean = true): Promise<Unit> {
    if (this.archiveService && cascade) {
      // DESARQUIVAMENTO EM CASCATA: restaura apenas Unit (Plans/Activities ficam arquivados)
      await this.archiveService.unarchiveUnitCascade(id);
      return this.unitRepository.findById(id) as Promise<Unit>;
    }

    // Desarquivamento simples (compatibilidade)
    return this.unitRepository.update(id, {
      archived: false,
      archivedAt: undefined,
    });
  }

  /**
   * Buscar todas as unidades (incluindo arquivadas)
   */
  async findAllIncludingArchived(): Promise<Unit[]> {
    return this.unitRepository.findAll();
  }

  /**
   * Deletar permanentemente uma unidade
   */
  async delete(id: string): Promise<void> {
    return this.unitRepository.delete(id);
  }
}
