import { BNCCCompetency, CULTURE_DIGITAL_COMPETENCIES, findRelevantCompetencies } from '@/core/entities/BNCCCompetency';

/**
 * Serviço de Recuperação Aumentada por Geração (RAG) com BNCC
 * Fornece contexto relevante da Base Nacional Comum Curricular para geração de conteúdo
 */
export class BNCCService {
  /**
   * Recupera competências BNCC relevantes para um tema/disciplina/ano
   * Esta é a parte "Retrieval" do RAG
   */
  retrieveRelevantCompetencies(params: {
    component?: string;
    year?: string;
    theme?: string;
  }): BNCCCompetency[] {
    return findRelevantCompetencies(params.component, params.year, params.theme);
  }

  /**
   * Constrói o contexto BNCC formatado para prompt de IA
   * Combina competências relevantes em um texto estruturado
   */
  buildBNCCContext(params: {
    component?: string;
    year?: string;
    theme?: string;
  }): string {
    const competencies = this.retrieveRelevantCompetencies(params);

    if (competencies.length === 0) {
      // Fallback: retorna competência geral de Cultura Digital
      const defaultCompetency = CULTURE_DIGITAL_COMPETENCIES[0];
      return this.formatCompetencyForPrompt(defaultCompetency);
    }

    // Combina todas as competências relevantes
    const contextParts = competencies.map((comp) => this.formatCompetencyForPrompt(comp));
    return contextParts.join('\n\n---\n\n');
  }

  /**
   * Formata uma competência BNCC para ser incluída em prompt de IA
   */
  private formatCompetencyForPrompt(competency: BNCCCompetency): string {
    return `
Competência BNCC: ${competency.code} - ${competency.name}
Área: ${competency.area}
Componente: ${competency.component}
Descrição: ${competency.description}
Anos Escolares: ${competency.yearRange.join(', ')}

Habilidades relacionadas:
${competency.skills.map((skill) => `- ${skill}`).join('\n')}
    `.trim();
  }

  /**
   * Obtém diretrizes pedagógicas específicas para Cultura Digital
   */
  getCultureDigitalGuidelines(): string {
    return `
DIRETRIZES PEDAGÓGICAS - CULTURA DIGITAL (BNCC)

A Cultura Digital na BNCC prevê que os estudantes devem:
1. Compreender o funcionamento das tecnologias digitais de forma crítica
2. Utilizar tecnologias digitais de forma ética e responsável
3. Criar conteúdos digitais significativos
4. Comunicar-se através de tecnologias digitais
5. Resolver problemas usando ferramentas digitais
6. Exercer protagonismo e autoria na vida pessoal e coletiva

Princípios pedagógicos:
- Promover uso crítico e reflexivo das tecnologias
- Desenvolver competências para navegação segura e ética
- Incentivar criação e compartilhamento responsável de conteúdos
- Integrar tecnologias digitais ao processo de ensino-aprendizagem
- Alinhar atividades com as competências gerais da BNCC
    `.trim();
  }

  /**
   * Constrói prompt base com contexto BNCC para geração de materiais
   */
  buildBasePrompt(params: {
    component?: string;
    year?: string;
    theme?: string;
    materialType: 'lesson_plan' | 'activity' | 'unit_suggestion';
  }): string {
    const bnccContext = this.buildBNCCContext({
      component: params.component,
      year: params.year,
      theme: params.theme,
    });

    const guidelines = this.getCultureDigitalGuidelines();

    return `
Você é um assistente pedagógico especializado em gerar materiais didáticos alinhados à Base Nacional Comum Curricular (BNCC) com foco em Cultura Digital.

CONTEXTO BNCC RELEVANTE:
${bnccContext}

DIRETRIZES PEDAGÓGICAS:
${guidelines}

INSTRUÇÕES:
- Todo conteúdo gerado deve estar alinhado às competências BNCC apresentadas
- Priorize aspectos relacionados à Cultura Digital
- Use linguagem adequada ao nível educacional: ${params.year || 'Ensino Fundamental/Médio'}
- Seja claro, objetivo e pedagógico
- Estruture o conteúdo de forma didática e acessível
    `.trim();
  }
}
