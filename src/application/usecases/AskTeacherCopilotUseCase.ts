// src/application/usecases/AskTeacherCopilotUseCase.ts
import { IAIService } from "../../core/interfaces/services/IAIService";

export class AskTeacherCopilotUseCase {
    constructor(private aiService: IAIService) { }

    async execute(question: string, context?: string): Promise<string> {
        const prompt = `
      Você é um assistente pedagógico especializado projetado para ajudar professores.
      Seu objetivo é fornecer respostas claras, práticas e pedagogicamente sólidas.
      
      Contexto adicional: ${context || 'Nenhum contexto específico fornecido.'}
      
      Pergunta do professor: "${question}"
      
      Responda de forma concisa e útil. Se for uma sugestão de atividade, descreva-a brevemente.
      Se for uma dúvida conceitual, explique com clareza.
    `;

        return this.aiService.ask(prompt);
    }
}
