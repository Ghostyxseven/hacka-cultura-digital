/**
 * Camada Infrastructure - Integração com IA e Serviços Externos
 * 
 * Esta camada contém serviços de integração com inteligência artificial
 * e implementação de RAG (Retrieval Augmented Generation) com BNCC:
 * 
 * - AIService: Integração com provedores de IA (OpenAI, Mock)
 * - BNCCService: Serviço RAG com recuperação de competências BNCC
 * - LessonPlanGenerator: Geração de planos de aula via IA
 * - ActivityGenerator: Geração de atividades avaliativas via IA
 * - UnitSuggestionService: Sugestão automática de unidades via IA
 */
export * from './services/AIService';
export * from './services/BNCCService';
export * from './services/LessonPlanGenerator';
export * from './services/ActivityGenerator';
export * from './services/UnitSuggestionService';
export * from './services/SlideGenerator';