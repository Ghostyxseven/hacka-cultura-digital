// src/repository/implementations/LocalStorageUserRepository.ts
import { User } from '../../core/entities/User';
import { IUserRepository } from '../../core/repositories/IUserRepository';
import { StorageKeys } from '../../core/constants/StorageKeys';
import { parseJSONWithDates } from '../../utils/dateUtils';

/**
 * Implementação do repositório de usuários usando LocalStorage
 * Segue o padrão Singleton como LocalStorageRepository
 * Clean Architecture - Repository layer
 */
export class LocalStorageUserRepository implements IUserRepository {
  private static instance: LocalStorageUserRepository;

  private constructor() { }

  public static getInstance(): LocalStorageUserRepository {
    if (!LocalStorageUserRepository.instance) {
      LocalStorageUserRepository.instance = new LocalStorageUserRepository();
    }
    return LocalStorageUserRepository.instance;
  }

  saveUser(user: User): void {
    const users = this.getAllUsers();
    const index = users.findIndex(u => u.id === user.id);
    if (index >= 0) {
      users[index] = { ...user, updatedAt: new Date() };
    } else {
      users.push(user);
    }
    localStorage.setItem(StorageKeys.USERS, JSON.stringify(users));
  }

  getUserById(id: string): User | undefined {
    return this.getAllUsers().find(u => u.id === id);
  }

  getUserByEmail(email: string): User | undefined {
    return this.getAllUsers().find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  getAllUsers(): User[] {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(StorageKeys.USERS);
    return parseJSONWithDates<User>(data);
  }

  getUsersByRole(role: User['role']): User[] {
    return this.getAllUsers().filter(u => u.role === role);
  }

  deleteUser(id: string): void {
    const users = this.getAllUsers().filter(u => u.id !== id);
    localStorage.setItem(StorageKeys.USERS, JSON.stringify(users));
  }

  userExists(email: string): boolean {
    return !!this.getUserByEmail(email);
  }
}
