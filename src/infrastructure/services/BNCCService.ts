import { BNCCCompetency, ALL_BNCC_COMPETENCIES, CULTURE_DIGITAL_COMPETENCIES, findRelevantCompetencies } from '@/core/entities/BNCCCompetency';

/**
 * Serviço de Recuperação Aumentada por Geração (RAG) com BNCC
 * Fornece contexto relevante da Base Nacional Comum Curricular para geração de conteúdo
 */
export class BNCCService {
  /**
   * Cache para contexto BNCC construído
   * Chave: string composta por component-year-theme
   * Valor: contexto BNCC formatado
   */
  private contextCache: Map<string, string> = new Map();

  /**
   * Gera chave de cache baseada nos parâmetros
   */
  private getCacheKey(params: {
    component?: string;
    year?: string;
    theme?: string;
  }): string {
    return `${params.component || 'all'}-${params.year || 'all'}-${params.theme || 'all'}`;
  }
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
   * Utiliza cache para melhorar performance em requisições repetidas
   */
  buildBNCCContext(params: {
    component?: string;
    year?: string;
    theme?: string;
  }): string {
    // Verifica cache primeiro
    const cacheKey = this.getCacheKey(params);
    if (this.contextCache.has(cacheKey)) {
      return this.contextCache.get(cacheKey)!;
    }

    // Constrói contexto se não estiver em cache
    const competencies = this.retrieveRelevantCompetencies(params);

    let context: string;
    if (competencies.length === 0) {
      // Fallback: retorna competência geral de Cultura Digital
      const defaultCompetency = CULTURE_DIGITAL_COMPETENCIES[0];
      context = this.formatCompetencyForPrompt(defaultCompetency);
    } else {
      // Combina todas as competências relevantes
      const contextParts = competencies.map((comp) => this.formatCompetencyForPrompt(comp));
      context = contextParts.join('\n\n---\n\n');
    }

    // Armazena no cache
    this.contextCache.set(cacheKey, context);

    return context;
  }

  /**
   * Limpa o cache de contexto BNCC
   * Útil para forçar reconstrução do contexto após atualizações
   */
  clearCache(): void {
    this.contextCache.clear();
  }

  /**
   * Obtém estatísticas do cache
   */
  getCacheStats(): { size: number; keys: string[] } {
    return {
      size: this.contextCache.size,
      keys: Array.from(this.contextCache.keys()),
    };
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
   * Obtém diretrizes pedagógicas específicas para uma área/disciplina
   */
  getGuidelinesForComponent(component?: string): string {
    const componentLower = component?.toLowerCase() || '';
    
    if (componentLower.includes('matemática') || componentLower.includes('matematica')) {
      return `
DIRETRIZES PEDAGÓGICAS - MATEMÁTICA (BNCC)

A Matemática na BNCC prevê que os estudantes devem:
1. Compreender e utilizar conhecimentos numéricos, algébricos, geométricos e estatísticos
2. Resolver e elaborar problemas em diferentes contextos
3. Desenvolver raciocínio lógico e pensamento crítico
4. Utilizar tecnologias digitais para investigação e resolução de problemas
5. Comunicar ideias matemáticas de forma clara e precisa

Princípios pedagógicos:
- Promover resolução de problemas contextualizados
- Desenvolver raciocínio lógico e pensamento crítico
- Integrar tecnologias digitais quando apropriado
- Conectar matemática com situações reais
- Alinhar com competências gerais da BNCC
      `.trim();
    }
    
    if (componentLower.includes('português') || componentLower.includes('portugues') || componentLower.includes('língua')) {
      return `
DIRETRIZES PEDAGÓGICAS - LÍNGUA PORTUGUESA (BNCC)

A Língua Portuguesa na BNCC prevê que os estudantes devem:
1. Compreender e produzir textos de diferentes gêneros
2. Desenvolver habilidades de leitura, escrita, oralidade e escuta
3. Utilizar tecnologias digitais para produção e leitura de textos
4. Analisar criticamente textos em diferentes suportes
5. Desenvolver competências comunicativas

Princípios pedagógicos:
- Promover leitura crítica e produção textual
- Desenvolver habilidades comunicativas
- Integrar tecnologias digitais na produção textual
- Trabalhar com gêneros textuais diversos
- Alinhar com competências gerais da BNCC
      `.trim();
    }
    
    if (componentLower.includes('ciências') || componentLower.includes('ciencias')) {
      return `
DIRETRIZES PEDAGÓGICAS - CIÊNCIAS (BNCC)

As Ciências na BNCC prevêem que os estudantes devem:
1. Compreender fenômenos naturais e científicos
2. Desenvolver pensamento científico e investigativo
3. Utilizar tecnologias digitais para pesquisa e experimentação
4. Analisar questões ambientais e de sustentabilidade
5. Desenvolver atitudes científicas e éticas

Princípios pedagógicos:
- Promover investigação científica
- Desenvolver pensamento crítico
- Integrar tecnologias digitais na pesquisa
- Conectar ciência com questões sociais e ambientais
- Alinhar com competências gerais da BNCC
      `.trim();
    }
    
    if (componentLower.includes('história') || componentLower.includes('historia')) {
      return `
DIRETRIZES PEDAGÓGICAS - HISTÓRIA (BNCC)

A História na BNCC prevê que os estudantes devem:
1. Compreender processos históricos e temporais
2. Desenvolver pensamento histórico crítico
3. Utilizar tecnologias digitais para pesquisa histórica
4. Analisar fontes históricas diversas
5. Desenvolver consciência histórica e cidadã

Princípios pedagógicos:
- Promover análise crítica de fontes históricas
- Desenvolver consciência temporal
- Integrar tecnologias digitais na pesquisa histórica
- Conectar passado, presente e futuro
- Alinhar com competências gerais da BNCC
      `.trim();
    }
    
    if (componentLower.includes('geografia') || componentLower.includes('geografia')) {
      return `
DIRETRIZES PEDAGÓGICAS - GEOGRAFIA (BNCC)

A Geografia na BNCC prevê que os estudantes devem:
1. Compreender relações espaciais e territoriais
2. Analisar transformações do espaço geográfico
3. Utilizar tecnologias digitais para análise espacial
4. Desenvolver consciência geográfica e ambiental
5. Compreender processos de globalização

Princípios pedagógicos:
- Promover análise espacial e territorial
- Desenvolver consciência geográfica
- Integrar tecnologias digitais (mapas, GPS, etc.)
- Conectar local e global
- Alinhar com competências gerais da BNCC
      `.trim();
    }
    
    // Fallback: diretrizes gerais de Cultura Digital
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
   * Mantém compatibilidade com código existente
   */
  getCultureDigitalGuidelines(): string {
    return this.getGuidelinesForComponent('Cultura Digital');
  }

  /**
   * Constrói prompt base com contexto BNCC para geração de materiais
   */
  buildBasePrompt(params: {
    component?: string;
    year?: string;
    theme?: string;
    materialType: 'lesson_plan' | 'activity' | 'unit_suggestion' | 'slides';
  }): string {
    const bnccContext = this.buildBNCCContext({
      component: params.component,
      year: params.year,
      theme: params.theme,
    });

    const guidelines = this.getGuidelinesForComponent(params.component);

    return `
Você é um assistente pedagógico especializado em gerar materiais didáticos alinhados à Base Nacional Comum Curricular (BNCC).

CONTEXTO BNCC RELEVANTE:
${bnccContext}

DIRETRIZES PEDAGÓGICAS:
${guidelines}

INSTRUÇÕES:
- Todo conteúdo gerado DEVE estar rigorosamente alinhado às competências BNCC apresentadas acima
- Use os códigos de habilidades BNCC (ex: EF04MA01, EF06LP01) nos materiais gerados
- ${params.component ? `Foque na área de ${params.component}` : 'Integre diferentes áreas do conhecimento quando apropriado'}
- Priorize aspectos relacionados à Cultura Digital quando relevante
- Use linguagem adequada ao nível educacional: ${params.year || 'Ensino Fundamental/Médio'}
- Seja claro, objetivo e pedagógico
- Estruture o conteúdo de forma didática e acessível
- Inclua conexões entre diferentes áreas do conhecimento quando possível
    `.trim();
  }
}
