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
      loadUsers();
    } catch (error) {
      showError(error instanceof Error ? error.message : 'Erro ao cadastrar professor');
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
      <HeaderWithAuth
        title="🔧 Dashboard Admin"
        subtitle="Gerenciamento de usuários e sistema"
      />

      <PageContainer>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Admin</h1>
          <p className="text-gray-600">Gerencie usuários e configure o sistema</p>
        </div>
        
        <StatsSection stats={stats} />

        <div className="bg-white rounded-xl shadow-lg hover:shadow-xl border border-gray-200 mb-8 transition-all duration-200">
          <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center bg-gradient-to-r from-gray-50 to-white">
            <h2 className="text-xl font-bold text-gray-900">Cadastrar Professor</h2>
            <Button onClick={() => setShowForm(!showForm)} variant={showForm ? 'secondary' : 'primary'}>
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
                  <div key={prof.id} className="group flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:shadow-md hover:border-primary-300 bg-white transition-all duration-200">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white font-bold text-sm">
                        {prof.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">{prof.name}</p>
                        <p className="text-sm text-gray-500">{prof.email}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

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
                    <div key={aluno.id} className="group flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:shadow-md hover:border-primary-300 bg-white transition-all duration-200">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
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
