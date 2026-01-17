import { Subject } from '@/core/entities/Subject';
import {
  CreateSubjectUseCase,
  GetAllSubjectsUseCase,
  GetSubjectByIdUseCase,
  DeleteSubjectUseCase,
} from '../usecases';
import { CreateSubjectDTO } from '../dto';
import { ISubjectRepository } from '@/repository/interfaces/ISubjectRepository';
import { ArchiveService } from './ArchiveService';

/**
 * Serviço de aplicação: Gerenciamento de disciplinas
 * Orquestra os casos de uso relacionados a disciplinas
 */
export class SubjectService {
  constructor(
    private readonly createSubjectUseCase: CreateSubjectUseCase,
    private readonly getAllSubjectsUseCase: GetAllSubjectsUseCase,
    private readonly getSubjectByIdUseCase: GetSubjectByIdUseCase,
    private readonly deleteSubjectUseCase: DeleteSubjectUseCase,
    private readonly subjectRepository: ISubjectRepository,
    private readonly archiveService?: ArchiveService // Opcional para não quebrar código existente
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

  /**
   * Arquivar uma disciplina
   * Se ArchiveService estiver disponível, usa arquivamento em cascata
   */
  async archive(id: string, cascade: boolean = true): Promise<Subject> {
    if (this.archiveService && cascade) {
      // ARQUIVAMENTO EM CASCATA: arquiva Subject → Units → Plans/Activities
      await this.archiveService.archiveSubjectCascade(id);
      return this.subjectRepository.findById(id) as Promise<Subject>;
    }

    // Arquivamento simples (compatibilidade)
    return this.subjectRepository.update(id, {
      archived: true,
      archivedAt: new Date().toISOString(),
    });
  }

  /**
   * Desarquivar uma disciplina
   * Se ArchiveService estiver disponível, usa desarquivamento em cascata
   */
  async unarchive(id: string, cascade: boolean = true): Promise<Subject> {
    if (this.archiveService && cascade) {
      // DESARQUIVAMENTO EM CASCATA: restaura Subject e Units (Plans/Activities ficam arquivados)
      await this.archiveService.unarchiveSubjectCascade(id);
      return this.subjectRepository.findById(id) as Promise<Subject>;
    }

    // Desarquivamento simples (compatibilidade)
    return this.subjectRepository.update(id, {
      archived: false,
      archivedAt: undefined,
    });
  }

  /**
   * Buscar todas as disciplinas (incluindo arquivadas)
   */
  async findAllIncludingArchived(): Promise<Subject[]> {
    return this.subjectRepository.findAll();
  }
}
