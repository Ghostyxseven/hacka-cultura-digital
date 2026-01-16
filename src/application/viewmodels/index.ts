/**
 * ViewModels - Camada de Apresentação
 * 
 * Re-exporta tipos do Core para uso na camada Presentation
 * Seguindo Clean Architecture: Presentation não deve importar diretamente do Core
 * 
 * Os tipos são apenas interfaces/entidades, sem lógica de negócio,
 * mas seguindo o princípio de Clean Architecture, devem passar pela Application
 */
export type { Subject } from '@/core/entities/Subject';
export type { Unit } from '@/core/entities/Unit';
export type { LessonPlan } from '@/core/entities/LessonPlan';
export type { Activity } from '@/core/entities/Activity';
export type { ActivityQuestion } from '@/core/entities/Activity';
export type { BNCCCompetency } from '@/core/entities/BNCCCompetency';
