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
  constructor(private userRepository: IUserRepository) {}

  /**
   * Cria um novo usuário
   * 
   * @param name - Nome do usuário
   * @param email - Email do usuário (único)
   * @param password - Senha do usuário (em produção seria hash)
   * @param role - Role do usuário (admin, professor, aluno)
   * @param professorId - ID do professor (apenas para alunos)
   * @returns O usuário criado
   * @throws Error se os dados forem inválidos ou o email já existir
   */
  execute(
    name: string,
    email: string,
    password: string,
    role: UserRole,
    professorId?: string
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

    // Valida professorId para alunos
    if (role === 'aluno' && !professorId) {
      throw new Error("Aluno deve estar associado a um professor");
    }

    // Cria o usuário
    const user: User = {
      id: `user-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password: password, // Em produção seria hash
      role,
      professorId: role === 'aluno' ? professorId : undefined,
      subjects: role === 'professor' ? [] : undefined,
      createdAt: new Date(),
    };

    // Salva no repositório
    this.userRepository.saveUser(user);

    return user;
  }
}
