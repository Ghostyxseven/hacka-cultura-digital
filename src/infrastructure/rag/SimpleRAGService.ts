// src/infrastructure/rag/SimpleRAGService.ts
import { IRAGService } from './IRAGService';
import { BNCC_KNOWLEDGE } from './knowledge/BNCCKnowledge';
import { MEC_GUIDELINES } from './knowledge/MECGuidelines';

/**
 * Implementação simples de RAG usando busca textual.
 * Recupera trechos relevantes da BNCC e diretrizes do MEC.
 * 
 * Esta é uma implementação básica que pode ser melhorada futuramente
 * com embeddings vetoriais para busca semântica mais precisa.
 */
export class SimpleRAGService implements IRAGService {
  private knowledgeBase: Map<string, string>;

  constructor() {
    this.knowledgeBase = new Map();
    this.initializeKnowledgeBase();
  }

  /**
   * Inicializa a base de conhecimento com documentos da BNCC e MEC
   */
  private initializeKnowledgeBase(): void {
    this.knowledgeBase.set('bncc', BNCC_KNOWLEDGE);
    this.knowledgeBase.set('mec', MEC_GUIDELINES);
  }

  /**
   * Recupera contexto relevante da base de conhecimento
   */
  async retrieveRelevantContext(
    subject: string,
    topic: string,
    grade: string,
    maxResults: number = 5
  ): Promise<string[]> {
    const relevantSnippets: string[] = [];
    const queryTerms = this.extractQueryTerms(subject, topic, grade);

    // Busca na base de conhecimento BNCC
    const bnccSnippets = this.searchInDocument(
      this.knowledgeBase.get('bncc') || '',
      queryTerms,
      grade
    );
    relevantSnippets.push(...bnccSnippets);

    // Busca na base de conhecimento MEC
    const mecSnippets = this.searchInDocument(
      this.knowledgeBase.get('mec') || '',
      queryTerms,
      grade
    );
    relevantSnippets.push(...mecSnippets);

    // Remove duplicatas e limita resultados
    const uniqueSnippets = Array.from(new Set(relevantSnippets));
    return uniqueSnippets.slice(0, maxResults);
  }

  /**
   * Extrai termos de busca da consulta
   */
  private extractQueryTerms(subject: string, topic: string, grade: string): string[] {
    const terms: string[] = [];
    
    // Adiciona termos do tema
    terms.push(...topic.toLowerCase().split(/\s+/));
    
    // Adiciona termos da disciplina
    terms.push(...subject.toLowerCase().split(/\s+/));
    
    // Adiciona série/ano
    terms.push(grade.toLowerCase());
    
    // Termos relacionados a Cultura Digital
    terms.push('cultura digital', 'tecnologias digitais', 'competência 5', 'bncc');
    
    return terms;
  }

  /**
   * Busca termos no documento e retorna trechos relevantes
   */
  private searchInDocument(
    document: string,
    queryTerms: string[],
    grade: string
  ): string[] {
    const snippets: string[] = [];
    const lines = document.split('\n');
    const gradePattern = this.getGradePattern(grade);

    // Busca por termos e séries/anos relevantes
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].toLowerCase();
      
      // Verifica se a linha contém termos relevantes
      const hasRelevantTerms = queryTerms.some(term => line.includes(term));
      const hasRelevantGrade = gradePattern.test(line);

      if (hasRelevantTerms || hasRelevantGrade) {
        // Captura contexto (linhas ao redor)
        const start = Math.max(0, i - 2);
        const end = Math.min(lines.length, i + 3);
        const snippet = lines.slice(start, end).join('\n').trim();
        
        if (snippet.length > 50) { // Ignora snippets muito pequenos
          snippets.push(snippet);
        }
      }
    }

    return snippets;
  }

  /**
   * Gera padrão de regex para séries/anos relevantes
   */
  private getGradePattern(grade: string): RegExp {
    // Mapeia séries para padrões de busca
    const gradeMappings: Record<string, string[]> = {
      '6º ano': ['6º', 'sexto', 'anos finais', 'fundamental'],
      '7º ano': ['7º', 'sétimo', 'anos finais', 'fundamental'],
      '8º ano': ['8º', 'oitavo', 'anos finais', 'fundamental'],
      '9º ano': ['9º', 'nono', 'anos finais', 'fundamental'],
      '1º ano em': ['1º', 'primeiro', 'ensino médio', 'em'],
      '2º ano em': ['2º', 'segundo', 'ensino médio', 'em'],
      '3º ano em': ['3º', 'terceiro', 'ensino médio', 'em'],
    };

    const gradeLower = grade.toLowerCase();
    const patterns = gradeMappings[gradeLower] || [gradeLower];
    
    return new RegExp(`(${patterns.join('|')})`, 'i');
  }
}
