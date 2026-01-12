// src/core/repositories/IUserRepository.ts
import { User } from '../entities/User';

/**
 * Interface do repositório de usuários
 * Segue Clean Architecture - Core/Domain layer (Port)
 */
export interface IUserRepository {
  saveUser(user: User): void;
  getUserById(id: string): User | undefined;
  getUserByEmail(email: string): User | undefined;
  getAllUsers(): User[];
  getUsersByRole(role: User['role']): User[];
  deleteUser(id: string): void;
  userExists(email: string): boolean;
}
