// src/repository/IUserRepository.ts
import { User } from '../core/entities/User';

/**
 * Interface do repositório de usuários
 * Segue Clean Architecture - Repository layer
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
