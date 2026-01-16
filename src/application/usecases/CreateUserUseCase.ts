// src/application/usecases/CreateUserUseCase.ts
import { User, UserRole } from "../../core/entities/User";
import { IUserRepository } from "../../core/repositories/IUserRepository";

/**
 * Caso de uso: Criação de Usuário
 * 
 * Cria um novo usuário no sistema.
 * - Alunos podem se cadastrar
 * - Admin cadastra professores
 */
export class CreateUserUseCase {
  constructor(private userRepository: IUserRepository) { }

  /**
   * Cria um novo usuário
   * 
   * @param name - Nome do usuário
   * @param email - Email do usuário (único)
   * @param password - Senha do usuário (em produção seria hash)
   * @param role - Role do usuário (admin, professor, aluno)
   * @param professorId - ID do professor (apenas para alunos - DEPRECADO, usar classId)
   * @param classId - ID da turma (apenas para alunos)
   * @param classes - IDs das turmas (apenas para professores)
   * @param subjects - IDs das disciplinas (apenas para professores)
   * @returns O usuário criado
   * @throws Error se os dados forem inválidos ou o email já existir
   */
  execute(
    name: string,
    email: string,
    password: string,
    role: UserRole,
    professorId?: string,
    classId?: string,
    classes?: string[],
    subjects?: string[]
  ): User {
    // Validações
    if (!name || name.trim().length === 0) {
      throw new Error("Nome é obrigatório");
    }

    if (!email || email.trim().length === 0) {
      throw new Error("Email é obrigatório");
    }

    // Validação básica de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error("Email inválido");
    }

    if (!password || password.length < 4) {
      throw new Error("Senha deve ter pelo menos 4 caracteres");
    }

    // Verifica se o email já existe
    if (this.userRepository.userExists(email)) {
      throw new Error("Email já cadastrado");
    }

    // Validações específicas por role
    if (role === 'aluno') {
      // Aluno pode ter classId (novo sistema) ou professorId (sistema antigo)
      // Se ambos forem fornecidos, classId tem prioridade
      // if (!classId && !professorId) {
      //   throw new Error("Aluno deve estar associado a uma turma (classId) ou professor (professorId)");
      // }
    }

    if (role === 'professor' && classes && classes.length > 0) {
      // Valida se as turmas existem (opcional, pode ser feito depois)
      // Por enquanto, apenas aceita
    }

    // Cria o usuário
    const user: User = {
      id: `user-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password: password, // Em produção seria hash
      role,
      // Sistema antigo (compatibilidade)
      professorId: role === 'aluno' && !classId ? professorId : undefined,
      // Sistema novo (turmas)
      classId: role === 'aluno' ? classId : undefined,
      classes: role === 'professor' ? (classes || []) : undefined,
      subjects: role === 'professor' ? (subjects || []) : undefined,
      createdAt: new Date(),
    };

    // Salva no repositório
    this.userRepository.saveUser(user);

    return user;
  }
}
