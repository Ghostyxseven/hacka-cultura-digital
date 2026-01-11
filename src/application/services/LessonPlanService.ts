// src/application/services/LessonPlanService.ts
import { LessonPlan, SchoolYear } from "../../core/entities/LessonPlan";
import { Subject } from "../../core/entities/Subject";
import { Unit } from "../../core/entities/Unit";
import { ILessonRepository } from "../../repository/ILessonRepository";
import { IAIService } from "../../infrastructure/ai/IAIService";
import { GenerateLessonPlanUseCase } from "../usecases/GenerateLessonPlanUseCase";
import { CreateSubjectUseCase } from "../usecases/CreateSubjectUseCase";
import { GetSubjectsUseCase } from "../usecases/GetSubjectsUseCase";
import { DeleteSubjectUseCase } from "../usecases/DeleteSubjectUseCase";
import { SaveLessonPlanUseCase } from "../usecases/SaveLessonPlanUseCase";
import { GetLessonPlansUseCase } from "../usecases/GetLessonPlansUseCase";
import { GetLessonPlanByIdUseCase } from "../usecases/GetLessonPlanByIdUseCase";
import { CreateUnitUseCase } from "../usecases/CreateUnitUseCase";
import { SuggestUnitsUseCase } from "../usecases/SuggestUnitsUseCase";
import { GetUnitsUseCase } from "../usecases/GetUnitsUseCase";
import { GenerateLessonPlanForUnitUseCase } from "../usecases/GenerateLessonPlanForUnitUseCase";

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
  private deleteSubjectUseCase: DeleteSubjectUseCase;

  // Casos de uso de Unidades
  private createUnitUseCase: CreateUnitUseCase;
  private suggestUnitsUseCase: SuggestUnitsUseCase;
  private getUnitsUseCase: GetUnitsUseCase;
  private generateLessonPlanForUnitUseCase: GenerateLessonPlanForUnitUseCase;

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
    this.deleteSubjectUseCase = new DeleteSubjectUseCase(repository);

    this.createUnitUseCase = new CreateUnitUseCase(repository);
    this.suggestUnitsUseCase = new SuggestUnitsUseCase(repository, aiService);
    this.getUnitsUseCase = new GetUnitsUseCase(repository);
    this.generateLessonPlanForUnitUseCase = new GenerateLessonPlanForUnitUseCase(repository, aiService);
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
  createSubject(
    name: string,
    description?: string,
    color?: string,
    icon?: string,
    gradeYears?: SchoolYear[]
  ): Subject {
    return this.createSubjectUseCase.execute(name, description, color, icon, gradeYears);
  }

  /**
   * Retorna todas as disciplinas cadastradas
   * RF01 - Gestão de Disciplinas
   */
  getSubjects(): Subject[] {
    return this.getSubjectsUseCase.execute();
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
   * Gera plano de aula e atividade para uma unidade específica
   * RF04/05 - Geração automática por unidade
   */
  async generateLessonPlanForUnit(unitId: string): Promise<LessonPlan> {
    return this.generateLessonPlanForUnitUseCase.execute(unitId);
  }
}
