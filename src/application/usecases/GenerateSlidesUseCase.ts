import { SlideGenerator, Slide } from '@/infrastructure/services/SlideGenerator';
import { ISubjectRepository } from '@/repository/interfaces/ISubjectRepository';
import { IUnitRepository } from '@/repository/interfaces/IUnitRepository';
import { ILessonPlanRepository } from '@/repository/interfaces/ILessonPlanRepository';

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
      throw new Error('ID da unidade é obrigatório');
    }

    // Busca a unidade
    const unit = await this.unitRepository.findById(dto.unitId);
    if (!unit) {
      throw new Error('Unidade não encontrada');
    }

    // Busca a disciplina
    const subject = await this.subjectRepository.findById(unit.subjectId);
    if (!subject) {
      throw new Error('Disciplina não encontrada');
    }

    // Busca o plano de aula (deve existir antes de gerar slides)
    const lessonPlan = await this.lessonPlanRepository.findByUnitId(dto.unitId);
    if (!lessonPlan) {
      throw new Error('Plano de aula não encontrado. Gere o plano de aula primeiro.');
    }

    // Gera os slides via IA
    const slides = await this.slideGenerator.generate({
      unit,
      subject,
      lessonPlan,
      year: dto.year,
      additionalContext: dto.additionalContext,
    });

    return slides;
  }
}
