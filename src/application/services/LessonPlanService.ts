// src/application/services/LessonPlanService.ts
import { LessonPlan, SchoolYear } from "../../core/entities/LessonPlan";
import { Subject } from "../../core/entities/Subject";
import { Unit } from "../../core/entities/Unit";
import { ILessonRepository } from "../../repository/ILessonRepository";
import { IAIService } from "../../infrastructure/ai/IAIService";
import { GenerateLessonPlanUseCase } from "../usecases/GenerateLessonPlanUseCase";
import { CreateSubjectUseCase } from "../usecases/CreateSubjectUseCase";
import { GetSubjectsUseCase } from "../usecases/GetSubjectsUseCase";
import { GetSubjectByIdUseCase } from "../usecases/GetSubjectByIdUseCase";
import { DeleteSubjectUseCase } from "../usecases/DeleteSubjectUseCase";
import { DeleteUnitUseCase } from "../usecases/DeleteUnitUseCase";
import { SaveLessonPlanUseCase } from "../usecases/SaveLessonPlanUseCase";
import { GetLessonPlansUseCase } from "../usecases/GetLessonPlansUseCase";
import { GetLessonPlanByIdUseCase } from "../usecases/GetLessonPlanByIdUseCase";
import { CreateUnitUseCase } from "../usecases/CreateUnitUseCase";
import { SuggestUnitsUseCase } from "../usecases/SuggestUnitsUseCase";
import { GetUnitsUseCase } from "../usecases/GetUnitsUseCase";
import { GetUnitByIdUseCase } from "../usecases/GetUnitByIdUseCase";
import { GenerateLessonPlanForUnitUseCase } from "../usecases/GenerateLessonPlanForUnitUseCase";
import { PresentationMapper } from "../mappers/PresentationMapper";
import type {
  SubjectViewModel,
  UnitViewModel,
  LessonPlanViewModel,
  SchoolYearViewModel,
} from "../viewmodels";

/**
 * Serviço principal de Planos de Aula
 * 
 * Orquestra todos os casos de uso relacionados a planos de aula e disciplinas.
 * Esta é a camada de aplicação que coordena as operações entre as camadas
 * de domínio, repositório e infraestrutura.
 */
export class LessonPlanService {
  // Casos de uso de Planos de Aula
  private generateLessonPlanUseCase: GenerateLessonPlanUseCase;
  private saveLessonPlanUseCase: SaveLessonPlanUseCase;
  private getLessonPlansUseCase: GetLessonPlansUseCase;
  private getLessonPlanByIdUseCase: GetLessonPlanByIdUseCase;

  // Casos de uso de Disciplinas
  private createSubjectUseCase: CreateSubjectUseCase;
  private getSubjectsUseCase: GetSubjectsUseCase;
  private getSubjectByIdUseCase: GetSubjectByIdUseCase;
  private deleteSubjectUseCase: DeleteSubjectUseCase;

  // Casos de uso de Unidades
  private createUnitUseCase: CreateUnitUseCase;
  private suggestUnitsUseCase: SuggestUnitsUseCase;
  private getUnitsUseCase: GetUnitsUseCase;
  private getUnitByIdUseCase: GetUnitByIdUseCase;
  private generateLessonPlanForUnitUseCase: GenerateLessonPlanForUnitUseCase;
  private deleteUnitUseCase: DeleteUnitUseCase;

  constructor(
    private repository: ILessonRepository,
    private aiService: IAIService
  ) {
    // Inicializa os casos de uso
    this.generateLessonPlanUseCase = new GenerateLessonPlanUseCase(aiService);
    this.saveLessonPlanUseCase = new SaveLessonPlanUseCase(repository);
    this.getLessonPlansUseCase = new GetLessonPlansUseCase(repository);
    this.getLessonPlanByIdUseCase = new GetLessonPlanByIdUseCase(repository);

    this.createSubjectUseCase = new CreateSubjectUseCase(repository);
    this.getSubjectsUseCase = new GetSubjectsUseCase(repository);
    this.getSubjectByIdUseCase = new GetSubjectByIdUseCase(repository);
    this.deleteSubjectUseCase = new DeleteSubjectUseCase(repository);

    this.createUnitUseCase = new CreateUnitUseCase(repository);
    this.suggestUnitsUseCase = new SuggestUnitsUseCase(repository, aiService);
    this.getUnitsUseCase = new GetUnitsUseCase(repository);
    this.getUnitByIdUseCase = new GetUnitByIdUseCase(repository);
    this.generateLessonPlanForUnitUseCase = new GenerateLessonPlanForUnitUseCase(repository, aiService);
    this.deleteUnitUseCase = new DeleteUnitUseCase(repository);
  }

  // ========== MÉTODOS DE PLANOS DE AULA ==========

  /**
   * Gera um novo plano de aula usando IA
   * RF04/05 - Geração automática de Planos de Aula
   */
  async generateLessonPlan(
    subject: string,
    topic: string,
    grade: SchoolYear
  ): Promise<LessonPlan> {
    const lessonPlan = await this.generateLessonPlanUseCase.execute(
      subject,
      topic,
      grade
    );

    // Salva automaticamente após gerar
    this.saveLessonPlanUseCase.execute(lessonPlan);

    return lessonPlan;
  }

  /**
   * Salva ou atualiza um plano de aula
   */
  saveLessonPlan(lessonPlan: LessonPlan): LessonPlan {
    return this.saveLessonPlanUseCase.execute(lessonPlan);
  }

  /**
   * Retorna todos os planos de aula, opcionalmente filtrados
   */
  getLessonPlans(filters?: {
    subjectId?: string;
    subjectName?: string;
    gradeYear?: string;
  }): LessonPlan[] {
    return this.getLessonPlansUseCase.execute(filters);
  }

  /**
   * Busca um plano de aula pelo ID
   */
  getLessonPlanById(id: string): LessonPlan | undefined {
    return this.getLessonPlanByIdUseCase.execute(id);
  }

  // ========== MÉTODOS DE DISCIPLINAS ==========

  /**
   * Cria uma nova disciplina
   * RF01 - Gestão de Disciplinas
   */
  async createSubject(
    name: string,
    description?: string,
    color?: string,
    icon?: string,
    gradeYears?: SchoolYear[]
  ): Promise<Subject> {
    return await this.createSubjectUseCase.execute(name, description, color, icon, gradeYears);
  }

  /**
   * Retorna todas as disciplinas cadastradas
   * RF01 - Gestão de Disciplinas
   */
  getSubjects(): Subject[] {
    return this.getSubjectsUseCase.execute();
  }

  /**
   * Retorna todas as disciplinas como ViewModels (para a camada de apresentação)
   */
  getSubjectsViewModels(): SubjectViewModel[] {
    const subjects = this.getSubjectsUseCase.execute();
    return PresentationMapper.toSubjectViewModels(subjects);
  }

  /**
   * Busca uma disciplina pelo ID
   */
  getSubjectById(id: string): Subject | undefined {
    return this.getSubjectByIdUseCase.execute(id);
  }

  /**
   * Busca uma disciplina pelo ID como ViewModel (para a camada de apresentação)
   */
  getSubjectByIdViewModel(id: string): SubjectViewModel | undefined {
    const subject = this.getSubjectByIdUseCase.execute(id);
    return subject ? PresentationMapper.toSubjectViewModel(subject) : undefined;
  }

  /**
   * Remove uma disciplina pelo ID
   * RF01 - Gestão de Disciplinas
   */
  deleteSubject(id: string): void {
    this.deleteSubjectUseCase.execute(id);
  }

  // ========== MÉTODOS DE UNIDADES ==========

  /**
   * Cria uma unidade de ensino manualmente
   * RF02 - Criação manual de unidades
   */
  createUnit(
    subjectId: string,
    gradeYear: SchoolYear,
    topic: string,
    description?: string
  ): Unit {
    return this.createUnitUseCase.execute(subjectId, gradeYear, topic, description);
  }

  /**
   * Sugere unidades de ensino automaticamente via IA
   * RF03 - Sugestão automática de unidades via IA
   */
  async suggestUnits(
    subjectId: string,
    gradeYear: SchoolYear,
    quantity?: number
  ): Promise<Unit[]> {
    return this.suggestUnitsUseCase.execute(subjectId, gradeYear, quantity);
  }

  /**
   * Retorna unidades de ensino, opcionalmente filtradas por disciplina
   */
  getUnits(subjectId?: string): Unit[] {
    return this.getUnitsUseCase.execute(subjectId);
  }

  /**
   * Retorna unidades de ensino como ViewModels (para a camada de apresentação)
   */
  getUnitsViewModels(subjectId?: string): UnitViewModel[] {
    const units = this.getUnitsUseCase.execute(subjectId);
    return PresentationMapper.toUnitViewModels(units);
  }

  /**
   * Busca uma unidade pelo ID
   */
  getUnitById(id: string): Unit | undefined {
    return this.getUnitByIdUseCase.execute(id);
  }

  /**
   * Busca uma unidade pelo ID como ViewModel (para a camada de apresentação)
   */
  getUnitByIdViewModel(id: string): UnitViewModel | undefined {
    const unit = this.getUnitByIdUseCase.execute(id);
    return unit ? PresentationMapper.toUnitViewModel(unit) : undefined;
  }

  /**
   * Remove uma unidade pelo ID
   * RF02 - Criação manual de unidades
   */
  deleteUnit(id: string): void {
    this.deleteUnitUseCase.execute(id);
  }

  /**
   * Gera plano de aula e atividade para uma unidade específica
   * RF04/05 - Geração automática por unidade
   */
  async generateLessonPlanForUnit(unitId: string): Promise<LessonPlan> {
    return this.generateLessonPlanForUnitUseCase.execute(unitId);
  }

  /**
   * Gera plano de aula e atividade para uma unidade específica como ViewModel
   * RF04/05 - Geração automática por unidade (para a camada de apresentação)
   */
  async generateLessonPlanForUnitViewModel(unitId: string): Promise<LessonPlanViewModel> {
    const lessonPlan = await this.generateLessonPlanForUnitUseCase.execute(unitId);
    return PresentationMapper.toLessonPlanViewModel(lessonPlan);
  }

  /**
   * Busca um plano de aula pelo ID como ViewModel (para a camada de apresentação)
   */
  getLessonPlanByIdViewModel(id: string): LessonPlanViewModel | undefined {
    const lessonPlan = this.getLessonPlanByIdUseCase.execute(id);
    return lessonPlan ? PresentationMapper.toLessonPlanViewModel(lessonPlan) : undefined;
  }

  /**
   * Retorna planos de aula como ViewModels (para a camada de apresentação)
   */
  getLessonPlansViewModels(filters?: {
    subjectId?: string;
    subjectName?: string;
    gradeYear?: string;
  }): LessonPlanViewModel[] {
    const lessonPlans = this.getLessonPlansUseCase.execute(filters);
    return PresentationMapper.toLessonPlanViewModels(lessonPlans);
  }

  /**
   * Cria uma disciplina e retorna como ViewModel (para a camada de apresentação)
   */
  async createSubjectViewModel(
    name: string,
    description?: string,
    color?: string,
    icon?: string,
    gradeYears?: SchoolYear[]
  ): Promise<SubjectViewModel> {
    const subject = await this.createSubjectUseCase.execute(name, description, color, icon, gradeYears);
    return PresentationMapper.toSubjectViewModel(subject);
  }

  /**
   * Cria uma unidade e retorna como ViewModel (para a camada de apresentação)
   */
  createUnitViewModel(
    subjectId: string,
    gradeYear: SchoolYear,
    topic: string,
    description?: string
  ): UnitViewModel {
    const unit = this.createUnitUseCase.execute(subjectId, gradeYear, topic, description);
    return PresentationMapper.toUnitViewModel(unit);
  }

  /**
   * Sugere unidades e retorna como ViewModels (para a camada de apresentação)
   */
  async suggestUnitsViewModels(
    subjectId: string,
    gradeYear: SchoolYear,
    quantity?: number
  ): Promise<UnitViewModel[]> {
    const units = await this.suggestUnitsUseCase.execute(subjectId, gradeYear, quantity);
    return PresentationMapper.toUnitViewModels(units);
  }
}
