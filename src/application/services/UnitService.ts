import { Unit } from '@/core/entities/Unit';
import {
  CreateUnitUseCase,
  GetUnitsBySubjectUseCase,
  SuggestUnitsUseCase,
} from '../usecases';
import { CreateUnitDTO, SuggestUnitsDTO } from '../dto';
import { IUnitRepository } from '@/repository/interfaces/IUnitRepository';

/**
 * Serviço de aplicação: Gerenciamento de unidades de ensino
 * Orquestra os casos de uso relacionados a unidades
 */
export class UnitService {
  constructor(
    private readonly createUnitUseCase: CreateUnitUseCase,
    private readonly getUnitsBySubjectUseCase: GetUnitsBySubjectUseCase,
    private readonly suggestUnitsUseCase: SuggestUnitsUseCase,
    private readonly unitRepository: IUnitRepository
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
   */
  async archive(id: string): Promise<Unit> {
    return this.unitRepository.update(id, {
      archived: true,
      archivedAt: new Date().toISOString(),
    });
  }

  /**
   * Desarquivar uma unidade
   */
  async unarchive(id: string): Promise<Unit> {
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
