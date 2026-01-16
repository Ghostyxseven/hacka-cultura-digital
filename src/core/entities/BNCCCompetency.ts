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
 * Exemplos de competências BNCC relacionadas à Cultura Digital
 * Fonte: Base Nacional Comum Curricular
 */
export const CULTURE_DIGITAL_COMPETENCIES: BNCCCompetency[] = [
  {
    id: 'bncc_comp_5',
    code: 'COMP5',
    name: 'Compreender, utilizar e criar tecnologias digitais de forma crítica',
    description: 'Compreender, utilizar e criar tecnologias digitais de informação e comunicação de forma crítica, significativa, reflexiva e ética nas diversas práticas sociais para se comunicar, acessar e disseminar informações, produzir conhecimentos, resolver problemas e exercer protagonismo e autoria na vida pessoal e coletiva.',
    area: 'Competência Geral',
    component: 'Tecnologias Digitais',
    yearRange: ['6º ano', '7º ano', '8º ano', '9º ano', '1º ano EM', '2º ano EM', '3º ano EM'],
    skills: [
      'Compreender o funcionamento das tecnologias digitais',
      'Utilizar tecnologias digitais de forma crítica',
      'Criar conteúdos digitais',
      'Comunicar-se através de tecnologias digitais',
    ],
    culturalDigital: true,
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

/**
 * Busca competências BNCC relacionadas a um tema ou componente
 */
export function findRelevantCompetencies(
  component?: string,
  year?: string,
  theme?: string
): BNCCCompetency[] {
  let competencies = CULTURE_DIGITAL_COMPETENCIES;

  if (component) {
    competencies = competencies.filter((c) =>
      c.component.toLowerCase().includes(component.toLowerCase())
    );
  }

  if (year) {
    competencies = competencies.filter((c) => c.yearRange.includes(year));
  }

  if (theme) {
    const themeLower = theme.toLowerCase();
    competencies = competencies.filter(
      (c) =>
        c.name.toLowerCase().includes(themeLower) ||
        c.description.toLowerCase().includes(themeLower) ||
        c.skills.some((skill) => skill.toLowerCase().includes(themeLower))
    );
  }

  return competencies;
}
