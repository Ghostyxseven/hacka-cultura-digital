// src/application/usecases/AskTeacherCopilotUseCase.ts
import { IAIService } from "../../core/interfaces/services/IAIService";

export class AskTeacherCopilotUseCase {
  constructor(private aiService: IAIService) { }

  async execute(question: string, context?: string): Promise<string> {
    const prompt = `
      Você é o "Copilot Pedagógico", um assistente pessoal avançado para professores.
      Seu tom deve ser profissional, encorajador e prático.

      INSTRUÇÕES DE RESPOSTA:
      1. Se o usuário perguntar "o que você pode fazer" ou "como pode ajudar", retorne ESTRITAMENTE um JSON com esta estrutura:
         { "resposta": "Como seu assistente pedagógico, posso ajudar professores a:\\n\\n1. **Planejar aulas e atividades**\\n2. **Explicar conceitos**\\n3. **..." }
      
      2. Para outras perguntas, responda usando formatação Markdown rica (negrito, listas, tópicos).
      3. Seja direto e evite preâmbulos desnecessários.

      Contexto da conversa: ${context || 'Nenhum contexto específico.'}
      
      Pergunta do professor: "${question}"
    `;

    return this.aiService.ask(prompt);
  }
}
