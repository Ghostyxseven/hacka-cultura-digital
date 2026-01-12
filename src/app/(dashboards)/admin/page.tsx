// src/app/(dashboards)/admin/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getAuthService } from '@/lib/authService';
import { HeaderWithAuth } from '@/components/layout/HeaderWithAuth';
import { PageContainer } from '@/components/layout/PageContainer';
import { Loading } from '@/components/ui/Loading';
import { StatsSection } from '@/app/components';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { showError, showSuccess } from '@/utils/notifications';
import type { User } from '@/core/entities/User';

export default function AdminPage() {
  const { isAdmin } = useAuth();
  const authService = getAuthService();
  const [professores, setProfessores] = useState<User[]>([]);
  const [alunos, setAlunos] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string }>({});

  // Estado para edição
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPassword, setEditPassword] = useState('');
  const [editProfessorId, setEditProfessorId] = useState('');
  const [editErrors, setEditErrors] = useState<{ name?: string; email?: string; password?: string; professorId?: string }>({});

  useEffect(() => {
    if (isAdmin) {
      loadUsers();
    }
  }, [isAdmin]);

  const loadUsers = () => {
    try {
      const professoresList = authService.getUsersByRole('professor');
      const alunosList = authService.getUsersByRole('aluno');
      setProfessores(professoresList as User[]);
      setAlunos(alunosList as User[]);
    } catch (error) {
      showError('Erro ao carregar usuários');
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors: typeof errors = {};
    if (!name.trim()) newErrors.name = 'Nome é obrigatório';
    if (!email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Email inválido';
    } else if (authService.emailExists(email)) {
      newErrors.email = 'Email já cadastrado';
    }
    if (!password) {
      newErrors.password = 'Senha é obrigatória';
    } else if (password.length < 4) {
      newErrors.password = 'Senha deve ter pelo menos 4 caracteres';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateEditForm = () => {
    const newErrors: typeof editErrors = {};
    if (!editName.trim()) newErrors.name = 'Nome é obrigatório';
    if (!editEmail.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editEmail)) {
      newErrors.email = 'Email inválido';
    } else {
      const existingUser = authService.getUserByEmail(editEmail);
      if (existingUser && existingUser.id !== editingUser?.id) {
        newErrors.email = 'Email já cadastrado';
      }
    }
    if (editPassword && editPassword.length < 4) {
      newErrors.password = 'Senha deve ter pelo menos 4 caracteres';
    }
    if (editingUser?.role === 'aluno' && !editProfessorId) {
      newErrors.professorId = 'Selecione um professor';
    }
    setEditErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      authService.registerProfessor(name.trim(), email.trim(), password);
      showSuccess('Professor cadastrado com sucesso!');
      setName('');
      setEmail('');
      setPassword('');
      setShowForm(false);
      setErrors({});
      loadUsers();
    } catch (error) {
      showError(error instanceof Error ? error.message : 'Erro ao cadastrar professor');
    }
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setEditName(user.name);
    setEditEmail(user.email);
    setEditPassword('');
    setEditProfessorId(user.professorId || '');
    setEditErrors({});
    setShowForm(false);
  };

  const handleCancelEdit = () => {
    setEditingUser(null);
    setEditName('');
    setEditEmail('');
    setEditPassword('');
    setEditProfessorId('');
    setEditErrors({});
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser || !validateEditForm()) return;

    try {
      const updates: any = {
        name: editName.trim(),
        email: editEmail.trim(),
      };

      if (editPassword) {
        updates.password = editPassword;
      }

      if (editingUser.role === 'aluno') {
        updates.professorId = editProfessorId;
      }

      authService.updateUser(editingUser.id, updates);
      showSuccess('Usuário atualizado com sucesso!');
      handleCancelEdit();
      loadUsers();
    } catch (error) {
      showError(error instanceof Error ? error.message : 'Erro ao atualizar usuário');
    }
  };

  const handleDelete = (user: User) => {
    if (!confirm(`Tem certeza que deseja excluir o usuário "${user.name}"?`)) {
      return;
    }

    try {
      authService.deleteUser(user.id);
      showSuccess('Usuário excluído com sucesso!');
      loadUsers();
    } catch (error) {
      showError(error instanceof Error ? error.message : 'Erro ao excluir usuário');
    }
  };

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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-primary-50 to-white shadow-md border-b border-gray-200 p-6">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">🔧 Dashboard Admin</h2>
        <p className="text-gray-600">Gerenciamento de usuários e sistema</p>
      </div>

      <PageContainer>
        <StatsSection stats={stats} />

        {/* Formulário de Edição */}
        {editingUser && (
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 mb-8">
            <div className="px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-white flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">
                Editar {editingUser.role === 'professor' ? 'Professor' : 'Aluno'}
              </h2>
              <Button onClick={handleCancelEdit} variant="secondary">
                ✕ Cancelar
              </Button>
            </div>
            <div className="p-6 border-t bg-gray-50/50">
              <form onSubmit={handleUpdate} className="space-y-5 max-w-md">
                <Input
                  id="editName"
                  label="Nome"
                  value={editName}
                  onChange={(e) => {
                    setEditName(e.target.value);
                    if (editErrors.name) setEditErrors({ ...editErrors, name: undefined });
                  }}
                  error={editErrors.name}
                  required
                />
                <Input
                  id="editEmail"
                  type="email"
                  label="Email"
                  value={editEmail}
                  onChange={(e) => {
                    setEditEmail(e.target.value);
                    if (editErrors.email) setEditErrors({ ...editErrors, email: undefined });
                  }}
                  error={editErrors.email}
                  required
                />
                <Input
                  id="editPassword"
                  type="password"
                  label="Nova Senha (deixe em branco para manter a atual)"
                  value={editPassword}
                  onChange={(e) => {
                    setEditPassword(e.target.value);
                    if (editErrors.password) setEditErrors({ ...editErrors, password: undefined });
                  }}
                  error={editErrors.password}
                  helperText="Mínimo de 4 caracteres. Deixe em branco para não alterar."
                />
                {editingUser.role === 'aluno' && (
                  <Select
                    id="editProfessorId"
                    label="Professor"
                    value={editProfessorId}
                    onChange={(e) => {
                      setEditProfessorId(e.target.value);
                      if (editErrors.professorId) setEditErrors({ ...editErrors, professorId: undefined });
                    }}
                    error={editErrors.professorId}
                    required
                    placeholder="Selecione um professor"
                    options={professores.map((p) => ({
                      value: p.id,
                      label: `${p.name} (${p.email})`,
                    }))}
                  />
                )}
                <Button type="submit" variant="success">
                  💾 Salvar Alterações
                </Button>
              </form>
            </div>
          </div>
        )}

        {/* Formulário de Cadastro */}
        {!editingUser && (
          <div className="bg-white rounded-xl shadow-lg hover:shadow-xl border border-gray-200 mb-8 transition-all duration-200">
            <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center bg-gradient-to-r from-gray-50 to-white">
              <h2 className="text-xl font-bold text-gray-900">Cadastrar Professor</h2>
              <Button 
                onClick={() => {
                  setShowForm(!showForm);
                  setErrors({});
                }} 
                variant={showForm ? 'secondary' : 'primary'}
              >
                {showForm ? '✕ Cancelar' : '➕ Novo Professor'}
              </Button>
            </div>
            {showForm && (
              <div className="p-6 border-t bg-gray-50/50">
                <form onSubmit={handleSubmit} className="space-y-5 max-w-md">
                  <Input
                    id="name"
                    label="Nome"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (errors.name) setErrors({ ...errors, name: undefined });
                    }}
                    error={errors.name}
                    required
                  />
                  <Input
                    id="email"
                    type="email"
                    label="Email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email) setErrors({ ...errors, email: undefined });
                    }}
                    error={errors.email}
                    required
                  />
                  <Input
                    id="password"
                    type="password"
                    label="Senha"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errors.password) setErrors({ ...errors, password: undefined });
                    }}
                    error={errors.password}
                    required
                  />
                  <Button type="submit">Cadastrar</Button>
                </form>
              </div>
            )}
          </div>
        )}

        {/* Lista de Professores */}
        <div className="bg-white rounded-xl shadow-lg hover:shadow-xl border border-gray-200 mb-8 transition-all duration-200">
          <div className="px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
            <h2 className="text-xl font-bold text-gray-900">
              Professores ({professores.length})
            </h2>
          </div>
          <div className="p-6">
            {professores.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Nenhum professor cadastrado</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {professores.map((prof) => (
                  <div key={prof.id} className="group relative flex items-center justify-between p-5 border border-gray-200 rounded-xl hover:shadow-md hover:border-primary-300 bg-white transition-all duration-200">
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                        {prof.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors truncate">{prof.name}</p>
                        <p className="text-sm text-gray-500 truncate">{prof.email}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          {authService.getAlunosByProfessorId(prof.id).length} aluno(s)
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
        <div className="bg-white rounded-xl shadow-lg hover:shadow-xl border border-gray-200 transition-all duration-200">
          <div className="px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
            <h2 className="text-xl font-bold text-gray-900">Alunos ({alunos.length})</h2>
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
                    <div key={aluno.id} className="group relative flex items-center justify-between p-5 border border-gray-200 rounded-xl hover:shadow-md hover:border-primary-300 bg-white transition-all duration-200">
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
      </PageContainer>
    </div>
  );
}
