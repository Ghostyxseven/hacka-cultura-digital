// src/infrastructure/ai/GeminiServiceWithRAG.ts
import { 
  GoogleGenerativeAI, 
  HarmCategory, 
  HarmBlockThreshold,
  GenerativeModel 
} from "@google/generative-ai";
import { LessonPlan, SchoolYear, QuizQuestion } from "../../core/entities/LessonPlan";
import { IAIService } from "./IAIService";
import { IRAGService } from "../rag/IRAGService";
import { SimpleRAGService } from "../rag/SimpleRAGService";

/**
 * Implementação do serviço de IA usando Google Gemini com RAG (Retrieval Augmented Generation).
 * Enriquece os prompts com contexto recuperado da BNCC e diretrizes do MEC.
 * Segue o padrão de Clean Architecture, implementando a interface IAIService.
 */
export class GeminiServiceWithRAG implements IAIService {
  private model: GenerativeModel;
  private readonly API_KEY: string;
  private ragService: IRAGService;
  
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

  constructor(ragService?: IRAGService) {
    this.API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";
    
    if (!this.API_KEY) {
      throw new Error("NEXT_PUBLIC_GEMINI_API_KEY não configurada. Configure a variável de ambiente.");
    }

    // Usa o RAGService fornecido ou cria um novo
    this.ragService = ragService || new SimpleRAGService();

    const genAI = new GoogleGenerativeAI(this.API_KEY);
    
    this.model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      // Configurações de segurança para evitar bloqueios bobos no dia do Pitch
      safetySettings: [
        { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
        { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
        { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
        { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
      ],
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.7,
      }
    });
  }

  async generate(subject: string, topic: string, grade: string): Promise<LessonPlan> {
    // Validação do ano escolar antes de processar
    this.validateSchoolYear(grade);
    
    // Recupera contexto relevante usando RAG
    const relevantContext = await this.ragService.retrieveRelevantContext(
      subject,
      topic,
      grade,
      5 // máximo de 5 trechos relevantes
    );

    // Constrói o contexto RAG para incluir no prompt
    const ragContext = relevantContext.length > 0
      ? `\n\nBASE DE CONHECIMENTO BNCC/MEC (Contexto Relevante):\n${relevantContext.join('\n\n---\n\n')}`
      : '';

    // Prompt estruturado com schema JSON explícito, enriquecido com contexto RAG
    const prompt = `
Você é um assistente pedagógico especializado em Cultura Digital, integrado ao sistema "Hacka Cultura Digital" do IFPI.
Sua missão é criar um plano de aula completo e estruturado seguindo rigorosamente as diretrizes da BNCC.

CONTEXTO:
- Disciplina: ${subject}
- Tema/Tópico: ${topic}
- Ano/Série: ${grade}
${ragContext}

INSTRUÇÕES OBRIGATÓRIAS:
1. Siga rigorosamente as diretrizes da BNCC apresentadas no contexto acima, especialmente as competências de Cultura Digital (Competência 5).
2. Utilize as informações da base de conhecimento BNCC/MEC fornecidas para garantir alinhamento curricular.
3. O plano deve ser prático, aplicável e alinhado à realidade escolar brasileira.
4. Inclua EXATAMENTE 3 questões de quiz com 4 alternativas cada (A, B, C, D).
5. Cada questão deve ter uma justificativa pedagógica clara e fundamentada.
6. A metodologia deve ser detalhada, passo a passo, para o professor aplicar em sala.
7. Referencie explicitamente as competências BNCC relevantes no campo "bnccCompetencies".

FORMATO JSON OBRIGATÓRIO (retorne APENAS o JSON, sem markdown ou texto adicional):
{
  "title": "Título do plano de aula (tema da unidade)",
  "objectives": ["Objetivo 1", "Objetivo 2", "Objetivo 3"],
  "methodology": "Descrição detalhada e prática da metodologia, passo a passo, com pelo menos 3 parágrafos",
  "duration": "Tempo estimado (ex: '2 aulas de 50 minutos')",
  "bnccCompetencies": [
    "Código/Descrição da competência BNCC 1 (referenciando o contexto fornecido)",
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
- Utilize o contexto RAG fornecido para garantir alinhamento com a BNCC
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
      const lessonPlan = this.validateAndBuildLessonPlan(parsedData, subject, grade as SchoolYear);
      
      return lessonPlan;
    } catch (error: any) {
      // Se houver erro, tenta novamente sem RAG (fallback)
      console.warn('Erro na geração com RAG, tentando sem contexto:', error.message);
      return this.generateWithoutRAG(subject, topic, grade);
    }
  }

  /**
   * Método de fallback: gera sem RAG em caso de erro
   */
  private async generateWithoutRAG(subject: string, topic: string, grade: string): Promise<LessonPlan> {
    // Implementação simplificada sem RAG (pode usar GeminiService original)
    // Por enquanto, apenas relança o erro
    throw new Error(
      `Erro ao gerar plano de aula: ${subject} - ${topic} (${grade}). ` +
      `Tente novamente ou verifique a configuração da API.`
    );
  }

  /**
   * Valida se o ano escolar é válido
   */
  private validateSchoolYear(grade: string): void {
    if (!this.VALID_SCHOOL_YEARS.includes(grade as SchoolYear)) {
      throw new Error(
        `Ano/série inválido: ${grade}. ` +
        `Valores válidos: ${this.VALID_SCHOOL_YEARS.join(', ')}`
      );
    }
  }

  /**
   * Valida e constrói o LessonPlan completo
   */
  private validateAndBuildLessonPlan(
    data: any,
    subject: string,
    grade: SchoolYear
  ): LessonPlan {
    // Validações básicas
    if (!data.title || typeof data.title !== 'string') {
      throw new Error('Título do plano de aula é obrigatório');
    }

    if (!data.objectives || !Array.isArray(data.objectives) || data.objectives.length === 0) {
      throw new Error('Objetivos são obrigatórios e devem ser um array não vazio');
    }

    if (!data.methodology || typeof data.methodology !== 'string') {
      throw new Error('Metodologia é obrigatória');
    }

    if (!data.duration || typeof data.duration !== 'string') {
      throw new Error('Duração é obrigatória');
    }

    if (!data.bnccCompetencies || !Array.isArray(data.bnccCompetencies) || data.bnccCompetencies.length === 0) {
      throw new Error('Competências BNCC são obrigatórias');
    }

    if (!data.content || typeof data.content !== 'string') {
      throw new Error('Conteúdo é obrigatório');
    }

    if (!data.quiz || !Array.isArray(data.quiz) || data.quiz.length !== 3) {
      throw new Error('Quiz deve conter exatamente 3 questões');
    }

    // Valida e processa as questões do quiz
    const quiz: QuizQuestion[] = data.quiz.map((q: any, index: number) => {
      if (!q.question || typeof q.question !== 'string') {
        throw new Error(`Questão ${index + 1}: pergunta é obrigatória`);
      }

      if (!q.options || !Array.isArray(q.options) || q.options.length !== 4) {
        throw new Error(`Questão ${index + 1}: deve ter exatamente 4 alternativas`);
      }

      if (typeof q.correctAnswer !== 'number' || q.correctAnswer < 0 || q.correctAnswer > 3) {
        throw new Error(`Questão ${index + 1}: resposta correta deve ser um número entre 0 e 3`);
      }

      if (!q.justification || typeof q.justification !== 'string') {
        throw new Error(`Questão ${index + 1}: justificativa é obrigatória`);
      }

      return {
        id: q.id || `quiz-${index + 1}`,
        question: q.question,
        options: q.options,
        correctAnswer: q.correctAnswer,
        justification: q.justification
      };
    });

    // Constrói o LessonPlan completo
    const lessonPlan: LessonPlan = {
      id: `lesson-plan-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
      title: data.title,
      subject: subject,
      gradeYear: grade,
      objectives: data.objectives,
      methodology: data.methodology,
      duration: data.duration,
      bnccCompetencies: data.bnccCompetencies,
      content: data.content,
      quiz: quiz,
      metadata: {
        aiModel: 'gemini-1.5-flash',
        promptVersion: '2.0-rag',
        isFavorite: false
      },
      createdAt: new Date()
    };

    return lessonPlan;
  }
}
