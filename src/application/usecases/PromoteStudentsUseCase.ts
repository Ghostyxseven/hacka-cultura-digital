// src/application/usecases/PromoteStudentsUseCase.ts
import { AssignStudentToClassUseCase } from "./AssignStudentToClassUseCase";
import { User } from "../../core/entities/User";

/**
 * Caso de uso: Promover Alunos (Lote)
 * 
 * Move uma lista de alunos para uma nova turma.
 */
export class PromoteStudentsUseCase {
    constructor(
        private assignStudentToClassUseCase: AssignStudentToClassUseCase
    ) { }

    /**
     * Executa a promoção/transferência em lote
     * 
     * @param studentIds - Lista de IDs dos alunos
     * @param targetClassId - ID da turma de destino
     * @returns Número de alunos promovidos com sucesso
     */
    async execute(studentIds: string[], targetClassId: string): Promise<number> {
        let successCount = 0;

        for (const studentId of studentIds) {
            try {
                this.assignStudentToClassUseCase.execute(targetClassId, studentId);
                successCount++;
            } catch (error) {
                console.error(`Erro ao promover aluno ${studentId}:`, error);
                // Continua para os próximos alunos mesmo se um falhar
            }
        }

        return successCount;
    }
}
