// src/lib/service.ts
// Factory para criar instância do LessonPlanService
import { LessonPlanService } from '../application/services/LessonPlanService';
import { LocalStorageRepository } from '../repository/implementations/LocalStorageRepository';
import { GeminiService } from '../infrastructure/ai/GeminiService';

// Importando UseCases para Injeção de Dependência
import { GenerateLessonPlanUseCase } from '../application/usecases/GenerateLessonPlanUseCase';
import { SaveLessonPlanUseCase } from '../application/usecases/SaveLessonPlanUseCase';
import { GetLessonPlansUseCase } from '../application/usecases/GetLessonPlansUseCase';
import { GetLessonPlanByIdUseCase } from '../application/usecases/GetLessonPlanByIdUseCase';
import { CreateSubjectUseCase } from '../application/usecases/CreateSubjectUseCase';
import { GetSubjectsUseCase } from '../application/usecases/GetSubjectsUseCase';
import { GetSubjectByIdUseCase } from '../application/usecases/GetSubjectByIdUseCase';
import { DeleteSubjectUseCase } from '../application/usecases/DeleteSubjectUseCase';
import { CreateUnitUseCase } from '../application/usecases/CreateUnitUseCase';
import { SuggestUnitsUseCase } from '../application/usecases/SuggestUnitsUseCase';
import { GetUnitsUseCase } from '../application/usecases/GetUnitsUseCase';
import { GetUnitByIdUseCase } from '../application/usecases/GetUnitByIdUseCase';
import { GenerateLessonPlanForUnitUseCase } from '../application/usecases/GenerateLessonPlanForUnitUseCase';
import { DeleteUnitUseCase } from '../application/usecases/DeleteUnitUseCase';
import { AnalyzePerformanceUseCase } from '../application/usecases/AnalyzePerformanceUseCase';
import { GenerateSupportMaterialsUseCase } from '../application/usecases/GenerateSupportMaterialsUseCase';
import { GetQuizResultsByLessonPlanUseCase } from '../application/usecases/GetQuizResultsByLessonPlanUseCase';
import { AddTeacherCommentUseCase } from '../application/usecases/AddTeacherCommentUseCase';
import { UploadMaterialUseCase } from '../application/usecases/UploadMaterialUseCase';
import { GetMaterialsByUnitUseCase } from '../application/usecases/GetMaterialsByUnitUseCase';
import { LocalStorageQuizRepository } from '../repository/implementations/LocalStorageQuizRepository';
import { LocalStorageMaterialRepository } from '../repository/implementations/LocalStorageMaterialRepository';

let serviceInstance: LessonPlanService | null = null;

/**
 * Obtém instância singleton do LessonPlanService
 * Atua como Composition Root da aplicação
 */
export function getLessonPlanService(): LessonPlanService {
  if (!serviceInstance) {
    // Instancia dependências de infraestrutura
    const repository = LocalStorageRepository.getInstance();
    const aiService = new GeminiService();

    // Instancia UseCases (injeção manual)
    const generateLessonPlanUseCase = new GenerateLessonPlanUseCase(aiService);
    const saveLessonPlanUseCase = new SaveLessonPlanUseCase(repository);
    const getLessonPlansUseCase = new GetLessonPlansUseCase(repository);
    const getLessonPlanByIdUseCase = new GetLessonPlanByIdUseCase(repository);

    const createSubjectUseCase = new CreateSubjectUseCase(repository);
    const getSubjectsUseCase = new GetSubjectsUseCase(repository);
    const getSubjectByIdUseCase = new GetSubjectByIdUseCase(repository);
    const deleteSubjectUseCase = new DeleteSubjectUseCase(repository);

    const createUnitUseCase = new CreateUnitUseCase(repository);
    const suggestUnitsUseCase = new SuggestUnitsUseCase(repository, aiService);
    const getUnitsUseCase = new GetUnitsUseCase(repository);
    const getUnitByIdUseCase = new GetUnitByIdUseCase(repository);
    const deleteUnitUseCase = new DeleteUnitUseCase(repository);
    const quizRepository = LocalStorageQuizRepository.getInstance();
    const analyzePerformanceUseCase = new AnalyzePerformanceUseCase(aiService, quizRepository, repository);
    const generateSupportMaterialsUseCase = new GenerateSupportMaterialsUseCase(aiService, repository);
    const getQuizResultsByLessonPlanUseCase = new GetQuizResultsByLessonPlanUseCase(quizRepository);
    const addTeacherCommentUseCase = new AddTeacherCommentUseCase(quizRepository);

    const materialRepository = LocalStorageMaterialRepository.getInstance();
    const uploadMaterialUseCase = new UploadMaterialUseCase(materialRepository);
    const getMaterialsByUnitUseCase = new GetMaterialsByUnitUseCase(materialRepository);

    const generateLessonPlanForUnitUseCase = new GenerateLessonPlanForUnitUseCase(repository, aiService, materialRepository);

    // Injeta UseCases no Serviço
    serviceInstance = new LessonPlanService(
      generateLessonPlanUseCase,
      saveLessonPlanUseCase,
      getLessonPlansUseCase,
      getLessonPlanByIdUseCase,
      createSubjectUseCase,
      getSubjectsUseCase,
      getSubjectByIdUseCase,
      deleteSubjectUseCase,
      createUnitUseCase,
      suggestUnitsUseCase,
      getUnitsUseCase,
      getUnitByIdUseCase,
      generateLessonPlanForUnitUseCase,
      deleteUnitUseCase,
      analyzePerformanceUseCase,
      generateSupportMaterialsUseCase,
      getQuizResultsByLessonPlanUseCase,
      addTeacherCommentUseCase,
      uploadMaterialUseCase,
      getMaterialsByUnitUseCase
    );
  }
  return serviceInstance;
}
