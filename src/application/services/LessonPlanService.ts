// src/application/services/LessonPlanService.ts
import { LessonPlan, SchoolYear } from "../../core/entities/LessonPlan";
import { Subject } from "../../core/entities/Subject";
import { Unit } from "../../core/entities/Unit";

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
import { AnalyzePerformanceUseCase } from "../usecases/AnalyzePerformanceUseCase";
import { GenerateSupportMaterialsUseCase } from "../usecases/GenerateSupportMaterialsUseCase";
import { GetQuizResultsByLessonPlanUseCase } from "../usecases/GetQuizResultsByLessonPlanUseCase";
import { AddTeacherCommentUseCase } from "../usecases/AddTeacherCommentUseCase";
import { UploadMaterialUseCase } from "../usecases/UploadMaterialUseCase";
import { GetMaterialsByUnitUseCase } from "../usecases/GetMaterialsByUnitUseCase";
import { QuizResult } from "../../core/entities/QuizResult";
import { Material } from "../../core/entities/Material";


/**
 * Serviço principal de Planos de Aula
 * 
 * Orquestra todos os casos de uso relacionados a planos de aula e disciplinas.
 * Esta é a camada de aplicação que coordena as operações entre as camadas
 * de domínio, repositório e infraestrutura.
 */
export class LessonPlanService {
  // Casos de uso de Planos de Aula
  constructor(
    // Casos de uso de Planos de Aula
    private generateLessonPlanUseCase: GenerateLessonPlanUseCase,
    private saveLessonPlanUseCase: SaveLessonPlanUseCase,
    private getLessonPlansUseCase: GetLessonPlansUseCase,
    private getLessonPlanByIdUseCase: GetLessonPlanByIdUseCase,

    // Casos de uso de Disciplinas
    private createSubjectUseCase: CreateSubjectUseCase,
    private getSubjectsUseCase: GetSubjectsUseCase,
    private getSubjectByIdUseCase: GetSubjectByIdUseCase,
    private deleteSubjectUseCase: DeleteSubjectUseCase,

    // Casos de uso de Unidades
    private createUnitUseCase: CreateUnitUseCase,
    private suggestUnitsUseCase: SuggestUnitsUseCase,
    private getUnitsUseCase: GetUnitsUseCase,
    private getUnitByIdUseCase: GetUnitByIdUseCase,
    private generateLessonPlanForUnitUseCase: GenerateLessonPlanForUnitUseCase,
    private deleteUnitUseCase: DeleteUnitUseCase,
    private analyzePerformanceUseCase: AnalyzePerformanceUseCase,
    private generateSupportMaterialsUseCase: GenerateSupportMaterialsUseCase,
    private getQuizResultsByLessonPlanUseCase: GetQuizResultsByLessonPlanUseCase,
    private addTeacherCommentUseCase: AddTeacherCommentUseCase,
    private uploadMaterialUseCase: UploadMaterialUseCase,
    private getMaterialsByUnitUseCase: GetMaterialsByUnitUseCase
  ) { }

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
   * Busca uma disciplina pelo ID
   */
  getSubjectById(id: string): Subject | undefined {
    return this.getSubjectByIdUseCase.execute(id);
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
   * Busca uma unidade pelo ID
   */
  getUnitById(id: string): Unit | undefined {
    return this.getUnitByIdUseCase.execute(id);
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
   * Analisa o desempenho de um aluno e gera feedback de IA
   * RF06 - Inteligência Pedagógica (Feedback IA)
   */
  async analyzePerformance(quizResultId: string): Promise<QuizResult> {
    return this.analyzePerformanceUseCase.execute({ quizResultId });
  }

  /**
   * Gera materiais de apoio extras (slides, links, vídeos) via IA
   * Fase 4 - Materiais Estendidos
   */
  async generateSupportMaterials(lessonPlanId: string): Promise<LessonPlan> {
    return this.generateSupportMaterialsUseCase.execute({ lessonPlanId });
  }

  /**
   * Busca resultados de quiz de um plano de aula
   */
  getQuizResults(lessonPlanId: string): QuizResult[] {
    return this.getQuizResultsByLessonPlanUseCase.execute({ lessonPlanId });
  }

  /**
   * Adiciona comentário do professor a um resultado
   */
  addTeacherComment(quizResultId: string, comment: string): QuizResult {
    return this.addTeacherCommentUseCase.execute({ quizResultId, comment });
  }

  // ========== MÉTODOS DE MATERIAIS RAG ==========

  uploadMaterial(data: { unitId: string; fileName: string; fileType: string; content: string }): Material {
    return this.uploadMaterialUseCase.execute(data);
  }

  getMaterialsByUnit(unitId: string): Material[] {
    return this.getMaterialsByUnitUseCase.execute(unitId);
  }
}
