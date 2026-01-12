// src/application/usecases/LoginUseCase.ts
import { User } from "../../core/entities/User";
import { IUserRepository } from "../../repository/IUserRepository";

/**
 * Caso de uso: Login de Usuário
 * 
 * Autentica um usuário no sistema usando email e senha simples.
 */
export class LoginUseCase {
  constructor(private userRepository: IUserRepository) {}

  /**
   * Realiza login de um usuário
   * 
   * @param email - Email do usuário
   * @param password - Senha do usuário
   * @returns O usuário autenticado
   * @throws Error se as credenciais forem inválidas
   */
  execute(email: string, password: string): User {
    if (!email || !password) {
      throw new Error("Email e senha são obrigatórios");
    }

    const user = this.userRepository.getUserByEmail(email.trim().toLowerCase());

    if (!user) {
      throw new Error("Email ou senha inválidos");
    }

    // Comparação simples de senha (em produção seria hash)
    if (user.password !== password) {
      throw new Error("Email ou senha inválidos");
    }

    // Remove a senha antes de retornar (segurança)
    const { password: _, ...userWithoutPassword } = user;
    
    // Retorna o usuário (senha removida)
    return userWithoutPassword as User & { password?: string };
  }
}
