// src/application/usecases/SuggestInterventionsUseCase.ts
import { IAIService } from '../../infrastructure/ai/IAIService';
import { IQuizRepository } from '../../core/repositories/IQuizRepository';
import { IStudentProfileRepository } from '../../core/repositories/IStudentProfileRepository';
import { ILessonRepository } from '../../core/repositories/ILessonRepository';
import { Alert } from '../../core/entities/Alert';

/**
 * Sugestão de intervenção pedagógica
 */
export interface InterventionSuggestion {
  type: 'individual' | 'group' | 'class' | 'material' | 'pedagogical';
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  estimatedImpact: 'low' | 'medium' | 'high';
  steps: string[]; // Passos para implementar
}

export interface SuggestInterventionsRequest {
  alertId?: string; // Se fornecido, sugere baseado no alerta
  studentId?: string; // Se fornecido, sugere para o aluno específico
  subjectId?: string; // Disciplina relacionada
  context?: string; // Contexto adicional
}

/**
 * Caso de uso: Sugerir intervenções pedagógicas
 * Usa IA para sugerir intervenções baseadas em dados do aluno/turma
 */
export class SuggestInterventionsUseCase {
  constructor(
    private aiService: IAIService,
    private quizRepository: IQuizRepository,
    private studentProfileRepository: IStudentProfileRepository,
    private lessonRepository: ILessonRepository
  ) {}

  async execute(request: SuggestInterventionsRequest): Promise<InterventionSuggestion[]> {
    let context = request.context || '';

    // Se tem alerta, busca contexto do alerta
    if (request.alertId) {
      // Assumindo que temos acesso ao repositório de alertas
      // Por enquanto, usamos o contexto fornecido
    }

    // Se tem aluno, busca dados do aluno
    if (request.studentId) {
      const profile = this.studentProfileRepository.getByUserId(request.studentId);
      const quizResults = this.quizRepository.getQuizResultsByUserId(request.studentId);

      if (profile && quizResults.length > 0) {
        const avgScore = quizResults.reduce((sum, r) => sum + r.score, 0) / quizResults.length;
        const recentResults = quizResults.slice(-5); // Últimos 5 quizzes

        context += `
DADOS DO ALUNO:
- Nome: ${profile.name || 'Aluno'}
- Média geral: ${avgScore.toFixed(1)}%
- Total de quizzes: ${quizResults.length}
- Últimos resultados: ${recentResults.map(r => `${r.score}%`).join(', ')}
`;
      }
    }

    // Gera sugestões usando IA
    const suggestions = await this.generateSuggestionsWithAI(context, request.subjectId);

    return suggestions;
  }

  private async generateSuggestionsWithAI(
    context: string,
    subjectId?: string
  ): Promise<InterventionSuggestion[]> {
    const prompt = `
Você é um especialista em intervenção pedagógica e apoio ao aprendizado.
Com base no contexto abaixo, sugira intervenções pedagógicas específicas e práticas.

CONTEXTO:
${context || 'Aluno com desempenho abaixo do esperado'}

INSTRUÇÕES:
1. Sugira 3-5 intervenções práticas e específicas
2. Cada intervenção deve ter tipo, título, descrição, prioridade, impacto estimado e passos
3. Priorize intervenções que possam ser implementadas rapidamente
4. Seja específico e prático

RETORNE APENAS UM JSON NO SEGUINTE FORMATO:
[
  {
    "type": "individual|group|class|material|pedagogical",
    "title": "Título da intervenção",
    "description": "Descrição detalhada...",
    "priority": "low|medium|high",
    "estimatedImpact": "low|medium|high",
    "steps": ["Passo 1", "Passo 2", "Passo 3"]
  }
]
`;

    try {
      const response = await this.aiService.ask(prompt);
      const cleanedText = response.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      const parsed = JSON.parse(cleanedText);
      
      return parsed as InterventionSuggestion[];
    } catch (error) {
      console.error('Erro ao gerar sugestões de intervenção:', error);
      
      // Fallback: sugestões básicas
      return [
        {
          type: 'individual',
          title: 'Acompanhamento Individualizado',
          description: 'Oferecer suporte individual ao aluno para identificar e trabalhar dificuldades específicas',
          priority: 'high',
          estimatedImpact: 'high',
          steps: [
            'Agendar conversa com o aluno',
            'Identificar principais dificuldades',
            'Criar plano de estudo personalizado',
            'Acompanhar progresso semanalmente'
          ]
        },
        {
          type: 'material',
          title: 'Materiais de Reforço',
          description: 'Fornecer materiais adicionais para estudo e prática',
          priority: 'medium',
          estimatedImpact: 'medium',
          steps: [
            'Identificar tópicos que precisam reforço',
            'Preparar ou buscar materiais complementares',
            'Disponibilizar para o aluno',
            'Acompanhar uso dos materiais'
          ]
        }
      ];
    }
  }
}
