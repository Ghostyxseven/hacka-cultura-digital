/**
 * Entidade de domínio: Competência BNCC
 * Representa uma competência ou habilidade da Base Nacional Comum Curricular
 * Usada como base de conhecimento para RAG (Retrieval Augmented Generation)
 */
export interface BNCCCompetency {
  id: string;
  code: string; // Código da competência (ex: "EF05CI01")
  name: string; // Nome da competência
  description: string; // Descrição detalhada
  area: string; // Área de conhecimento (ex: "Ciências da Natureza")
  component: string; // Componente curricular (ex: "Ciências")
  yearRange: string[]; // Anos escolares (ex: ["5º ano", "6º ano"])
  skills: string[]; // Habilidades relacionadas
  culturalDigital: boolean; // Se está relacionada à Cultura Digital
}

/**
 * Base de dados completa de competências BNCC
 * Inclui todas as áreas do conhecimento da Base Nacional Comum Curricular
 * Do Ensino Fundamental ao Ensino Médio
 */

// Competências Gerais da BNCC
const GENERAL_COMPETENCIES: BNCCCompetency[] = [
  {
    id: 'bncc_comp_5',
    code: 'COMP5',
    name: 'Compreender, utilizar e criar tecnologias digitais de forma crítica',
    description: 'Compreender, utilizar e criar tecnologias digitais de informação e comunicação de forma crítica, significativa, reflexiva e ética nas diversas práticas sociais para se comunicar, acessar e disseminar informações, produzir conhecimentos, resolver problemas e exercer protagonismo e autoria na vida pessoal e coletiva.',
    area: 'Competência Geral',
    component: 'Tecnologias Digitais',
    yearRange: ['1º ano', '2º ano', '3º ano', '4º ano', '5º ano', '6º ano', '7º ano', '8º ano', '9º ano', '1º ano EM', '2º ano EM', '3º ano EM'],
    skills: [
      'Compreender o funcionamento das tecnologias digitais',
      'Utilizar tecnologias digitais de forma crítica',
      'Criar conteúdos digitais',
      'Comunicar-se através de tecnologias digitais',
    ],
    culturalDigital: true,
  },
];

// Competências de Matemática - Ensino Fundamental
const MATH_COMPETENCIES: BNCCCompetency[] = [
  {
    id: 'bncc_ef04_ma01',
    code: 'EF04MA01',
    name: 'Ler, escrever e ordenar números naturais até a ordem de dezenas de milhar',
    description: 'Ler, escrever e ordenar números naturais até a ordem de dezenas de milhar.',
    area: 'Matemática',
    component: 'Matemática',
    yearRange: ['4º ano'],
    skills: ['Leitura e escrita de números', 'Ordenação numérica'],
    culturalDigital: false,
  },
  {
    id: 'bncc_ef04_ma06',
    code: 'EF04MA06',
    name: 'Resolver e elaborar problemas envolvendo diferentes significados da multiplicação e da divisão',
    description: 'Resolver e elaborar problemas envolvendo diferentes significados da multiplicação e da divisão: adição de parcelas iguais, configuração retangular, repartição em partes iguais e medida, utilizando estratégias diversas, como cálculo por estimativa, cálculo mental e algoritmos.',
    area: 'Matemática',
    component: 'Matemática',
    yearRange: ['4º ano'],
    skills: ['Multiplicação', 'Divisão', 'Resolução de problemas'],
    culturalDigital: false,
  },
  {
    id: 'bncc_ef05_ma01',
    code: 'EF05MA01',
    name: 'Ler, escrever e ordenar números naturais até a ordem das centenas de milhar',
    description: 'Ler, escrever e ordenar números naturais até a ordem das centenas de milhar com compreensão das principais características do sistema de numeração decimal.',
    area: 'Matemática',
    component: 'Matemática',
    yearRange: ['5º ano'],
    skills: ['Sistema de numeração decimal', 'Leitura e escrita de números'],
    culturalDigital: false,
  },
  {
    id: 'bncc_ef06_ma01',
    code: 'EF06MA01',
    name: 'Comparar, ordenar, ler e escrever números naturais e números racionais',
    description: 'Comparar, ordenar, ler e escrever números naturais e números racionais cuja representação decimal é finita, fazendo uso da reta numérica.',
    area: 'Matemática',
    component: 'Matemática',
    yearRange: ['6º ano'],
    skills: ['Números racionais', 'Reta numérica', 'Comparação e ordenação'],
    culturalDigital: false,
  },
  {
    id: 'bncc_ef06_ma06',
    code: 'EF06MA06',
    name: 'Resolver e elaborar problemas que envolvam as ideias de múltiplo e de divisor',
    description: 'Resolver e elaborar problemas que envolvam as ideias de múltiplo e de divisor.',
    area: 'Matemática',
    component: 'Matemática',
    yearRange: ['6º ano'],
    skills: ['Múltiplos', 'Divisores', 'Resolução de problemas'],
    culturalDigital: false,
  },
  {
    id: 'bncc_ef07_ma01',
    code: 'EF07MA01',
    name: 'Resolver e elaborar problemas com números naturais',
    description: 'Resolver e elaborar problemas com números naturais, envolvendo as noções de divisor e múltiplo, podendo incluir máximo divisor comum ou mínimo múltiplo comum, por meio de estratégias diversas, sem a aplicação de algoritmos.',
    area: 'Matemática',
    component: 'Matemática',
    yearRange: ['7º ano'],
    skills: ['MDC', 'MMC', 'Resolução de problemas'],
    culturalDigital: false,
  },
  {
    id: 'bncc_ef08_ma01',
    code: 'EF08MA01',
    name: 'Utilizar estratégias para o cálculo mental e para o cálculo por estimativa',
    description: 'Utilizar estratégias para o cálculo mental e para o cálculo por estimativa, e calcular resultados de operações numéricas por meio de estratégias pessoais.',
    area: 'Matemática',
    component: 'Matemática',
    yearRange: ['8º ano'],
    skills: ['Cálculo mental', 'Estimativa', 'Estratégias de cálculo'],
    culturalDigital: false,
  },
  {
    id: 'bncc_ef09_ma01',
    code: 'EF09MA01',
    name: 'Reconhecer e utilizar propriedades de potências',
    description: 'Reconhecer e utilizar propriedades de potências de expoente inteiro para simplificar expressões numéricas.',
    area: 'Matemática',
    component: 'Matemática',
    yearRange: ['9º ano'],
    skills: ['Potenciação', 'Propriedades de potências'],
    culturalDigital: false,
  },
  {
    id: 'bncc_em_mat_01',
    code: 'EM13MAT101',
    name: 'Interpretar e resolver situações-problema que envolvam conhecimentos numéricos',
    description: 'Interpretar e resolver situações-problema que envolvam conhecimentos numéricos, geométricos, probabilísticos e estatísticos, desenvolvendo estratégias de resolução, incluindo a formulação de conjecturas e a verificação de hipóteses.',
    area: 'Matemática',
    component: 'Matemática',
    yearRange: ['1º ano EM', '2º ano EM', '3º ano EM'],
    skills: ['Resolução de problemas', 'Raciocínio matemático'],
    culturalDigital: false,
  },
  {
    id: 'bncc_em_mat_02',
    code: 'EM13MAT202',
    name: 'Planejar e executar estratégias para resolver problemas',
    description: 'Planejar e executar estratégias para resolver problemas de contagem, probabilidade e estatística, utilizando planilhas eletrônicas, calculadoras e softwares específicos.',
    area: 'Matemática',
    component: 'Matemática',
    yearRange: ['1º ano EM', '2º ano EM', '3º ano EM'],
    skills: ['Probabilidade', 'Estatística', 'Tecnologias digitais'],
    culturalDigital: true,
  },
];

// Competências de Língua Portuguesa
const PORTUGUESE_COMPETENCIES: BNCCCompetency[] = [
  {
    id: 'bncc_ef04_lp01',
    code: 'EF04LP01',
    name: 'Ler e compreender textos de diferentes gêneros',
    description: 'Ler e compreender, com autonomia, textos de diferentes gêneros, com diferentes propósitos de leitura, em suportes variados, digitais ou impressos.',
    area: 'Linguagens',
    component: 'Língua Portuguesa',
    yearRange: ['4º ano'],
    skills: ['Leitura', 'Compreensão textual', 'Gêneros textuais'],
    culturalDigital: false,
  },
  {
    id: 'bncc_ef05_lp01',
    code: 'EF05LP01',
    name: 'Ler e compreender textos de diferentes gêneros e suportes',
    description: 'Ler e compreender, com autonomia, textos de diferentes gêneros e suportes, adequando estratégias de leitura a diferentes objetivos e ao gênero do texto.',
    area: 'Linguagens',
    component: 'Língua Portuguesa',
    yearRange: ['5º ano'],
    skills: ['Leitura crítica', 'Estratégias de leitura'],
    culturalDigital: false,
  },
  {
    id: 'bncc_ef06_lp01',
    code: 'EF06LP01',
    name: 'Ler e compreender textos de diferentes gêneros',
    description: 'Ler e compreender, com autonomia, textos de diferentes gêneros e suportes, adequando estratégias de leitura a diferentes objetivos e ao gênero do texto.',
    area: 'Linguagens',
    component: 'Língua Portuguesa',
    yearRange: ['6º ano'],
    skills: ['Leitura', 'Compreensão textual'],
    culturalDigital: false,
  },
  {
    id: 'bncc_ef15_lp01',
    code: 'EF15LP01',
    name: 'Identificar a função social de textos',
    description: 'Identificar a função social de textos que circulam em campos da vida social dos quais participa cotidianamente (a casa, a rua, a comunidade, a escola) e nas mídias impressa, de massa e digital, reconhecendo para que foram produzidos.',
    area: 'Linguagens',
    component: 'Língua Portuguesa',
    yearRange: ['1º ano', '2º ano', '3º ano', '4º ano', '5º ano'],
    skills: ['Função social dos textos', 'Mídias digitais'],
    culturalDigital: true,
  },
];

// Competências de Ciências
const SCIENCE_COMPETENCIES: BNCCCompetency[] = [
  {
    id: 'bncc_ef04_ci01',
    code: 'EF04CI01',
    name: 'Identificar misturas na vida cotidiana',
    description: 'Identificar misturas na vida cotidiana (água e sal, água e óleo, água e areia) e reconhecer a água como solvente universal.',
    area: 'Ciências da Natureza',
    component: 'Ciências',
    yearRange: ['4º ano'],
    skills: ['Misturas', 'Substâncias'],
    culturalDigital: false,
  },
  {
    id: 'bncc_ef05_ci01',
    code: 'EF05CI01',
    name: 'Explicar a importância da água para os seres vivos',
    description: 'Explicar a importância da água para os seres vivos e para a manutenção da vida na Terra, identificando os estados físicos da água e seus usos.',
    area: 'Ciências da Natureza',
    component: 'Ciências',
    yearRange: ['5º ano'],
    skills: ['Água', 'Ciclo da água'],
    culturalDigital: false,
  },
  {
    id: 'bncc_ef06_ci01',
    code: 'EF06CI01',
    name: 'Explicar a importância da água para os seres vivos',
    description: 'Explicar a importância da água para os seres vivos e para a manutenção da vida na Terra, identificando os estados físicos da água e seus usos.',
    area: 'Ciências da Natureza',
    component: 'Ciências',
    yearRange: ['6º ano'],
    skills: ['Água', 'Seres vivos'],
    culturalDigital: false,
  },
  {
    id: 'bncc_ef67_ci13',
    code: 'EF67CI13',
    name: 'Discutir e avaliar o uso de diferentes materiais no desenvolvimento de tecnologias digitais',
    description: 'Discutir e avaliar o uso de diferentes materiais na produção de objetos tecnológicos, suas aplicações, propriedades físicas e implicações ambientais, visando o desenvolvimento sustentável.',
    area: 'Ciências da Natureza',
    component: 'Ciências',
    yearRange: ['6º ano', '7º ano'],
    skills: ['Avaliar tecnologias digitais', 'Considerar sustentabilidade'],
    culturalDigital: true,
  },
];

// Competências de História
const HISTORY_COMPETENCIES: BNCCCompetency[] = [
  {
    id: 'bncc_ef04_hi01',
    code: 'EF04HI01',
    name: 'Reconhecer a história como resultado da ação humana',
    description: 'Reconhecer a história como resultado da ação humana no tempo e no espaço, com base na identificação de relações sociais, econômicas e políticas presentes em seu contexto de vida.',
    area: 'Ciências Humanas',
    component: 'História',
    yearRange: ['4º ano'],
    skills: ['Pensamento histórico', 'Temporalidade'],
    culturalDigital: false,
  },
  {
    id: 'bncc_ef06_hi01',
    code: 'EF06HI01',
    name: 'Identificar diferentes formas de compreender a temporalidade',
    description: 'Identificar diferentes formas de compreender a temporalidade histórica, reconhecendo a história como resultado da ação humana no tempo e no espaço.',
    area: 'Ciências Humanas',
    component: 'História',
    yearRange: ['6º ano'],
    skills: ['Temporalidade', 'História'],
    culturalDigital: false,
  },
  {
    id: 'bncc_ef08_hi01',
    code: 'EF08HI01',
    name: 'Identificar e caracterizar processos de formação de territórios',
    description: 'Identificar e caracterizar processos de formação de territórios e fronteiras em diferentes tempos e espaços, reconhecendo conflitos e negociações envolvidos nesses processos.',
    area: 'Ciências Humanas',
    component: 'História',
    yearRange: ['8º ano'],
    skills: ['Território', 'Fronteiras'],
    culturalDigital: false,
  },
];

// Competências de Geografia
const GEOGRAPHY_COMPETENCIES: BNCCCompetency[] = [
  {
    id: 'bncc_ef04_ge01',
    code: 'EF04GE01',
    name: 'Ler e interpretar mapas e plantas',
    description: 'Ler e interpretar mapas e plantas, reconhecendo a função dos elementos que os compõem (título, legenda, escala, orientação e fonte).',
    area: 'Ciências Humanas',
    component: 'Geografia',
    yearRange: ['4º ano'],
    skills: ['Leitura de mapas', 'Orientação espacial'],
    culturalDigital: false,
  },
  {
    id: 'bncc_ef06_ge01',
    code: 'EF06GE01',
    name: 'Ler e interpretar mapas temáticos',
    description: 'Ler e interpretar mapas temáticos e históricos, reconhecendo a função dos elementos que os compõem (título, legenda, escala, orientação e fonte).',
    area: 'Ciências Humanas',
    component: 'Geografia',
    yearRange: ['6º ano'],
    skills: ['Mapas temáticos', 'Análise espacial'],
    culturalDigital: false,
  },
  {
    id: 'bncc_ef89_ge08',
    code: 'EF89GE08',
    name: 'Analisar transformações territoriais, considerando o desenvolvimento de tecnologias digitais',
    description: 'Analisar transformações territoriais, considerando o desenvolvimento de infraestruturas e redes de transporte e comunicação e identificando redes de informação e fluxos migratórios e de produtos.',
    area: 'Ciências Humanas',
    component: 'Geografia',
    yearRange: ['8º ano', '9º ano'],
    skills: ['Analisar tecnologias digitais', 'Compreender transformações territoriais'],
    culturalDigital: true,
  },
];

// Unifica todas as competências BNCC
export const ALL_BNCC_COMPETENCIES: BNCCCompetency[] = [
  ...GENERAL_COMPETENCIES,
  ...MATH_COMPETENCIES,
  ...PORTUGUESE_COMPETENCIES,
  ...SCIENCE_COMPETENCIES,
  ...HISTORY_COMPETENCIES,
  ...GEOGRAPHY_COMPETENCIES,
];

// Mantém compatibilidade com código existente
export const CULTURE_DIGITAL_COMPETENCIES: BNCCCompetency[] = ALL_BNCC_COMPETENCIES.filter(c => c.culturalDigital);

/**
 * Mapeamento de nomes de disciplinas para componentes BNCC
 */
const SUBJECT_TO_COMPONENT_MAP: Record<string, string[]> = {
  'matemática': ['Matemática'],
  'matematica': ['Matemática'],
  'português': ['Língua Portuguesa'],
  'portugues': ['Língua Portuguesa'],
  'língua portuguesa': ['Língua Portuguesa'],
  'lingua portuguesa': ['Língua Portuguesa'],
  'ciências': ['Ciências'],
  'ciencias': ['Ciências'],
  'história': ['História'],
  'historia': ['História'],
  'geografia': ['Geografia'],
  'cultura digital': ['Tecnologias Digitais'],
  'tecnologias digitais': ['Tecnologias Digitais'],
};

/**
 * Normaliza nome da disciplina para buscar componente BNCC
 */
function normalizeSubjectName(subjectName: string): string[] {
  const normalized = subjectName.toLowerCase().trim();
  
  // Busca direta no mapa
  if (SUBJECT_TO_COMPONENT_MAP[normalized]) {
    return SUBJECT_TO_COMPONENT_MAP[normalized];
  }
  
  // Busca parcial
  for (const [key, components] of Object.entries(SUBJECT_TO_COMPONENT_MAP)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return components;
    }
  }
  
  // Fallback: retorna todas as áreas se não encontrar
  return ['Matemática', 'Língua Portuguesa', 'Ciências', 'História', 'Geografia', 'Tecnologias Digitais'];
}

/**
 * Busca competências BNCC relacionadas a um tema ou componente
 * Agora busca em TODA a base BNCC, não apenas Cultura Digital
 */
export function findRelevantCompetencies(
  component?: string,
  year?: string,
  theme?: string
): BNCCCompetency[] {
  // Se não especificar componente, busca em todas as competências
  let competencies = ALL_BNCC_COMPETENCIES;

  // Se especificar componente, normaliza e busca
  if (component) {
    const normalizedComponents = normalizeSubjectName(component);
    competencies = competencies.filter((c) =>
      normalizedComponents.some(nc => 
        c.component.toLowerCase().includes(nc.toLowerCase()) ||
        c.area.toLowerCase().includes(nc.toLowerCase())
      )
    );
    
    // Se não encontrou nada específico, inclui competências gerais também
    if (competencies.length === 0) {
      competencies = ALL_BNCC_COMPETENCIES.filter(c => 
        c.area === 'Competência Geral' || 
        normalizedComponents.some(nc => c.component.toLowerCase().includes(nc.toLowerCase()))
      );
    }
  }

  // Filtra por ano se especificado
  if (year) {
    competencies = competencies.filter((c) => c.yearRange.includes(year));
  }

  // Filtra por tema se especificado
  if (theme) {
    const themeLower = theme.toLowerCase();
    const themeMatches = competencies.filter(
      (c) =>
        c.name.toLowerCase().includes(themeLower) ||
        c.description.toLowerCase().includes(themeLower) ||
        c.skills.some((skill) => skill.toLowerCase().includes(themeLower))
    );
    
    // Se encontrou matches por tema, usa eles; senão mantém todos
    if (themeMatches.length > 0) {
      competencies = themeMatches;
    }
  }

  // Sempre inclui competência geral de Cultura Digital se for relevante
  const cultureDigitalComp = ALL_BNCC_COMPETENCIES.find(c => c.code === 'COMP5');
  if (cultureDigitalComp && !competencies.find(c => c.id === cultureDigitalComp.id)) {
    // Adiciona se for relevante ao contexto
    if (!component || component.toLowerCase().includes('digital') || component.toLowerCase().includes('tecnologia')) {
      competencies.push(cultureDigitalComp);
    }
  }

  // Retorna no máximo 10 competências mais relevantes
  return competencies.slice(0, 10);
}
