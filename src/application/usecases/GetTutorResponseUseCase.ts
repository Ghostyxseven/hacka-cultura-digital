// src/application/usecases/GetTutorResponseUseCase.ts
import { IAIService } from '../../core/interfaces/services/IAIService';
import { LessonPlan } from '../../core/entities/LessonPlan';

export interface TutorChatRequest {
    lessonPlanId: string;
    message: string;
    history: { role: 'user' | 'assistant', content: string }[];
}

export class GetTutorResponseUseCase {
    constructor(private aiService: any) { } // Usando any para facilitar se o IAIService não tiver chat ainda

    async execute(request: TutorChatRequest, lessonPlan: LessonPlan): Promise<string> {
        // Aqui vamos usar um prompt específico de Tutor Socrático
        const prompt = `
Você é o "Tutor Digital", um assistente de IA socrático para alunos do IFPI.
Seu objetivo é ajudar o aluno a entender o plano de aula: "${lessonPlan.title}".

CONTEXTO DA AULA:
${lessonPlan.content}

HISTÓRICO DA CONVERSA:
${request.history.map(h => `${h.role === 'user' ? 'Aluno' : 'Tutor'}: ${h.content}`).join('\n')}

NOVA MENSAGEM DO ALUNO:
${request.message}

DIRETRIZES DO TUTOR SOCRÁTICO:
1. NÃO dê a resposta pronta de imediato.
2. Faça perguntas que guiem o aluno a descobrir a lógica por trás do conceito.
3. Seja encorajador e use uma linguagem simples, adequada para o ano: ${lessonPlan.gradeYear}.
4. Se o aluno estiver completamente perdido, dê uma dica pequena baseada no "CONTEXTO DA AULA" acima.
5. Seja breve (máximo 400 caracteres).

Responda agora ao aluno:
`;

        // Vamos usar o modelo diretamente do service ou estender o service
        // Por simplicidade, assumirei que o aiService tem um método generalista ou usarei o generateContent do Gemini
        return await this.aiService.ask(prompt);
    }
}
