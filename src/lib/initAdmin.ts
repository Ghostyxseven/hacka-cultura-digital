// src/lib/initAdmin.ts
// Script para inicializar usuário admin padrão

import { LocalStorageUserRepository } from '@/repository/implementations/LocalStorageUserRepository';
import { CreateUserUseCase } from '@/application/usecases/CreateUserUseCase';

/**
 * Inicializa o usuário admin padrão se não existir
 * Email: micael@admin.com
 * Senha: 123456
 */
export function initAdmin(): void {
  if (typeof window === 'undefined') {
    return; // Não executa no servidor
  }

  try {
    const userRepository = LocalStorageUserRepository.getInstance();
    const createUserUseCase = new CreateUserUseCase(userRepository);

    const adminEmail = 'micael@admin.com';

    // Verifica se o admin já existe
    const existingUser = userRepository.getUserByEmail(adminEmail);
    if (existingUser) {
      console.log('✅ Usuário admin já existe');
      return;
    }

    // Cria o usuário admin
    createUserUseCase.execute('Micael', adminEmail, '123456', 'admin');
    
    console.log('✅ Usuário admin criado com sucesso!');
    console.log('📧 Email: micael@admin.com');
    console.log('🔑 Senha: 123456');
  } catch (error) {
    console.error('❌ Erro ao criar usuário admin:', error);
  }
}
