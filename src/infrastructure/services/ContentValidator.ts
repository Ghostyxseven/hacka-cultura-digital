import { LessonPlan } from '@/core/entities/LessonPlan';
import { Activity, ActivityQuestion } from '@/core/entities/Activity';
import type { Slide } from '@/application/viewmodels';
import { ALL_BNCC_COMPETENCIES } from '@/core/entities/BNCCCompetency';

/**
 * Resultado de uma validação de conteúdo
 */
export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Validador de conteúdo gerado pela IA
 * Responsável por validar estrutura, campos obrigatórios e códigos BNCC
 */
export class ContentValidator {
  /**
   * Valida um plano de aula gerado
   */
  validateLessonPlan(plan: Partial<LessonPlan>): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Validação de campos obrigatórios
    if (!plan.title || plan.title.trim().length === 0) {
      errors.push('Título do plano de aula é obrigatório');
    }

    if (!plan.objective || plan.objective.trim().length === 0) {
      errors.push('Objetivo do plano de aula é obrigatório');
    }

    if (!plan.content || plan.content.trim().length === 0) {
      errors.push('Conteúdo do plano de aula é obrigatório');
    }

    // Validação de tamanho mínimo
    if (plan.content && plan.content.trim().length < 100) {
      warnings.push('Conteúdo do plano de aula parece muito curto (< 100 caracteres)');
    }

    if (plan.objective && plan.objective.trim().length < 20) {
      warnings.push('Objetivo do plano de aula parece muito curto (< 20 caracteres)');
    }

    // Validação de códigos BNCC mencionados no conteúdo
    if (plan.content || plan.objective || plan.bnccAlignment) {
      const bnccCodes = this.extractBNCCCodes(
        `${plan.content || ''} ${plan.objective || ''} ${plan.bnccAlignment || ''}`
      );
      const invalidCodes = this.validateBNCCCodes(bnccCodes);
      if (invalidCodes.length > 0) {
        warnings.push(`Códigos BNCC mencionados podem ser inválidos: ${invalidCodes.join(', ')}`);
      }
      if (bnccCodes.length === 0) {
        warnings.push('Nenhum código BNCC foi mencionado explicitamente no conteúdo');
      }
    }

    // Validação de recursos
    if (plan.resources && plan.resources.length === 0) {
      warnings.push('Nenhum recurso foi especificado para a aula');
    }

    // Validação de duração
    if (plan.duration && (plan.duration < 15 || plan.duration > 180)) {
      errors.push('Duração da aula deve estar entre 15 e 180 minutos');
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * Valida uma atividade gerada
   */
  validateActivity(activity: Partial<Activity>): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Validação de campos obrigatórios
    if (!activity.title || activity.title.trim().length === 0) {
      errors.push('Título da atividade é obrigatório');
    }

    if (!activity.description || activity.description.trim().length === 0) {
      errors.push('Descrição da atividade é obrigatória');
    }

    // Validação de questões
    if (!activity.questions || !Array.isArray(activity.questions) || activity.questions.length === 0) {
      errors.push('A atividade deve conter pelo menos uma questão');
    } else {
      const totalPoints = activity.questions.reduce((sum, q) => sum + (q.points || 0), 0);
      if (totalPoints !== 100 && totalPoints > 0) {
        warnings.push(`Pontuação total das questões é ${totalPoints}, esperado 100 pontos`);
      }

      // Valida cada questão
      activity.questions.forEach((question, index) => {
        const questionResult = this.validateQuestion(question, index);
        errors.push(...questionResult.errors);
        warnings.push(...questionResult.warnings);
      });
    }

    // Validação de descrição
    if (activity.description && activity.description.trim().length < 50) {
      warnings.push('Descrição da atividade parece muito curta (< 50 caracteres)');
    }

    // Validação de códigos BNCC mencionados
    if (activity.description || activity.instructions || activity.evaluationCriteria) {
      const bnccCodes = this.extractBNCCCodes(
        `${activity.description || ''} ${activity.instructions || ''} ${activity.evaluationCriteria || ''}`
      );
      const invalidCodes = this.validateBNCCCodes(bnccCodes);
      if (invalidCodes.length > 0) {
        warnings.push(`Códigos BNCC mencionados podem ser inválidos: ${invalidCodes.join(', ')}`);
      }
    }

    // Validação de instruções
    if (!activity.instructions || activity.instructions.trim().length === 0) {
      warnings.push('Instruções para o aluno não foram fornecidas');
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * Valida uma questão individual
   */
  validateQuestion(question: Partial<ActivityQuestion>, index: number): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!question.question || question.question.trim().length === 0) {
      errors.push(`Questão ${index + 1}: Texto da questão é obrigatório`);
    }

    if (question.type === 'multiple_choice') {
      if (!question.options || question.options.length < 2) {
        errors.push(`Questão ${index + 1}: Questão de múltipla escolha deve ter pelo menos 2 opções`);
      }
      if (!question.correctAnswer) {
        errors.push(`Questão ${index + 1}: Questão de múltipla escolha deve ter resposta correta`);
      }
    }

    if (question.type === 'true_false') {
      if (!question.correctAnswer || !['true', 'false'].includes(question.correctAnswer.toLowerCase())) {
        errors.push(`Questão ${index + 1}: Questão verdadeiro/falso deve ter resposta correta ('true' ou 'false')`);
      }
    }

    if (question.points && (question.points < 1 || question.points > 100)) {
      errors.push(`Questão ${index + 1}: Pontuação deve estar entre 1 e 100`);
    }

    // Valida código BNCC da questão
    if (question.bnccSkill) {
      const invalidCodes = this.validateBNCCCodes([question.bnccSkill]);
      if (invalidCodes.length > 0) {
        warnings.push(`Questão ${index + 1}: Código BNCC '${question.bnccSkill}' pode ser inválido`);
      }
    } else {
      warnings.push(`Questão ${index + 1}: Nenhum código BNCC foi associado à questão`);
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * Valida slides gerados
   */
  validateSlides(slides: Slide[]): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!Array.isArray(slides) || slides.length === 0) {
      errors.push('Deve haver pelo menos um slide');
      return { valid: false, errors, warnings };
    }

    if (slides.length < 5) {
      warnings.push('Número de slides parece muito baixo (< 5 slides)');
    }

    if (slides.length > 25) {
      warnings.push('Número de slides parece muito alto (> 25 slides)');
    }

    // Verifica se primeiro slide é título
    if (slides[0]?.type !== 'title') {
      warnings.push('Primeiro slide deveria ser do tipo "title"');
    }

    // Verifica se último slide é resumo
    if (slides[slides.length - 1]?.type !== 'summary') {
      warnings.push('Último slide deveria ser do tipo "summary"');
    }

    // Valida cada slide
    slides.forEach((slide, index) => {
      if (!slide.title || slide.title.trim().length === 0) {
        errors.push(`Slide ${index + 1}: Título é obrigatório`);
      }
      if (!slide.content || slide.content.trim().length === 0) {
        errors.push(`Slide ${index + 1}: Conteúdo é obrigatório`);
      }
      if (slide.content && slide.content.length > 500) {
        warnings.push(`Slide ${index + 1}: Conteúdo parece muito longo (> 500 caracteres)`);
      }
    });

    return {
      valid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * Extrai códigos BNCC de um texto
   * Padrões: EF04MA27, EF15LP01, EM13MAT305, etc.
   */
  private extractBNCCCodes(text: string): string[] {
    // Padrão para códigos BNCC: EF/EM + 2 dígitos + 2-3 letras + 2-3 dígitos
    const pattern = /\b(EF|EM)\d{2}[A-Z]{2,3}\d{2,3}\b/gi;
    const matches = text.match(pattern) || [];
    // Remove duplicatas e converte para maiúsculas
    return Array.from(new Set(matches.map((code) => code.toUpperCase())));
  }

  /**
   * Valida se códigos BNCC são válidos
   * Retorna array de códigos inválidos
   */
  validateBNCCCodes(codes: string[]): string[] {
    if (codes.length === 0) {
      return [];
    }

    // Cria um set de códigos válidos a partir de ALL_BNCC_COMPETENCIES
    const validCodes = new Set(ALL_BNCC_COMPETENCIES.map((comp) => comp.code.toUpperCase()));

    // Verifica quais códigos não estão na lista de válidos
    const invalidCodes = codes.filter((code) => !validCodes.has(code.toUpperCase()));

    return invalidCodes;
  }

  /**
   * Valida estrutura JSON básica
   */
  validateJSONStructure(obj: any, requiredFields: string[]): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!obj || typeof obj !== 'object') {
      errors.push('Objeto JSON inválido ou ausente');
      return { valid: false, errors, warnings };
    }

    requiredFields.forEach((field) => {
      if (!(field in obj)) {
        errors.push(`Campo obrigatório ausente: ${field}`);
      }
    });

    return {
      valid: errors.length === 0,
      errors,
      warnings,
    };
  }
}
