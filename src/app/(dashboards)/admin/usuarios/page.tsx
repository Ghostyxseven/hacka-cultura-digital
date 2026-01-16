// src/app/(dashboards)/admin/usuarios/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { PageContainer } from '@/components';
import { Button } from '@/components/ui/Button';
import { useUserManagement } from '@/hooks/useUserManagement';
import { User } from '@/core/entities/User';
import { UserCreateForm } from '../components/UserCreateForm';
import { AlunoCreateForm } from '../components/AlunoCreateForm';
import { UserEditForm } from '../components/UserEditForm';
import { ConfirmDeleteButton } from '@/components';

export default function UsuariosPage() {
  const { isAdmin } = useAuth();
  const {
    professores,
    alunos,
    loading,
    loadUsers,
    createProfessor,
    createAluno,
    updateUser,
    deleteUser,
  } = useUserManagement();

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [userType, setUserType] = useState<'professor' | 'aluno'>('professor');

  useEffect(() => {
    if (isAdmin) {
      loadUsers();
    }
  }, [isAdmin, loadUsers]);

  if (!isAdmin) {
    return (
      <PageContainer>
        <div className="text-center py-12">
          <p className="text-red-600">Acesso negado. Apenas administradores podem acessar esta página.</p>
        </div>
      </PageContainer>
    );
  }

  const handleCreate = (data: { name: string; email: string; password: string; professorId?: string }) => {
    const success = userType === 'professor' 
      ? createProfessor(data)
      : createAluno({ ...data, professorId: data.professorId || professores[0]?.id || '' });
    
    if (success) {
      setShowCreateForm(false);
    }
  };

  const handleEdit = (updates: any) => {
    if (editingUser) {
      const success = updateUser(editingUser.id, updates);
      if (success) {
        setEditingUser(null);
      }
    }
  };

  const handleDelete = (userId: string) => {
    const success = deleteUser(userId);
    if (success) {
      loadUsers();
    }
  };

  const checkEmailExists = (email: string): boolean => {
    const allUsers = [...professores, ...alunos];
    return allUsers.some(u => u.email.toLowerCase() === email.toLowerCase());
  };

  return (
    <PageContainer>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Gerenciar Usuários</h1>
          <p className="text-gray-600">Gerencie professores e alunos do sistema</p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => {
              setUserType('professor');
              setShowCreateForm(true);
            }}
            variant="primary"
          >
            + Novo Professor
          </Button>
          <Button
            onClick={() => {
              setUserType('aluno');
              setShowCreateForm(true);
            }}
            variant="secondary"
          >
            + Novo Aluno
          </Button>
        </div>
      </div>

      {showCreateForm && (
        <div className="mb-6 bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-bold mb-4">
            Criar {userType === 'professor' ? 'Professor' : 'Aluno'}
          </h2>
          {userType === 'aluno' && professores.length === 0 ? (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-yellow-800">
                É necessário ter pelo menos um professor cadastrado para criar alunos.
              </p>
              <Button
                onClick={() => {
                  setUserType('professor');
                }}
                variant="primary"
                className="mt-2"
              >
                Criar Professor Primeiro
              </Button>
            </div>
          ) : userType === 'professor' ? (
            <UserCreateForm
              checkEmailExists={checkEmailExists}
              onSubmit={handleCreate}
              onCancel={() => setShowCreateForm(false)}
            />
          ) : (
            <AlunoCreateForm
              professores={professores}
              checkEmailExists={checkEmailExists}
              onSubmit={handleCreate}
              onCancel={() => setShowCreateForm(false)}
            />
          )}
        </div>
      )}

      {editingUser && (
        <div className="mb-6 bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-bold mb-4">Editar Usuário</h2>
          <UserEditForm
            user={editingUser}
            professores={professores}
            checkEmailExists={checkEmailExists}
            onSubmit={handleEdit}
            onCancel={() => setEditingUser(null)}
          />
        </div>
      )}

      {loading ? (
        <div className="text-center py-12 text-gray-500">Carregando...</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Professores */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Professores</h2>
              <span className="text-sm text-gray-500">{professores.length} total</span>
            </div>
            <div className="space-y-2">
              {professores.length === 0 ? (
                <p className="text-gray-500 text-center py-4">Nenhum professor cadastrado</p>
              ) : (
                professores.map((professor) => (
                  <div
                    key={professor.id}
                    className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
                  >
                    <div>
                      <p className="font-medium text-gray-900">{professor.name}</p>
                      <p className="text-sm text-gray-500">{professor.email}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => setEditingUser(professor)}
                        variant="secondary"
                        size="sm"
                      >
                        Editar
                      </Button>
                      <ConfirmDeleteButton
                        onConfirm={() => handleDelete(professor.id)}
                        itemName={professor.name}
                      />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Alunos */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Alunos</h2>
              <span className="text-sm text-gray-500">{alunos.length} total</span>
            </div>
            <div className="space-y-2">
              {alunos.length === 0 ? (
                <p className="text-gray-500 text-center py-4">Nenhum aluno cadastrado</p>
              ) : (
                alunos.map((aluno) => (
                  <div
                    key={aluno.id}
                    className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
                  >
                    <div>
                      <p className="font-medium text-gray-900">{aluno.name}</p>
                      <p className="text-sm text-gray-500">{aluno.email}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => setEditingUser(aluno)}
                        variant="secondary"
                        size="sm"
                      >
                        Editar
                      </Button>
                      <ConfirmDeleteButton
                        onConfirm={() => handleDelete(aluno.id)}
                        itemName={aluno.name}
                      />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </PageContainer>
  );
}
