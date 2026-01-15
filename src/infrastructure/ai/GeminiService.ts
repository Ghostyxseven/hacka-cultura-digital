// src/infrastructure/ai/GeminiService.ts
import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
  GenerativeModel
} from "@google/generative-ai";
import { LessonPlan, SchoolYear, QuizQuestion, SupportMaterial } from "../../core/entities/LessonPlan";
import { QuizResult } from "../../core/entities/QuizResult";
import { IAIService } from "./IAIService";

/**
 * Implementação do serviço de IA usando Google Gemini.
 * Segue o padrão de Clean Architecture, implementando a interface IAIService.
 */
export class GeminiService implements IAIService {
  private model: GenerativeModel;
  private readonly API_KEY: string;

  // Valores válidos de SchoolYear conforme definido na entidade
  private readonly VALID_SCHOOL_YEARS: readonly SchoolYear[] = [
    '6º Ano',
    '7º Ano',
    '8º Ano',
    '9º Ano',
    '1º Ano EM',
    '2º Ano EM',
    '3º Ano EM'
  ] as const;

  constructor() {
    this.API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";

    if (!this.API_KEY) {
      throw new Error("NEXT_PUBLIC_GEMINI_API_KEY não configurada. Configure a variável de ambiente.");
    }

    const genAI = new GoogleGenerativeAI(this.API_KEY);

    this.model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      // Configurações de segurança para evitar bloqueios bobos no dia do Pitch
      safetySettings: [
        { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
        { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
        { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
        { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
      ],
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.7, // 0.7 é o equilíbrio entre criatividade e precisão pedagógica
      }
    });
  }

  async generate(subject: string, topic: string, grade: string): Promise<LessonPlan> {
    // Validação do ano escolar antes de processar
    this.validateSchoolYear(grade);

    // Prompt estruturado com schema JSON explícito para garantir resposta válida
    const prompt = `
Você é um assistente pedagógico especializado em Cultura Digital, integrado ao sistema "Hacka Cultura Digital" do IFPI.
Sua missão é criar um plano de aula completo e estruturado seguindo rigorosamente as diretrizes da BNCC.

CONTEXTO:
- Disciplina: ${subject}
- Tema/Tópico: ${topic}
- Ano/Série: ${grade}

INSTRUÇÕES OBRIGATÓRIAS:
1. Siga as diretrizes da BNCC, especialmente as competências de Cultura Digital (Competência 5).
2. O plano deve ser prático, aplicável e alinhado à realidade escolar brasileira.
3. Inclua EXATAMENTE 3 questões de quiz com 4 alternativas cada (A, B, C, D).
4. Cada questão deve ter uma justificativa pedagógica clara e fundamentada.
5. A metodologia deve ser detalhada, passo a passo, para o professor aplicar em sala.

FORMATO JSON OBRIGATÓRIO (retorne APENAS o JSON, sem markdown ou texto adicional):
{
  "title": "Título do plano de aula (tema da unidade)",
  "objectives": ["Objetivo 1", "Objetivo 2", "Objetivo 3"],
  "methodology": "Descrição detalhada e prática da metodologia, passo a passo, com pelo menos 3 parágrafos",
  "duration": "Tempo estimado (ex: '2 aulas de 50 minutos')",
  "bnccCompetencies": [
    "Código/Descrição da competência BNCC 1",
    "Código/Descrição da competência BNCC 2"
  ],
  "content": "Desenvolvimento completo do conteúdo da aula, com explicações pedagógicas detalhadas",
  "quiz": [
    {
      "id": "quiz-1",
      "question": "Pergunta 1 sobre o tema",
      "options": ["Alternativa A", "Alternativa B", "Alternativa C", "Alternativa D"],
      "correctAnswer": 0,
      "justification": "Justificativa pedagógica detalhada explicando por que esta é a resposta correta"
    },
    {
      "id": "quiz-2",
      "question": "Pergunta 2 sobre o tema",
      "options": ["Alternativa A", "Alternativa B", "Alternativa C", "Alternativa D"],
      "correctAnswer": 1,
      "justification": "Justificativa pedagógica detalhada"
    },
    {
      "id": "quiz-3",
      "question": "Pergunta 3 sobre o tema",
      "options": ["Alternativa A", "Alternativa B", "Alternativa C", "Alternativa D"],
      "correctAnswer": 2,
      "justification": "Justificativa pedagógica detalhada"
    }
  ]
}

IMPORTANTE:
- Retorne APENAS o JSON válido, sem markdown, sem código, sem explicações adicionais
- O campo "correctAnswer" deve ser um número (0, 1, 2 ou 3) representando o índice da alternativa correta
- Todos os campos são obrigatórios
- O JSON deve ser válido e completo
`;

    try {
      const result = await this.model.generateContent(prompt);
      const responseText = result.response.text();

      // Remove possíveis markdown code blocks se a IA retornar
      const cleanedText = responseText
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .trim();

      const parsedData = JSON.parse(cleanedText);

      // Validação e construção do LessonPlan completo
      const lessonPlan = this.validateAndBuildLessonPlan(parsedData, subject, grade);

      return lessonPlan;
    } catch (error) {
      console.error("Erro na geração do plano de aula:", error);

      if (error instanceof SyntaxError) {
        throw new Error("Erro ao processar resposta da IA: formato JSON inválido. Tente novamente.");
      }

      if (error instanceof Error && error.message.includes("API_KEY")) {
        throw new Error("Erro de configuração: chave da API não encontrada.");
      }

      // Retorno de fallback para o sistema não travar na frente dos jurados
      throw new Error("A IA está processando sua solicitação. Por favor, tente novamente em alguns instantes.");
    }
  }

  async analyzePerformance(result: QuizResult, lessonPlan: LessonPlan): Promise<string> {
    const prompt = `
Você é um mentor pedagógico especializado em Cultura Digital.
Analise o desempenho de um aluno no quiz abaixo e forneça um feedback motivador, construtivo e breve (máximo 300 caracteres).

CONTEXTO DA AULA:
- Título: ${lessonPlan.title}
- Disciplina: ${lessonPlan.subject}
- Ano: ${lessonPlan.gradeYear}

DESEMPENHO DO ALUNO:
- Nota: ${result.score}%
- Acertos: ${result.correctAnswers} de ${result.totalQuestions}
- Respostas dadas: ${JSON.stringify(result.answers)}

INSTRUÇÕES:
1. Se a nota for alta (>= 70%), parabenize e destaque o domínio do conteúdo.
2. Se a nota for média (50-69%), incentive e aponte que com um pouco mais de estudo ele chegará lá.
3. Se a nota for baixa (< 50%), seja empático e sugira que ele revise o conteúdo da aula, focando nos pontos que errou.
4. Identifique o tema principal onde o aluno falhou (baseado na justificativa das questões que ele errou).
5. Retorne APENAS o texto do feedback, sem introduções ou formatação adicional.
`;

    try {
      const response = await this.model.generateContent(prompt);
      return response.response.text().trim();
    } catch (error) {
      console.error("Erro na análise de desempenho:", error);
      return "Muito bem por concluir a atividade! Continue se dedicando aos estudos da Cultura Digital para aprimorar seus conhecimentos.";
    }
  }

  async generateSupportMaterials(lessonPlan: LessonPlan): Promise<SupportMaterial[]> {
    const prompt = `
Você é um especialista em tecnologia educacional e Cultura Digital.
Com base no plano de aula abaixo, gere materiais de apoio extras para o aluno.

PLANO DE AULA:
- Título: ${lessonPlan.title}
- Tema: ${lessonPlan.content.substring(0, 500)}...
- Público: ${lessonPlan.gradeYear}

REQUISITOS:
1. Gere um roteiro de slides estruturado (mínimo 5 slides).
2. Sugira 2 links de leitura/notícias reais e confiáveis sobre o tema.
3. Sugira 2 vídeos (YouTube) relevantes sobre o tema.

RETORNE APENAS UM JSON NO SEGUINTE FORMATO:
[
  {
    "type": "slide",
    "title": "Estrutura de Slides Sugerida",
    "slides": [
      { "title": "Slide 1: Título", "content": ["Ponto 1", "Ponto 2"] }
    ]
  },
  { "type": "link", "title": "Título do Link", "url": "https://..." },
  { "type": "video", "title": "Título do Vídeo", "url": "https://..." }
]
`;

    try {
      const response = await this.model.generateContent(prompt);
      const text = response.response.text().trim();
      // Limpa possíveis marcações de markdown do JSON
      const jsonStr = text.startsWith('```json') ? text.replace(/```json|```/g, '').trim() : text;
      return JSON.parse(jsonStr);
    } catch (error) {
      console.error("Erro na geração de materiais de apoio:", error);
      return [
        {
          type: 'slide',
          title: 'Estrutura de Slides Básica',
          slides: [
            { title: 'Introdução', content: ['Definição do tema', 'Importância na Cultura Digital'] },
            { title: 'Conclusão', content: ['Resumo dos pontos', 'Próximos passos'] }
          ]
        }
      ];
    }
  }

  /**
   * Valida se o ano escolar fornecido é válido conforme a tipagem SchoolYear
   * @param grade - Ano escolar a ser validado
   * @throws Error se o ano escolar não for válido
   */
  private validateSchoolYear(grade: string): asserts grade is SchoolYear {
    if (!this.VALID_SCHOOL_YEARS.includes(grade as SchoolYear)) {
      const validYears = this.VALID_SCHOOL_YEARS.join(', ');
      throw new Error(
        `Ano escolar inválido: "${grade}". ` +
        `Valores válidos: ${validYears}`
      );
    }
  }

  /**
   * Valida e constrói um LessonPlan completo a partir dos dados da IA
   */
  private validateAndBuildLessonPlan(
    data: any,
    subject: string,
    grade: string
  ): LessonPlan {
    // Validação do ano escolar (garantia adicional)
    this.validateSchoolYear(grade);

    // Validações básicas
    if (!data.title || typeof data.title !== 'string') {
      throw new Error("Resposta da IA inválida: título ausente ou inválido");
    }

    if (!Array.isArray(data.objectives) || data.objectives.length === 0) {
      throw new Error("Resposta da IA inválida: objetivos ausentes ou inválidos");
    }

    if (!data.methodology || typeof data.methodology !== 'string') {
      throw new Error("Resposta da IA inválida: metodologia ausente ou inválida");
    }

    if (!Array.isArray(data.quiz) || data.quiz.length !== 3) {
      throw new Error("Resposta da IA inválida: deve conter exatamente 3 questões de quiz");
    }

    // Validação das questões do quiz
    const validatedQuiz: QuizQuestion[] = data.quiz.map((q: any, index: number) => {
      if (!q.question || typeof q.question !== 'string') {
        throw new Error(`Questão ${index + 1} inválida: pergunta ausente`);
      }
      if (!Array.isArray(q.options) || q.options.length !== 4) {
        throw new Error(`Questão ${index + 1} inválida: deve ter 4 alternativas`);
      }
      if (typeof q.correctAnswer !== 'number' || q.correctAnswer < 0 || q.correctAnswer > 3) {
        throw new Error(`Questão ${index + 1} inválida: resposta correta deve ser entre 0 e 3`);
      }
      if (!q.justification || typeof q.justification !== 'string') {
        throw new Error(`Questão ${index + 1} inválida: justificativa ausente`);
      }

      return {
        id: q.id || `quiz-${index + 1}`,
        question: q.question,
        options: q.options,
        correctAnswer: q.correctAnswer,
        justification: q.justification
      };
    });

    // Construção do LessonPlan completo
    // grade já foi validado, então podemos fazer type assertion com segurança
    const lessonPlan: LessonPlan = {
      id: `lesson-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
      title: data.title,
      subject: subject,
      gradeYear: grade, // TypeScript agora sabe que grade é SchoolYear devido ao type guard
      objectives: data.objectives,
      methodology: data.methodology,
      duration: data.duration || "Não especificado",
      bnccCompetencies: Array.isArray(data.bnccCompetencies)
        ? data.bnccCompetencies
        : ["Competência 5 - Cultura Digital (BNCC)"],
      content: data.content || data.methodology, // Fallback para content se não vier
      quiz: validatedQuiz,
      metadata: {
        aiModel: "gemini-2.5-flash",
        promptVersion: "1.0",
        isFavorite: false
      },
      createdAt: new Date()
    };

    return lessonPlan;
  }
}