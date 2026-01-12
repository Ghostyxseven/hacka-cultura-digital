// src/application/services/AuthService.ts
import { User, UserRole } from "../../core/entities/User";
import { IUserRepository } from "../../repository/IUserRepository";
import { CreateUserUseCase } from "../usecases/CreateUserUseCase";
import { LoginUseCase } from "../usecases/LoginUseCase";
import { UpdateUserUseCase } from "../usecases/UpdateUserUseCase";

/**
 * Serviço de autenticação e gerenciamento de usuários
 * Orquestra os casos de uso relacionados a autenticação
 * Clean Architecture - Application layer
 */
export class AuthService {
  private createUserUseCase: CreateUserUseCase;
  private loginUseCase: LoginUseCase;
  private updateUserUseCase: UpdateUserUseCase;

  constructor(private userRepository: IUserRepository) {
    this.createUserUseCase = new CreateUserUseCase(userRepository);
    this.loginUseCase = new LoginUseCase(userRepository);
    this.updateUserUseCase = new UpdateUserUseCase(userRepository);
  }

  /**
   * Registra um novo aluno (auto-cadastro)
   */
  registerAluno(
    name: string,
    email: string,
    password: string,
    professorId: string
  ): User {
    return this.createUserUseCase.execute(name, email, password, 'aluno', professorId);
  }

  /**
   * Cadastra um novo professor (apenas admin)
   */
  registerProfessor(
    name: string,
    email: string,
    password: string
  ): User {
    return this.createUserUseCase.execute(name, email, password, 'professor');
  }

  /**
   * Realiza login de um usuário
   */
  login(email: string, password: string): Omit<User, 'password'> {
    const user = this.loginUseCase.execute(email, password);
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword as Omit<User, 'password'>;
  }

  /**
   * Busca usuário por ID
   */
  getUserById(id: string): User | undefined {
    return this.userRepository.getUserById(id);
  }

  /**
   * Busca usuário por email
   */
  getUserByEmail(email: string): User | undefined {
    return this.userRepository.getUserByEmail(email);
  }

  /**
   * Lista todos os usuários por role
   */
  getUsersByRole(role: UserRole): User[] {
    return this.userRepository.getUsersByRole(role);
  }

  /**
   * Lista todos os professores
   */
  getAllProfessores(): User[] {
    return this.getUsersByRole('professor');
  }

  /**
   * Lista todos os alunos
   */
  getAllAlunos(): User[] {
    return this.getUsersByRole('aluno');
  }

  /**
   * Lista alunos de um professor específico
   */
  getAlunosByProfessorId(professorId: string): User[] {
    return this.getAllAlunos().filter(aluno => aluno.professorId === professorId);
  }

  /**
   * Verifica se um email já está cadastrado
   */
  emailExists(email: string): boolean {
    return this.userRepository.userExists(email);
  }

  /**
   * Atualiza os dados de um usuário
   */
  updateUser(
    id: string,
    updates: {
      name?: string;
      email?: string;
      password?: string;
      professorId?: string;
    }
  ): Omit<User, 'password'> {
    const updatedUser = this.updateUserUseCase.execute(id, updates);
    const { password: _, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword;
  }

  /**
   * Remove um usuário do sistema
   */
  deleteUser(id: string): void {
    if (!id || id.trim().length === 0) {
      throw new Error("ID do usuário é obrigatório");
    }

    const user = this.userRepository.getUserById(id);
    if (!user) {
      throw new Error(`Usuário com ID "${id}" não encontrado`);
    }

    // Validações específicas
    if (user.role === 'professor') {
      // Verifica se há alunos associados
      const alunos = this.getAlunosByProfessorId(id);
      if (alunos.length > 0) {
        throw new Error(
          `Não é possível excluir o professor "${user.name}" porque ` +
          `existem ${alunos.length} aluno(s) associado(s). ` +
          `Transfira os alunos para outro professor primeiro.`
        );
      }
    }

    this.userRepository.deleteUser(id);
  }
}
