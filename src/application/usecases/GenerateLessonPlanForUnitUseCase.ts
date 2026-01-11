// src/application/usecases/GenerateLessonPlanForUnitUseCase.ts
import { LessonPlan } from "../../core/entities/LessonPlan";
import { Unit } from "../../core/entities/Unit";
import { ILessonRepository } from "../../repository/ILessonRepository";
import { IAIService } from "../../infrastructure/ai/IAIService";
import { GenerateLessonPlanUseCase } from "./GenerateLessonPlanUseCase";

/**
 * Caso de uso: Geração de Plano de Aula para uma Unidade específica
 * RF04/05 - Geração automática de Planos de Aula e Atividades por unidade
 * 
 * Gera um plano de aula e atividade para uma unidade específica,
 * vinculando-os corretamente.
 */
export class GenerateLessonPlanForUnitUseCase {
  private generateLessonPlanUseCase: GenerateLessonPlanUseCase;

  constructor(
    private repository: ILessonRepository,
    private aiService: IAIService
  ) {
    this.generateLessonPlanUseCase = new GenerateLessonPlanUseCase(aiService);
  }

  /**
   * Gera plano de aula e atividade para uma unidade específica
   * 
   * @param unitId - ID da unidade
   * @returns O plano de aula gerado e vinculado à unidade
   * @throws Error se a unidade não existir ou a geração falhar
   */
  async execute(unitId: string): Promise<LessonPlan> {
    // Busca a unidade
    const unit = this.repository.getUnitById(unitId);
    if (!unit) {
      throw new Error(`Unidade com ID "${unitId}" não encontrada`);
    }

    // Busca a disciplina para obter o nome
    const subject = this.repository.getAllSubjects().find(s => s.id === unit.subjectId);
    if (!subject) {
      throw new Error(`Disciplina da unidade não encontrada`);
    }

    // Gera o plano de aula usando o tema da unidade
    const lessonPlan = await this.generateLessonPlanUseCase.execute(
      subject.name,
      unit.topic,
      unit.gradeYear
    );

    // Vincula o plano à unidade
    lessonPlan.unitId = unitId;

    // Salva o plano de aula
    this.repository.saveLessonPlan(lessonPlan);

    // Atualiza a unidade com a referência ao plano gerado
    const updatedUnit: Unit = {
      ...unit,
      lessonPlanId: lessonPlan.id,
      updatedAt: new Date()
    };
    this.repository.saveUnit(updatedUnit);

    return lessonPlan;
  }
}
