// src/application/index.ts
// Exporta todos os casos de uso e serviços da camada de aplicação

// Casos de uso
export { GenerateLessonPlanUseCase } from "./usecases/GenerateLessonPlanUseCase";
export { CreateSubjectUseCase } from "./usecases/CreateSubjectUseCase";
export { GetSubjectsUseCase } from "./usecases/GetSubjectsUseCase";
export { DeleteSubjectUseCase } from "./usecases/DeleteSubjectUseCase";
export { SaveLessonPlanUseCase } from "./usecases/SaveLessonPlanUseCase";
export { GetLessonPlansUseCase } from "./usecases/GetLessonPlansUseCase";
export { GetLessonPlanByIdUseCase } from "./usecases/GetLessonPlanByIdUseCase";
export { CreateUnitUseCase } from "./usecases/CreateUnitUseCase";
export { SuggestUnitsUseCase } from "./usecases/SuggestUnitsUseCase";
export { GetUnitsUseCase } from "./usecases/GetUnitsUseCase";
export { GenerateLessonPlanForUnitUseCase } from "./usecases/GenerateLessonPlanForUnitUseCase";

// Serviços
export { LessonPlanService } from "./services/LessonPlanService";
