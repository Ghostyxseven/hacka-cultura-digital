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
    const prompt = `
Você é um assistente pedagógico especializado em Cultura Digital e BNCC.
Sugira ${quantity} temas de unidades de ensino (aulas) para a disciplina "${subjectName}" 
no ${gradeYear}, seguindo as diretrizes da BNCC, especialmente a Competência 5 - Cultura Digital.

Cada tema deve ser:
- Específico e claro
- Alinhado à BNCC
- Apropriado para o ano/série indicado
- Focado em Cultura Digital quando possível

Retorne APENAS uma lista JSON com os temas, sem explicações adicionais:
["Tema 1", "Tema 2", "Tema 3", ...]
`;

    try {
      // Usa o serviço de IA para gerar sugestões
      // Como o IAIService retorna LessonPlan, vamos adaptar
      const response = await (this.aiService as any).model?.generateContent(prompt);
      const text = response?.response?.text() || "[]";
      
      // Remove markdown se houver
      const cleanedText = text
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .trim();
      
      const topics = JSON.parse(cleanedText);
      
      if (!Array.isArray(topics) || topics.length === 0) {
        throw new Error("Resposta da IA inválida");
      }

      return topics.slice(0, quantity);
    } catch (error) {
      // Fallback: retorna sugestões genéricas
      console.error("Erro ao gerar sugestões via IA:", error);
      return this.getFallbackSuggestions(subjectName, gradeYear, quantity);
    }
  }

  /**
   * Retorna sugestões genéricas como fallback
   */
  private getFallbackSuggestions(
    subjectName: string,
    gradeYear: SchoolYear,
    quantity: number
  ): string[] {
    const baseTopics = [
      "Introdução à Cultura Digital",
      "Uso Responsável da Internet",
      "Produção de Conteúdo Digital",
      "Comunicação e Colaboração Digital",
      "Pesquisa e Análise de Informações",
      "Criação de Projetos Digitais",
      "Ética e Cidadania Digital",
      "Segurança na Internet"
    ];

    return baseTopics.slice(0, quantity).map((topic, index) => 
      `${topic} - ${subjectName} (${gradeYear})`
    );
  }
}
