import { Subject } from '@/core/entities/Subject';
import { Unit } from '@/core/entities/Unit';
import { ISubjectRepository } from '@/repository/interfaces/ISubjectRepository';
import { UnitSuggestionService } from '@/infrastructure/services/UnitSuggestionService';
import { SuggestUnitsDTO } from '../dto/SuggestUnitsDTO';

/**
 * Caso de uso: Sugerir unidades de ensino via IA
 * Responsabilidade única: Orquestrar a sugestão automática de unidades
 */
export class SuggestUnitsUseCase {
  constructor(
    private readonly subjectRepository: ISubjectRepository,
    private readonly unitSuggestionService: UnitSuggestionService
  ) {}

  async execute(dto: SuggestUnitsDTO): Promise<Array<{ title: string; theme: string }>> {
    // Valida se a disciplina existe
    const subject = await this.subjectRepository.findById(dto.subjectId);
    if (!subject) {
      throw new Error('Disciplina não encontrada');
    }

    // Solicita sugestões ao serviço de IA
    const suggestions = await this.unitSuggestionService.suggestUnits({
      subject,
      year: dto.year,
      numberOfSuggestions: dto.numberOfSuggestions || 5,
    });

    return suggestions;
  }
}
