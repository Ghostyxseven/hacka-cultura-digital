/**
 * Custom Hooks - Presentation Layer
 * 
 * Hooks customizados para lógica de apresentação
 * Seguem Clean Architecture: separam lógica de UI das páginas
 * 
 * Hooks disponíveis:
 * - useDashboard: Lógica do dashboard principal
 * - useSubjectDetail: Lógica de detalhes da disciplina
 * - useMaterialGeneration: Lógica de geração de materiais
 * - useUnitForm: Lógica do formulário de unidade
 * - useSubjectForm: Lógica do formulário de disciplina
 * - useToast: Gerenciamento de notificações toast
 */
export * from './useDashboard';
export * from './useSubjectDetail';
export * from './useMaterialGeneration';
export * from './useUnitForm';
export * from './useSubjectForm';
export * from './useToast';