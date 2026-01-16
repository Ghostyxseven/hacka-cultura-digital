// src/core/interfaces/services/IRAGService.ts

/**
 * Interface para serviços de RAG (Retrieval Augmented Generation).
 * Define o contrato para recuperação de conhecimento relevante da BNCC/MEC.
 */
export interface IRAGService {
  /**
   * Recupera documentos relevantes da base de conhecimento
   * baseado no contexto da consulta (disciplina, tema, série/ano).
   * 
   * @param subject - Nome da disciplina
   * @param topic - Tema/tópico da aula
   * @param grade - Ano/série escolar
   * @param maxResults - Número máximo de resultados (padrão: 5)
   * @returns Promise com trechos relevantes da BNCC/MEC
   */
  retrieveRelevantContext(
    subject: string,
    topic: string,
    grade: string,
    maxResults?: number
  ): Promise<string[]>;
}
