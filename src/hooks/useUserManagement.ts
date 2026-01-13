// src/hooks/useUserManagement.ts
import { useState, useEffect, useCallback } from 'react';
import { getAuthService } from '@/lib/authService';
import { showError, showSuccess } from '@/utils/notifications';
import type { User } from '@/core/entities/User';

interface UserFormData {
  name: string;
  email: string;
  password: string;
  professorId?: string;
}

interface UserUpdateData {
  name?: string;
  email?: string;
  password?: string;
  professorId?: string;
}

/**
 * Hook para gerenciar usuários (professores e alunos)
 * Centraliza toda a lógica de CRUD de usuários
 */
export function useUserManagement() {
  const authService = getAuthService();
  const [professores, setProfessores] = useState<User[]>([]);
  const [alunos, setAlunos] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const loadUsers = useCallback(() => {
    try {
      const professoresList = authService.getUsersByRole('professor');
      const alunosList = authService.getUsersByRole('aluno');
      setProfessores(professoresList as User[]);
      setAlunos(alunosList as User[]);
    } catch (error) {
      showError('Erro ao carregar usuários');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [authService]);

  const createProfessor = useCallback((data: UserFormData) => {
    try {
      authService.registerProfessor(data.name.trim(), data.email.trim(), data.password);
      showSuccess('Professor cadastrado com sucesso!');
      loadUsers();
      return true;
    } catch (error) {
      showError(error instanceof Error ? error.message : 'Erro ao cadastrar professor');
      return false;
    }
  }, [authService, loadUsers]);

  const updateUser = useCallback((id: string, updates: UserUpdateData) => {
    try {
      authService.updateUser(id, updates);
      showSuccess('Usuário atualizado com sucesso!');
      loadUsers();
      return true;
    } catch (error) {
      showError(error instanceof Error ? error.message : 'Erro ao atualizar usuário');
      return false;
    }
  }, [authService, loadUsers]);

  const deleteUser = useCallback((user: User) => {
    if (!confirm(`Tem certeza que deseja excluir o usuário "${user.name}"?`)) {
      return false;
    }

    try {
      authService.deleteUser(user.id);
      showSuccess('Usuário excluído com sucesso!');
      loadUsers();
      return true;
    } catch (error) {
      showError(error instanceof Error ? error.message : 'Erro ao excluir usuário');
      return false;
    }
  }, [authService, loadUsers]);

  const getAlunosByProfessorId = useCallback((professorId: string) => {
    return authService.getAlunosByProfessorId(professorId);
  }, [authService]);

  const emailExists = useCallback((email: string) => {
    return authService.emailExists(email);
  }, [authService]);

  const getUserByEmail = useCallback((email: string) => {
    return authService.getUserByEmail(email);
  }, [authService]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  return {
    professores,
    alunos,
    loading,
    loadUsers,
    createProfessor,
    updateUser,
    deleteUser,
    getAlunosByProfessorId,
    emailExists,
    getUserByEmail,
  };
}
