import {
  LocalStorageSubjectRepository,
  LocalStorageUnitRepository,
  LocalStorageLessonPlanRepository,
  LocalStorageActivityRepository,
} from '@/repository/implementations';
import {
  AIService,
  BNCCService,
  LessonPlanGenerator,
  ActivityGenerator,
  UnitSuggestionService,
  SlideGenerator,
} from '@/infrastructure';
import {
  CreateSubjectUseCase,
  GetAllSubjectsUseCase,
  GetSubjectByIdUseCase,
  DeleteSubjectUseCase,
  CreateUnitUseCase,
  GetUnitsBySubjectUseCase,
  SuggestUnitsUseCase,
  GenerateLessonPlanUseCase,
  GenerateActivityUseCase,
  GetLessonPlanByUnitUseCase,
  GetActivityByUnitUseCase,
  GenerateSlidesUseCase,
} from '../usecases';
import { SubjectService, UnitService, MaterialGenerationService, ArchiveService } from '../services';

/**
 * Factory para criar instâncias dos serviços de aplicação
 * Implementa Injeção de Dependências manualmente
 */
export class ApplicationServiceFactory {
  // Repositórios (singletons)
  private static subjectRepository: LocalStorageSubjectRepository;
  private static unitRepository: LocalStorageUnitRepository;
  private static lessonPlanRepository: LocalStorageLessonPlanRepository;
  private static activityRepository: LocalStorageActivityRepository;

  // Serviços de infraestrutura (singletons)
  private static aiService: AIService;
  private static bnccService: BNCCService;
  private static lessonPlanGenerator: LessonPlanGenerator;
  private static activityGenerator: ActivityGenerator;
  private static unitSuggestionService: UnitSuggestionService;
  private static slideGenerator: SlideGenerator;

  // Serviços de aplicação (singletons)
  private static subjectService: SubjectService;
  private static unitService: UnitService;
  private static materialGenerationService: MaterialGenerationService;
  private static archiveService: ArchiveService;

  // Inicializa repositórios
  private static initRepositories() {
    if (!this.subjectRepository) {
      this.subjectRepository = new LocalStorageSubjectRepository();
    }
    if (!this.unitRepository) {
      this.unitRepository = new LocalStorageUnitRepository();
    }
    if (!this.lessonPlanRepository) {
      this.lessonPlanRepository = new LocalStorageLessonPlanRepository();
    }
    if (!this.activityRepository) {
      this.activityRepository = new LocalStorageActivityRepository();
    }
  }

  // Inicializa serviços de infraestrutura
  private static initInfrastructure() {
    if (!this.aiService) {
      // Tenta carregar a configuração do usuário (só funciona no cliente)
      let preferredProvider: 'google' | 'openai' | 'auto' | undefined = undefined;
      if (typeof window !== 'undefined') {
        try {
          const { AIConfigService } = require('@/infrastructure/services/AIConfigService');
          const configService = new AIConfigService();
          const config = configService.getConfig();
          preferredProvider = config.provider as 'google' | 'openai' | 'auto';
        } catch (error) {
          // Se não conseguir carregar, usa padrão (auto-detect)
          console.warn('Não foi possível carregar configuração de IA:', error);
        }
      }
      this.aiService = new AIService(undefined, preferredProvider);
    }
    if (!this.bnccService) {
      this.bnccService = new BNCCService();
    }
    if (!this.lessonPlanGenerator) {
      this.lessonPlanGenerator = new LessonPlanGenerator(this.aiService, this.bnccService);
    }
    if (!this.activityGenerator) {
      this.activityGenerator = new ActivityGenerator(this.aiService, this.bnccService);
    }
    if (!this.unitSuggestionService) {
      this.unitSuggestionService = new UnitSuggestionService(this.aiService, this.bnccService);
    }
    if (!this.slideGenerator) {
      this.slideGenerator = new SlideGenerator(this.aiService, this.bnccService);
    }
  }

  /**
   * Cria e retorna instância do ArchiveService
   */
  private static createArchiveService(): ArchiveService {
    if (this.archiveService) {
      return this.archiveService;
    }

    this.initRepositories();

    this.archiveService = new ArchiveService(
      this.subjectRepository,
      this.unitRepository,
      this.lessonPlanRepository,
      this.activityRepository
    );

    return this.archiveService;
  }

  /**
   * Cria e retorna instância do SubjectService
   */
  static createSubjectService(): SubjectService {
    if (this.subjectService) {
      return this.subjectService;
    }

    this.initRepositories();
    const archiveService = this.createArchiveService();

    const createSubjectUseCase = new CreateSubjectUseCase(this.subjectRepository);
    const getAllSubjectsUseCase = new GetAllSubjectsUseCase(this.subjectRepository);
    const getSubjectByIdUseCase = new GetSubjectByIdUseCase(this.subjectRepository);
    const deleteSubjectUseCase = new DeleteSubjectUseCase(
      this.subjectRepository,
      this.unitRepository
    );

    this.subjectService = new SubjectService(
      createSubjectUseCase,
      getAllSubjectsUseCase,
      getSubjectByIdUseCase,
      deleteSubjectUseCase,
      this.subjectRepository,
      archiveService
    );

    return this.subjectService;
  }

  /**
   * Cria e retorna instância do UnitService
   */
  static createUnitService(): UnitService {
    if (this.unitService) {
      return this.unitService;
    }

    this.initRepositories();
    this.initInfrastructure();
    const archiveService = this.createArchiveService();

    const createUnitUseCase = new CreateUnitUseCase(this.unitRepository, this.subjectRepository);
    const getUnitsBySubjectUseCase = new GetUnitsBySubjectUseCase(
      this.unitRepository,
      this.subjectRepository
    );
    const suggestUnitsUseCase = new SuggestUnitsUseCase(
      this.subjectRepository,
      this.unitSuggestionService
    );

    this.unitService = new UnitService(
      createUnitUseCase,
      getUnitsBySubjectUseCase,
      suggestUnitsUseCase,
      this.unitRepository,
      archiveService
    );

    return this.unitService;
  }

  /**
   * Cria e retorna instância do MaterialGenerationService
   */
  static createMaterialGenerationService(): MaterialGenerationService {
    if (this.materialGenerationService) {
      return this.materialGenerationService;
    }

    this.initRepositories();
    this.initInfrastructure();

    const generateLessonPlanUseCase = new GenerateLessonPlanUseCase(
      this.lessonPlanRepository,
      this.unitRepository,
      this.subjectRepository,
      this.lessonPlanGenerator
    );

    const generateActivityUseCase = new GenerateActivityUseCase(
      this.activityRepository,
      this.unitRepository,
      this.subjectRepository,
      this.activityGenerator
    );

    const getLessonPlanByUnitUseCase = new GetLessonPlanByUnitUseCase(
      this.lessonPlanRepository,
      this.unitRepository
    );

    const getActivityByUnitUseCase = new GetActivityByUnitUseCase(
      this.activityRepository,
      this.unitRepository
    );

    const generateSlidesUseCase = new GenerateSlidesUseCase(
      this.slideGenerator,
      this.unitRepository,
      this.subjectRepository,
      this.lessonPlanRepository
    );

    this.materialGenerationService = new MaterialGenerationService(
      generateLessonPlanUseCase,
      generateActivityUseCase,
      getLessonPlanByUnitUseCase,
      getActivityByUnitUseCase,
      generateSlidesUseCase,
      this.lessonPlanRepository,
      this.activityRepository
    );

    return this.materialGenerationService;
  }
}
