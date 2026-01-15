// src/app/(dashboards)/admin/page.tsx
'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useUserManagement } from '@/hooks';
import { PageContainer } from '@/components/layout/PageContainer';
import { Loading } from '@/components/ui/Loading';
import { StatsSection, InstitutionalPerformance } from '@/app/components';
import { Button } from '@/components/ui/Button';
import { UserCreateForm } from './components/UserCreateForm';
import { UserEditForm } from './components/UserEditForm';
import type { User } from '@/core/entities/User';

export default function AdminPage() {
  const { isAdmin } = useAuth();
  const {
    professores,
    alunos,
    loading,
    createProfessor,
    updateUser,
    deleteUser,
    getAlunosByProfessorId,
  } = useUserManagement();

  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<'users' | 'institutional'>('users');

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Acesso Negado</h1>
          <p className="text-gray-600">Você não tem permissão para acessar esta página.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return <Loading />;
  }

  const stats = [
    { title: 'Professores', value: professores.length },
    { title: 'Alunos', value: alunos.length },
    { title: 'Total de Usuários', value: professores.length + alunos.length },
  ];

  const handleCreateProfessor = (data: { name: string; email: string; password: string }) => {
    const success = createProfessor(data);
    if (success) {
      setShowForm(false);
    }
    return success;
  };

  const handleUpdateUser = (id: string, updates: {
    name?: string;
    email?: string;
    password?: string;
    professorId?: string;
  }) => {
    const success = updateUser(id, updates);
    if (success) {
      setEditingUser(null);
    }
    return success;
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setShowForm(false);
  };

  const handleCancelEdit = () => {
    setEditingUser(null);
  };

  const handleDelete = (user: User) => {
    deleteUser(user);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-red-50/30 to-gray-50">
      {/* Header Moderno */}
      <div className="bg-gradient-to-r from-red-600 via-orange-500 to-red-600 shadow-xl border-b border-red-700/20">
        <div className="px-4 sm:px-6 lg:px-8 py-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
              <span className="text-5xl">🔧</span>
              <span>Dashboard Admin</span>
            </h1>
            <p className="text-red-100 text-lg">Gerenciamento de usuários e sistema</p>
          </div>
        </div>
      </div>

      <PageContainer>
        <div className="flex gap-4 mb-8 bg-white p-2 rounded-2xl shadow-md border border-gray-100 w-fit">
          <button
            onClick={() => setActiveTab('users')}
            className={`px-6 py-2 rounded-xl font-bold transition-all ${activeTab === 'users'
                ? 'bg-red-600 text-white shadow-lg'
                : 'text-gray-500 hover:bg-gray-50'
              }`}
          >
            👥 Gestão de Usuários
          </button>
          <button
            onClick={() => setActiveTab('institutional')}
            className={`px-6 py-2 rounded-xl font-bold transition-all ${activeTab === 'institutional'
                ? 'bg-red-600 text-white shadow-lg'
                : 'text-gray-500 hover:bg-gray-50'
              }`}
          >
            📊 Desempenho Institucional
          </button>
        </div>

        {activeTab === 'users' ? (
          <>
            <StatsSection stats={stats} />

            {/* Formulário de Edição */}
            {editingUser && (
              <div className="bg-white rounded-2xl shadow-xl border border-gray-200 mb-8 overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-blue-50 via-indigo-50 to-blue-50 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">✏️</span>
                    <h2 className="text-2xl font-bold text-gray-900">
                      Editar {editingUser.role === 'professor' ? 'Professor' : 'Aluno'}
                    </h2>
                  </div>
                </div>
                <div className="p-6 border-t bg-gray-50/50">
                  <UserEditForm
                    user={editingUser}
                    professores={professores}
                    checkEmailExists={(email) => {
                      const allUsers = [...professores, ...alunos];
                      return allUsers.find(u => u.email === email);
                    }}
                    onSubmit={handleUpdateUser}
                    onCancel={handleCancelEdit}
                  />
                </div>
              </div>
            )}

            {/* Formulário de Cadastro */}
            {!editingUser && (
              <div className="bg-white rounded-2xl shadow-xl hover:shadow-2xl border border-gray-200 mb-8 transition-all duration-300 overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center bg-gradient-to-r from-primary-50 via-indigo-50 to-primary-50">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">➕</span>
                    <h2 className="text-2xl font-bold text-gray-900">Cadastrar Professor</h2>
                  </div>
                  <Button
                    onClick={() => {
                      setShowForm(!showForm);
                    }}
                    variant={showForm ? 'secondary' : 'primary'}
                  >
                    {showForm ? '✕ Cancelar' : '➕ Novo Professor'}
                  </Button>
                </div>
                {showForm && (
                  <div className="p-6 border-t bg-gray-50/50">
                    <UserCreateForm
                      checkEmailExists={(email) => {
                        const allUsers = [...professores, ...alunos];
                        return allUsers.some(u => u.email === email);
                      }}
                      onSubmit={handleCreateProfessor}
                      onCancel={() => setShowForm(false)}
                    />
                  </div>
                )}
              </div>
            )}

            {/* Lista de Professores */}
            <div className="bg-white rounded-2xl shadow-xl hover:shadow-2xl border border-gray-200 mb-8 transition-all duration-300 overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-primary-50 via-indigo-50 to-primary-50">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">👨‍🏫</span>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      Professores
                    </h2>
                    <p className="text-sm text-gray-600 mt-1">
                      {professores.length} {professores.length === 1 ? 'professor cadastrado' : 'professores cadastrados'}
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-6">
                {professores.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">Nenhum professor cadastrado</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {professores.map((prof) => (
                      <div key={prof.id} className="group relative flex items-center justify-between p-6 border border-gray-200 rounded-2xl hover:shadow-lg hover:border-primary-300 bg-white transition-all duration-300 hover:-translate-y-1">
                        <div className="flex items-center gap-4 flex-1 min-w-0">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                            {prof.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors truncate">{prof.name}</p>
                            <p className="text-sm text-gray-500 truncate">{prof.email}</p>
                            <p className="text-xs text-gray-400 mt-1">
                              {getAlunosByProfessorId(prof.id).length} aluno(s)
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleEdit(prof)}
                            className="p-2 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-all"
                            title="Editar"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDelete(prof)}
                            className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all"
                            title="Excluir"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Lista de Alunos */}
            <div className="bg-white rounded-2xl shadow-xl hover:shadow-2xl border border-gray-200 transition-all duration-300 overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-blue-50 via-indigo-50 to-blue-50">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">👨‍🎓</span>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Alunos</h2>
                    <p className="text-sm text-gray-600 mt-1">
                      {alunos.length} {alunos.length === 1 ? 'aluno cadastrado' : 'alunos cadastrados'}
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-6">
                {alunos.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">Nenhum aluno cadastrado</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {alunos.map((aluno) => {
                      const professor = professores.find(p => p.id === aluno.professorId);
                      return (
                        <div key={aluno.id} className="group relative flex items-center justify-between p-6 border border-gray-200 rounded-2xl hover:shadow-lg hover:border-primary-300 bg-white transition-all duration-300 hover:-translate-y-1">
                          <div className="flex items-center gap-4 flex-1 min-w-0">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                              {aluno.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors truncate">{aluno.name}</p>
                              <p className="text-sm text-gray-500 truncate">{aluno.email}</p>
                              {professor && (
                                <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                                  <span>👨‍🏫</span>
                                  <span className="truncate">Professor: {professor.name}</span>
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="flex gap-2 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => handleEdit(aluno)}
                              className="p-2 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-all"
                              title="Editar"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => handleDelete(aluno)}
                              className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all"
                              title="Excluir"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </>
        ) : (
          <InstitutionalPerformance />
        )}
      </PageContainer>
    </div>
  );
}
