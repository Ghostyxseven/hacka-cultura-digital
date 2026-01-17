/**
 * Parser JSON robusto para conteúdo gerado pela IA
 * Extrai e valida JSON mesmo quando vem envolto em markdown ou texto adicional
 */
export class RobustJSONParser {
  /**
   * Tenta extrair e parsear JSON de uma string
   * Suporta JSON envolto em markdown code blocks ou texto adicional
   */
  parse(content: string): { success: boolean; data: any; error?: string } {
    if (!content || typeof content !== 'string') {
      return {
        success: false,
        data: null,
        error: 'Conteúdo vazio ou inválido',
      };
    }

    const trimmed = content.trim();

    // Tenta parse direto
    try {
      const parsed = JSON.parse(trimmed);
      return { success: true, data: parsed };
    } catch {
      // Continua para outras estratégias
    }

    // Estratégia 1: Extrair de markdown code blocks (```json ... ```)
    const markdownMatch = trimmed.match(/```(?:json)?\s*(\{[\s\S]*?\}|\[[\s\S]*?\])\s*```/);
    if (markdownMatch && markdownMatch[1]) {
      try {
        const parsed = JSON.parse(markdownMatch[1]);
        return { success: true, data: parsed };
      } catch (error) {
        // Continua para próxima estratégia
      }
    }

    // Estratégia 2: Extrair primeiro objeto/array JSON encontrado
    const jsonObjectMatch = trimmed.match(/\{[\s\S]*\}/);
    if (jsonObjectMatch && jsonObjectMatch[0]) {
      try {
        const parsed = JSON.parse(jsonObjectMatch[0]);
        return { success: true, data: parsed };
      } catch (error) {
        // Continua para próxima estratégia
      }
    }

    const jsonArrayMatch = trimmed.match(/\[[\s\S]*\]/);
    if (jsonArrayMatch && jsonArrayMatch[0]) {
      try {
        const parsed = JSON.parse(jsonArrayMatch[0]);
        return { success: true, data: parsed };
      } catch (error) {
        // Continua para próxima estratégia
      }
    }

    // Estratégia 3: Tentar extrair múltiplos objetos JSON e retornar o maior
    const regex = /\{[\s\S]*?\}/g;
    let match: RegExpExecArray | null;
    const allMatches: RegExpExecArray[] = [];
    
    while ((match = regex.exec(trimmed)) !== null) {
      allMatches.push(match);
    }
    
    if (allMatches.length > 0) {
      let largestMatch: RegExpExecArray | null = null;
      let largestSize = 0;

      for (const m of allMatches) {
        if (m[0].length > largestSize) {
          try {
            JSON.parse(m[0]); // Testa se é JSON válido
            largestMatch = m;
            largestSize = m[0].length;
          } catch {
            // Ignora JSONs inválidos
          }
        }
      }

      if (largestMatch) {
        try {
          const parsed = JSON.parse(largestMatch[0]);
          return { success: true, data: parsed };
        } catch {
          // Continua para fallback
        }
      }
    }

    // Estratégia 4: Tentar corrigir JSON comum (vírgulas finais, aspas simples, etc.)
    try {
      let fixed = trimmed;
      // Remove comentários de linha (// ...)
      fixed = fixed.replace(/\/\/.*$/gm, '');
      // Remove comentários de bloco (/* ... */)
      fixed = fixed.replace(/\/\*[\s\S]*?\*\//g, '');
      // Remove vírgulas finais antes de } ou ]
      fixed = fixed.replace(/,\s*([}\]])/g, '$1');
      // Tenta parsear novamente
      const parsed = JSON.parse(fixed);
      return { success: true, data: parsed };
    } catch {
      // Fallback: falha completa
    }

    return {
      success: false,
      data: null,
      error: 'Não foi possível extrair JSON válido do conteúdo. O formato pode estar incorreto ou o conteúdo pode estar incompleto.',
    };
  }

  /**
   * Extrai múltiplos objetos JSON de uma string
   * Útil quando a IA retorna múltiplos objetos separados
   */
  extractMultipleJSON(content: string): any[] {
    const results: any[] = [];
    const trimmed = content.trim();

    // Procura por objetos JSON
    const objectRegex = /\{[\s\S]*?\}/g;
    let objectMatch: RegExpExecArray | null;
    while ((objectMatch = objectRegex.exec(trimmed)) !== null) {
      try {
        const parsed = JSON.parse(objectMatch[0]);
        results.push(parsed);
      } catch {
        // Ignora JSONs inválidos
      }
    }

    // Procura por arrays JSON
    const arrayRegex = /\[[\s\S]*?\]/g;
    let arrayMatch: RegExpExecArray | null;
    while ((arrayMatch = arrayRegex.exec(trimmed)) !== null) {
      try {
        const parsed = JSON.parse(arrayMatch[0]);
        results.push(parsed);
      } catch {
        // Ignora JSONs inválidos
      }
    }

    return results;
  }

  /**
   * Valida se um objeto tem a estrutura esperada
   */
  validateStructure(obj: any, requiredFields: string[]): { valid: boolean; missingFields: string[] } {
    if (!obj || typeof obj !== 'object') {
      return {
        valid: false,
        missingFields: requiredFields,
      };
    }

    const missingFields = requiredFields.filter((field) => !(field in obj));

    return {
      valid: missingFields.length === 0,
      missingFields,
    };
  }
}
