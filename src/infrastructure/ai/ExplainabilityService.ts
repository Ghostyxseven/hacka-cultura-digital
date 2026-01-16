// src/infrastructure/ai/ExplainabilityService.ts

/**
 * Informações de explicabilidade sobre a geração de conteúdo pela IA
 */
export interface AIExplanation {
  /**
   * Trechos da BNCC utilizados na geração
   */
  bnccExcerpts: BNCCExcerpt[];

  /**
   * Contexto RAG recuperado e utilizado
   */
  ragContext: RAGContext[];

  /**
   * Competências BNCC referenciadas
   */
  competencies: string[];

  /**
   * Modelo de IA utilizado
   */
  aiModel: string;

  /**
   * Versão do prompt utilizado
   */
  promptVersion: string;

  /**
   * Timestamp da geração
   */
  generatedAt: Date;
}

export interface BNCCExcerpt {
  /**
   * Trecho do texto da BNCC
   */
  text: string;

  /**
   * Competência relacionada
   */
  competency: string;

  /**
   * Área de conhecimento
   */
  knowledgeArea?: string;

  /**
   * Ano/série relacionado
   */
  gradeYear?: string;
}

export interface RAGContext {
  /**
   * Trecho recuperado da base de conhecimento
   */
  excerpt: string;

  /**
   * Fonte do trecho (ex: "BNCC", "MEC", "Documento X")
   */
  source: string;

  /**
   * Relevância estimada (0-1)
   */
  relevance?: number;
}

/**
 * Serviço de explicabilidade da IA
 * Rastreia e documenta como a IA gerou o conteúdo
 */
export class ExplainabilityService {
  private explanations: Map<string, AIExplanation> = new Map();

  /**
   * Registra uma explicação para um plano de aula gerado
   */
  registerExplanation(
    lessonPlanId: string,
    explanation: Omit<AIExplanation, 'generatedAt'>
  ): void {
    this.explanations.set(lessonPlanId, {
      ...explanation,
      generatedAt: new Date(),
    });
  }

  /**
   * Busca a explicação de um plano de aula
   */
  getExplanation(lessonPlanId: string): AIExplanation | undefined {
    return this.explanations.get(lessonPlanId);
  }

  /**
   * Cria uma explicação a partir do contexto RAG utilizado
   */
  createExplanationFromRAG(
    ragContext: string[],
    bnccCompetencies: string[],
    aiModel: string,
    promptVersion: string
  ): Omit<AIExplanation, 'generatedAt'> {
    // Extrai trechos BNCC do contexto RAG
    const bnccExcerpts: BNCCExcerpt[] = ragContext
      .filter(context => 
        context.toLowerCase().includes('bncc') || 
        context.toLowerCase().includes('competência')
      )
      .map(context => ({
        text: context.substring(0, 200), // Primeiros 200 caracteres
        competency: this.extractCompetency(context),
        knowledgeArea: this.extractKnowledgeArea(context),
      }));

    // Cria contexto RAG estruturado
    const ragContextStructured: RAGContext[] = ragContext.map((excerpt, index) => ({
      excerpt: excerpt.substring(0, 300), // Primeiros 300 caracteres
      source: this.identifySource(excerpt),
      relevance: 1 - (index * 0.1), // Relevância decrescente
    }));

    return {
      bnccExcerpts,
      ragContext: ragContextStructured,
      competencies: bnccCompetencies,
      aiModel,
      promptVersion,
    };
  }

  /**
   * Extrai competência BNCC de um texto
   */
  private extractCompetency(text: string): string {
    const competencyMatch = text.match(/compet[êe]ncia\s+(\d+)/i);
    if (competencyMatch) {
      return `Competência ${competencyMatch[1]}`;
    }

    // Tenta encontrar referências a competências específicas
    if (text.toLowerCase().includes('cultura digital')) {
      return 'Competência 5 - Cultura Digital';
    }

    return 'Competência BNCC';
  }

  /**
   * Extrai área de conhecimento de um texto
   */
  private extractKnowledgeArea(text: string): string | undefined {
    const areas = [
      'Linguagens',
      'Matemática',
      'Ciências da Natureza',
      'Ciências Humanas',
      'Ensino Religioso',
    ];

    for (const area of areas) {
      if (text.toLowerCase().includes(area.toLowerCase())) {
        return area;
      }
    }

    return undefined;
  }

  /**
   * Identifica a fonte de um trecho
   */
  private identifySource(text: string): string {
    if (text.toLowerCase().includes('bncc')) {
      return 'BNCC';
    }
    if (text.toLowerCase().includes('mec')) {
      return 'MEC';
    }
    if (text.toLowerCase().includes('base nacional comum')) {
      return 'BNCC';
    }
    return 'Base de Conhecimento';
  }

  /**
   * Limpa explicações antigas (mais de 30 dias)
   */
  cleanOldExplanations(): void {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    for (const [id, explanation] of this.explanations.entries()) {
      if (explanation.generatedAt < thirtyDaysAgo) {
        this.explanations.delete(id);
      }
    }
  }
}
