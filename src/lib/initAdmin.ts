// src/lib/initAdmin.ts
// Script para inicializar usuário admin padrão

import { LocalStorageUserRepository } from '@/repository/implementations/LocalStorageUserRepository';
import { AuthService } from '@/application/services/AuthService';
import { User } from '@/core/entities/User';

/**
 * Inicializa o usuário admin padrão se não existir
 */
export function initAdmin(): void {
  if (typeof window === 'undefined') {
    return; // Não executa no servidor
  }

  const userRepository = LocalStorageUserRepository.getInstance();
  const authService = new AuthService(userRepository);

  const adminEmail = 'micael@admin.com';

  // Verifica se o admin já existe
  if (authService.userExists(adminEmail)) {
    console.log('✅ Usuário admin já existe');
    return;
  }

  try {
    // Cria o usuário admin
    authService.registerAdmin('Micael', adminEmail, '123456');
    console.log('✅ Usuário admin criado com sucesso!');
    console.log('📧 Email: micael@admin.com');
    console.log('🔑 Senha: 123456');
  } catch (error) {
    console.error('❌ Erro ao criar usuário admin:', error);
  }
}
