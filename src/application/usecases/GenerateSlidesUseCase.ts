import { SlideGenerator } from '@/infrastructure/services/SlideGenerator';
import type { Slide } from '@/application/viewmodels';
import { ISubjectRepository } from '@/repository/interfaces/ISubjectRepository';
import { IUnitRepository } from '@/repository/interfaces/IUnitRepository';
import { ILessonPlanRepository } from '@/repository/interfaces/ILessonPlanRepository';
import { NotFoundError, ValidationError, ServiceUnavailableError } from '../errors';

export interface GenerateSlidesDTO {
  unitId: string;
  year?: string;
  additionalContext?: string;
}

/**
 * Caso de uso: Gerar slides de apresentação
 * Responsabilidade única: Orquestrar a geração de slides via IA
 */
export class GenerateSlidesUseCase {
  constructor(
    private readonly slideGenerator: SlideGenerator,
    private readonly unitRepository: IUnitRepository,
    private readonly subjectRepository: ISubjectRepository,
    private readonly lessonPlanRepository: ILessonPlanRepository
  ) {}

  async execute(dto: GenerateSlidesDTO): Promise<Slide[]> {
    // Validação de entrada
    if (!dto.unitId || dto.unitId.trim().length === 0) {
      throw new ValidationError('ID da unidade é obrigatório', 'unitId');
    }

    // Busca a unidade
    const unit = await this.unitRepository.findById(dto.unitId);
    if (!unit) {
      throw new NotFoundError('Unidade', dto.unitId);
    }

    // Busca a disciplina
    const subject = await this.subjectRepository.findById(unit.subjectId);
    if (!subject) {
      throw new NotFoundError('Disciplina', unit.subjectId);
    }

    // Busca o plano de aula (deve existir antes de gerar slides)
    const lessonPlan = await this.lessonPlanRepository.findByUnitId(dto.unitId);
    if (!lessonPlan) {
      throw new ValidationError('Plano de aula não encontrado. Gere o plano de aula primeiro.');
    }

    try {
      // Gera os slides via IA
      const slides = await this.slideGenerator.generate({
        unit,
        subject,
        lessonPlan,
        year: dto.year,
        additionalContext: dto.additionalContext,
      });

      return slides;
    } catch (error) {
      // Se já for um ServiceUnavailableError, repassa
      if (error instanceof ServiceUnavailableError) {
        throw error;
      }
      // Converte outros erros relacionados à IA em ServiceUnavailableError
      if (error instanceof Error) {
        throw new ServiceUnavailableError('Gerador de Slides', error.message);
      }
      throw new ServiceUnavailableError('Gerador de Slides');
    }
  }
}
