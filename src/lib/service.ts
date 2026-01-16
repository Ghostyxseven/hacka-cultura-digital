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
import { RefineLessonPlanUseCase } from '../application/usecases/RefineLessonPlanUseCase';
import { GetClassTrendsUseCase } from '../application/usecases/GetClassTrendsUseCase';
import { GetStudentAverageScoreUseCase } from '../application/usecases/GetStudentAverageScoreUseCase';
import { AskTeacherCopilotUseCase } from '../application/usecases/AskTeacherCopilotUseCase';
import { LocalStorageQuizRepository } from '../repository/implementations/LocalStorageQuizRepository';
import { LocalStorageMaterialRepository } from '../repository/implementations/LocalStorageMaterialRepository';
import { ClassService } from '../application/services/ClassService';
import { LocalStorageClassRepository } from '../repository/implementations/LocalStorageClassRepository';
import { LocalStorageUserRepository } from '../repository/implementations/LocalStorageUserRepository';
import { CreateClassUseCase } from '../application/usecases/CreateClassUseCase';
import { GetClassesUseCase } from '../application/usecases/GetClassesUseCase';
import { GetClassByIdUseCase } from '../application/usecases/GetClassByIdUseCase';
import { AssignTeacherToClassUseCase } from '../application/usecases/AssignTeacherToClassUseCase';
import { AssignStudentToClassUseCase } from '../application/usecases/AssignStudentToClassUseCase';
import { RemoveTeacherFromClassUseCase } from '../application/usecases/RemoveTeacherFromClassUseCase';
import { RemoveStudentFromClassUseCase } from '../application/usecases/RemoveStudentFromClassUseCase';
import { DeleteClassUseCase } from '../application/usecases/DeleteClassUseCase';
import { GetClassTeachersUseCase } from '../application/usecases/GetClassTeachersUseCase';
import { GetClassStudentsUseCase } from '../application/usecases/GetClassStudentsUseCase';
import { GetTeacherClassesUseCase } from '../application/usecases/GetTeacherClassesUseCase';

let serviceInstance: LessonPlanService | null = null;
let classServiceInstance: ClassService | null = null;

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
    const refineLessonPlanUseCase = new RefineLessonPlanUseCase(aiService, repository);
    const getClassTrendsUseCase = new GetClassTrendsUseCase(aiService, quizRepository);
    const getStudentAverageScoreUseCase = new GetStudentAverageScoreUseCase(quizRepository);
    const askTeacherCopilotUseCase = new AskTeacherCopilotUseCase(aiService);

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
      getMaterialsByUnitUseCase,
      refineLessonPlanUseCase,
      getClassTrendsUseCase,
      getStudentAverageScoreUseCase,
      askTeacherCopilotUseCase
    );
  }
  return serviceInstance;
}

export function getClassService(): ClassService {
  if (!classServiceInstance) {
    const classRepository = LocalStorageClassRepository.getInstance();
    const userRepository = LocalStorageUserRepository.getInstance();

    classServiceInstance = new ClassService(
      new CreateClassUseCase(classRepository),
      new GetClassesUseCase(classRepository),
      new GetClassByIdUseCase(classRepository),
      new AssignTeacherToClassUseCase(classRepository, userRepository),
      new AssignStudentToClassUseCase(classRepository, userRepository),
      new RemoveTeacherFromClassUseCase(classRepository, userRepository),
      new RemoveStudentFromClassUseCase(classRepository, userRepository),
      new DeleteClassUseCase(classRepository, userRepository),
      new GetClassTeachersUseCase(classRepository, userRepository),
      new GetClassStudentsUseCase(classRepository, userRepository),
      new GetTeacherClassesUseCase(classRepository, userRepository)
    );
  }
  return classServiceInstance;
}
