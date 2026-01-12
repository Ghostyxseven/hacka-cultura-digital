// src/lib/authService.ts
// Factory para criar instância do AuthService
import { AuthService } from '../application/services/AuthService';
import { LocalStorageUserRepository } from '../repository/implementations/LocalStorageUserRepository';

let authServiceInstance: AuthService | null = null;

/**
 * Obtém instância singleton do AuthService
 */
export function getAuthService(): AuthService {
  if (!authServiceInstance) {
    const userRepository = LocalStorageUserRepository.getInstance();
    authServiceInstance = new AuthService(userRepository);
  }
  return authServiceInstance;
}
