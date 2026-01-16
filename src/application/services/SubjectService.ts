import { Subject } from '@/core/entities/Subject';
import {
  CreateSubjectUseCase,
  GetAllSubjectsUseCase,
  GetSubjectByIdUseCase,
  DeleteSubjectUseCase,
} from '../usecases';
import { CreateSubjectDTO } from '../dto';

/**
 * Serviço de aplicação: Gerenciamento de disciplinas
 * Orquestra os casos de uso relacionados a disciplinas
 */
export class SubjectService {
  constructor(
    private readonly createSubjectUseCase: CreateSubjectUseCase,
    private readonly getAllSubjectsUseCase: GetAllSubjectsUseCase,
    private readonly getSubjectByIdUseCase: GetSubjectByIdUseCase,
    private readonly deleteSubjectUseCase: DeleteSubjectUseCase
  ) {}

  /**
   * Cria uma nova disciplina
   */
  async create(dto: CreateSubjectDTO): Promise<Subject> {
    return this.createSubjectUseCase.execute(dto);
  }

  /**
   * Lista todas as disciplinas
   */
  async findAll(): Promise<Subject[]> {
    return this.getAllSubjectsUseCase.execute();
  }

  /**
   * Busca uma disciplina por ID
   */
  async findById(id: string): Promise<Subject> {
    return this.getSubjectByIdUseCase.execute(id);
  }

  /**
   * Deleta uma disciplina
   */
  async delete(id: string): Promise<void> {
    return this.deleteSubjectUseCase.execute(id);
  }
}
