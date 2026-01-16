// src/application/usecases/AssignStudentToClassUseCase.ts
import { IClassRepository } from '../../core/repositories/IClassRepository';
import { IUserRepository } from '../../core/repositories/IUserRepository';
import { Class } from '../../core/entities/Class';

/**
 * Caso de uso: Associar Aluno a Turma
 * 
 * Associa um aluno a uma turma específica.
 */
export class AssignStudentToClassUseCase {
  constructor(
    private classRepository: IClassRepository,
    private userRepository: IUserRepository
  ) {}

  /**
   * Associa um aluno a uma turma
   * 
   * @param classId - ID da turma
   * @param studentId - ID do aluno
   * @returns A turma atualizada
   * @throws Error se os dados forem inválidos
   */
  execute(classId: string, studentId: string): Class {
    // Validações
    if (!classId || !studentId) {
      throw new Error("ID da turma e do aluno são obrigatórios");
    }

    // Busca a turma
    const classEntity = this.classRepository.getById(classId);
    if (!classEntity) {
      throw new Error(`Turma com ID "${classId}" não encontrada`);
    }

    // Busca o aluno
    const student = this.userRepository.getUserById(studentId);
    if (!student) {
      throw new Error(`Aluno com ID "${studentId}" não encontrado`);
    }

    if (student.role !== 'aluno') {
      throw new Error(`Usuário com ID "${studentId}" não é um aluno`);
    }

    // Verifica se o aluno já está em outra turma
    if (student.classId && student.classId !== classId) {
      const currentClass = this.classRepository.getById(student.classId);
      if (currentClass) {
        throw new Error(
          `Aluno já está na turma "${currentClass.name}". ` +
          `Remova-o da turma atual antes de associá-lo a outra.`
        );
      }
    }

    // Verifica se o aluno já está nesta turma
    if (classEntity.students.includes(studentId)) {
      throw new Error(`Aluno já está associado a esta turma`);
    }

    // Remove o aluno da turma anterior (se houver)
    if (student.classId && student.classId !== classId) {
      const oldClass = this.classRepository.getById(student.classId);
      if (oldClass) {
        oldClass.students = oldClass.students.filter(id => id !== studentId);
        this.classRepository.save(oldClass);
      }
    }

    // Adiciona o aluno à turma
    classEntity.students.push(studentId);

    // Atualiza o aluno
    student.classId = classId;
    this.userRepository.saveUser(student);

    // Salva a turma atualizada
    this.classRepository.save(classEntity);

    return classEntity;
  }
}
