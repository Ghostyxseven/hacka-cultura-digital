import { LessonPlan } from '@/core/entities/LessonPlan';
import { ILessonPlanRepository } from '@/repository/interfaces/ILessonPlanRepository';
import { IUnitRepository } from '@/repository/interfaces/IUnitRepository';
import { ISubjectRepository } from '@/repository/interfaces/ISubjectRepository';
import { LessonPlanGenerator } from '@/infrastructure/services/LessonPlanGenerator';
import { GenerateLessonPlanDTO } from '../dto/GenerateLessonPlanDTO';

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
      throw new Error('Unidade não encontrada');
    }

    // Verifica se já existe um plano para esta unidade
    const existingPlan = await this.lessonPlanRepository.findByUnitId(dto.unitId);
    if (existingPlan) {
      throw new Error('Já existe um plano de aula para esta unidade');
    }

    // Busca a disciplina associada
    const subject = await this.subjectRepository.findById(unit.subjectId);
    if (!subject) {
      throw new Error('Disciplina não encontrada');
    }

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
  }
}
