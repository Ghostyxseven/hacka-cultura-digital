// src/application/usecases/UpdateUserUseCase.ts
import { User, UserRole } from "../../core/entities/User";
import { IUserRepository } from "../../repository/IUserRepository";

/**
 * Caso de uso: Atualização de Usuário
 * 
 * Atualiza os dados de um usuário existente.
 */
export class UpdateUserUseCase {
  constructor(private userRepository: IUserRepository) {}

  /**
   * Atualiza um usuário existente
   * 
   * @param id - ID do usuário
   * @param name - Novo nome (opcional)
   * @param email - Novo email (opcional)
   * @param password - Nova senha (opcional)
   * @param professorId - Novo professorId (opcional, para alunos)
   * @returns O usuário atualizado
   * @throws Error se o usuário não existir ou os dados forem inválidos
   */
  execute(
    id: string,
    updates: {
      name?: string;
      email?: string;
      password?: string;
      professorId?: string;
    }
  ): User {
    // Busca o usuário
    const user = this.userRepository.getUserById(id);
    if (!user) {
      throw new Error(`Usuário com ID "${id}" não encontrado`);
    }

    // Valida nome se fornecido
    if (updates.name !== undefined) {
      if (!updates.name || updates.name.trim().length === 0) {
        throw new Error("Nome não pode ser vazio");
      }
    }

    // Valida email se fornecido
    if (updates.email !== undefined) {
      if (!updates.email || updates.email.trim().length === 0) {
        throw new Error("Email não pode ser vazio");
      }

      // Validação básica de email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(updates.email)) {
        throw new Error("Email inválido");
      }

      // Verifica se o email já está em uso por outro usuário
      const existingUser = this.userRepository.getUserByEmail(updates.email);
      if (existingUser && existingUser.id !== id) {
        throw new Error("Email já está em uso por outro usuário");
      }
    }

    // Valida senha se fornecida
    if (updates.password !== undefined) {
      if (!updates.password || updates.password.length < 4) {
        throw new Error("Senha deve ter pelo menos 4 caracteres");
      }
    }

    // Valida professorId para alunos
    if (updates.professorId !== undefined && user.role === 'aluno') {
      const professor = this.userRepository.getUserById(updates.professorId);
      if (!professor || professor.role !== 'professor') {
        throw new Error("Professor não encontrado");
      }
    }

    // Cria o usuário atualizado
    const updatedUser: User = {
      ...user,
      name: updates.name !== undefined ? updates.name.trim() : user.name,
      email: updates.email !== undefined ? updates.email.trim().toLowerCase() : user.email,
      password: updates.password !== undefined ? updates.password : user.password,
      professorId: updates.professorId !== undefined ? updates.professorId : user.professorId,
      updatedAt: new Date(),
    };

    // Salva no repositório
    this.userRepository.saveUser(updatedUser);

    return updatedUser;
  }
}
