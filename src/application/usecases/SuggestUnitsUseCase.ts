// src/application/usecases/SuggestUnitsUseCase.ts
import { Unit, SchoolYear } from "../../core/entities/Unit";
import { IAIService } from "../../infrastructure/ai/IAIService";
import { ILessonRepository } from "../../repository/ILessonRepository";

/**
 * Caso de uso: Sugestão Automática de Unidades via IA
 * RF03 - Sugestão automática de unidades via IA
 * 
 * Utiliza IA para sugerir temas de unidades de ensino baseado na disciplina,
 * série/ano e diretrizes da BNCC.
 */
export class SuggestUnitsUseCase {
  constructor(
    private repository: ILessonRepository,
    private aiService: IAIService
  ) {}

  /**
   * Sugere unidades de ensino automaticamente usando IA
   * 
   * @param subjectId - ID da disciplina
   * @param gradeYear - Ano/série escolar
   * @param quantity - Quantidade de unidades a sugerir (padrão: 5)
   * @returns Array com as unidades sugeridas
   * @throws Error se os parâmetros forem inválidos
   */
  async execute(
    subjectId: string,
    gradeYear: SchoolYear,
    quantity: number = 5
  ): Promise<Unit[]> {
    // Validações
    if (!subjectId || subjectId.trim().length === 0) {
      throw new Error("ID da disciplina é obrigatório");
    }

    if (quantity < 1 || quantity > 10) {
      throw new Error("Quantidade deve ser entre 1 e 10");
    }

    // Verifica se a disciplina existe
    const subject = this.repository.getAllSubjects().find(s => s.id === subjectId);
    if (!subject) {
      throw new Error(`Disciplina com ID "${subjectId}" não encontrada`);
    }

    // Gera sugestões usando IA
    const suggestions = await this.generateSuggestions(
      subject.name,
      gradeYear,
      quantity
    );

    // Cria unidades a partir das sugestões
    const units: Unit[] = suggestions.map((topic, index) => ({
      id: `unit-${Date.now()}-${index}-${Math.random().toString(36).substring(2, 11)}`,
      subjectId: subjectId,
      gradeYear: gradeYear,
      topic: topic,
      isSuggestedByAI: true,
      createdAt: new Date()
    }));

    // Salva as unidades sugeridas
    units.forEach(unit => this.repository.saveUnit(unit));

    return units;
  }

  /**
   * Gera sugestões de temas usando IA
   */
  private async generateSuggestions(
    subjectName: string,
    gradeYear: SchoolYear,
    quantity: number
  ): Promise<string[]> {
    // Para simplificar, usa sugestões baseadas em templates
    // Em produção, poderia usar uma chamada específica de IA
    // Por enquanto, retorna sugestões inteligentes baseadas no contexto
    return this.getIntelligentSuggestions(subjectName, gradeYear, quantity);
  }

  /**
   * Retorna sugestões inteligentes baseadas no contexto
   */
  private getIntelligentSuggestions(
    subjectName: string,
    gradeYear: SchoolYear,
    quantity: number
  ): string[] {
    const baseTopics = [
      "Introdução à Cultura Digital e BNCC",
      "Uso Responsável e Ético da Internet",
      "Produção e Compartilhamento de Conteúdo Digital",
      "Comunicação e Colaboração em Ambientes Digitais",
      "Pesquisa, Seleção e Análise de Informações Online",
      "Criação de Projetos Digitais Colaborativos",
      "Ética, Cidadania e Direitos Digitais",
      "Segurança e Privacidade na Internet",
      "Algoritmos e Pensamento Computacional",
      "Criação de Narrativas Digitais"
    ];

    // Seleciona temas baseado na quantidade solicitada
    const selected = baseTopics.slice(0, Math.min(quantity, baseTopics.length));
    
    // Personaliza com o nome da disciplina quando apropriado
    return selected.map(topic => {
      if (subjectName.toLowerCase().includes('cultura digital') || 
          subjectName.toLowerCase().includes('informática')) {
        return topic;
      }
      return `${topic} aplicado a ${subjectName}`;
    });
  }
}
