/**
 * Exporta todas as entidades de domínio
 * 
 * Esta camada contém as entidades puras do domínio seguindo Clean Architecture.
 * Todas as entidades incluem:
 * - Interface TypeScript
 * - Função de validação
 * - Função de criação
 * - Função de atualização (quando aplicável)
 * - Constantes de validação
 * 
 * Princípios aplicados:
 * - Single Responsibility: Cada entidade tem responsabilidade única
 * - Domain-Driven Design: Entidades representam conceitos do domínio
 * - Validation: Validações robustas garantem integridade dos dados
 */
export * from './Subject';
export * from './Unit';
export * from './LessonPlan';
export * from './Activity';
export * from './BNCCCompetency';
