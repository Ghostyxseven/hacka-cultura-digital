import { Activity } from '@/core/entities/Activity';
import { IActivityRepository } from '@/repository/interfaces/IActivityRepository';
import { IUnitRepository } from '@/repository/interfaces/IUnitRepository';
import { ISubjectRepository } from '@/repository/interfaces/ISubjectRepository';
import { ActivityGenerator } from '@/infrastructure/services/ActivityGenerator';
import { GenerateActivityDTO } from '../dto/GenerateActivityDTO';

/**
 * Caso de uso: Gerar atividade avaliativa via IA
 * Responsabilidade única: Orquestrar a geração de atividade avaliativa usando IA
 */
export class GenerateActivityUseCase {
  constructor(
    private readonly activityRepository: IActivityRepository,
    private readonly unitRepository: IUnitRepository,
    private readonly subjectRepository: ISubjectRepository,
    private readonly activityGenerator: ActivityGenerator
  ) {}

  async execute(dto: GenerateActivityDTO): Promise<Activity> {
    // Busca a unidade
    const unit = await this.unitRepository.findById(dto.unitId);
    if (!unit) {
      throw new Error('Unidade não encontrada');
    }

    // Verifica se já existe uma atividade para esta unidade
    const existingActivity = await this.activityRepository.findByUnitId(dto.unitId);
    if (existingActivity) {
      throw new Error('Já existe uma atividade avaliativa para esta unidade');
    }

    // Busca a disciplina associada
    const subject = await this.subjectRepository.findById(unit.subjectId);
    if (!subject) {
      throw new Error('Disciplina não encontrada');
    }

    // Gera a atividade usando IA
    const generatedActivity = await this.activityGenerator.generate({
      unit,
      subject,
      year: dto.year,
      activityType: dto.activityType,
      numberOfQuestions: dto.numberOfQuestions,
      additionalContext: dto.additionalContext,
    });

    // Salva a atividade gerada
    const savedActivity = await this.activityRepository.create(generatedActivity);

    return savedActivity;
  }
}
