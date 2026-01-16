import { Unit } from '@/core/entities/Unit';
import {
  CreateUnitUseCase,
  GetUnitsBySubjectUseCase,
  SuggestUnitsUseCase,
} from '../usecases';
import { CreateUnitDTO, SuggestUnitsDTO } from '../dto';

/**
 * Serviço de aplicação: Gerenciamento de unidades de ensino
 * Orquestra os casos de uso relacionados a unidades
 */
export class UnitService {
  constructor(
    private readonly createUnitUseCase: CreateUnitUseCase,
    private readonly getUnitsBySubjectUseCase: GetUnitsBySubjectUseCase,
    private readonly suggestUnitsUseCase: SuggestUnitsUseCase
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
}
