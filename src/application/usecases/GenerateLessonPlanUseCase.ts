import { LessonPlan } from '@/core/entities/LessonPlan';
import { ILessonPlanRepository } from '@/repository/interfaces/ILessonPlanRepository';
import { IUnitRepository } from '@/repository/interfaces/IUnitRepository';
import { ISubjectRepository } from '@/repository/interfaces/ISubjectRepository';
import { LessonPlanGenerator } from '@/infrastructure/services/LessonPlanGenerator';
import { GenerateLessonPlanDTO } from '../dto/GenerateLessonPlanDTO';
import { NotFoundError, ValidationError, ServiceUnavailableError, ForbiddenError } from '../errors';
import { assertCanGenerateFor } from '@/core/policies';

/**
 * Caso de uso: Gerar plano de aula via IA
 * Responsabilidade única: Orquestrar a geração de plano de aula usando IA
 */
export class GenerateLessonPlanUseCase {
  constructor(
    private readonly lessonPlanRepository: ILessonPlanRepository,
    private readonly unitRepository: IUnitRepository,
    private readonly subjectRepository: ISubjectRepository,
    private readonly lessonPlanGenerator: LessonPlanGenerator
  ) {}

  async execute(dto: GenerateLessonPlanDTO): Promise<LessonPlan> {
    // Busca a unidade
    const unit = await this.unitRepository.findById(dto.unitId);
    if (!unit) {
      throw new NotFoundError('Unidade', dto.unitId);
    }

    // REGRA DE BLOQUEIO: Não permite gerar plano para unidade arquivada
    assertCanGenerateFor(unit, 'Unidade');

    // Verifica se já existe um plano para esta unidade
    const existingPlan = await this.lessonPlanRepository.findByUnitId(dto.unitId);
    if (existingPlan) {
      throw new ValidationError('Já existe um plano de aula para esta unidade');
    }

    // Busca a disciplina associada
    const subject = await this.subjectRepository.findById(unit.subjectId);
    if (!subject) {
      throw new NotFoundError('Disciplina', unit.subjectId);
    }

    // REGRA DE BLOQUEIO: Não permite gerar plano para disciplina arquivada
    assertCanGenerateFor(subject, 'Disciplina');

    try {
      // Gera o plano de aula usando IA
      const generatedPlan = await this.lessonPlanGenerator.generate({
        unit,
        subject,
        year: dto.year,
        additionalContext: dto.additionalContext,
      });

      // Salva o plano gerado
      const savedPlan = await this.lessonPlanRepository.create(generatedPlan);

      return savedPlan;
    } catch (error) {
      // Se já for um ServiceUnavailableError, repassa
      if (error instanceof ServiceUnavailableError) {
        throw error;
      }
      // Converte outros erros relacionados à IA em ServiceUnavailableError
      if (error instanceof Error) {
        throw new ServiceUnavailableError('Gerador de Plano de Aula', error.message);
      }
      throw new ServiceUnavailableError('Gerador de Plano de Aula');
    }
  }
}
