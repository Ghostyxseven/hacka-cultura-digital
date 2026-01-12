// src/core/entities/User.ts

/**
 * Tipos de usuário no sistema
 */
export type UserRole = 'admin' | 'professor' | 'aluno';

/**
 * Entidade User representando um usuário do sistema
 * Segue Clean Architecture - Core/Domain layer
 */
export interface User {
  id: string;
  name: string;
  email: string;
  password: string; // Em produção seria hash, mas para hackathon simples
  role: UserRole;
  
  // Dados específicos por tipo de usuário
  professorId?: string; // Para alunos: ID do professor associado
  subjects?: string[]; // Para professores: IDs das disciplinas que lecionam
  
  createdAt: Date;
  updatedAt?: Date;
}
