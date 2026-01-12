// src/app/pages/dashboard/DashboardAdminPage.tsx
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getAuthService } from '@/lib/authService';
import { HeaderWithAuth } from '@/components/layout/HeaderWithAuth';
import { PageContainer } from '@/components/layout/PageContainer';
import { Loading } from '@/components/ui/Loading';
import { StatsSection } from '../components';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { showError, showSuccess } from '@/utils/notifications';
import type { User } from '@/core/entities/User';

export function DashboardAdminPage() {
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
      const professoresList = authService.getAllProfessores();
      const alunosList = authService.getAllAlunos();
      setProfessores(professoresList);
      setAlunos(alunosList);
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
        <StatsSection stats={stats} />

        <div className="bg-white rounded-lg shadow mb-8">
          <div className="px-6 py-4 border-b flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">Cadastrar Professor</h2>
            <Button onClick={() => setShowForm(!showForm)}>
              {showForm ? 'Cancelar' : '+ Novo Professor'}
            </Button>
          </div>
          {showForm && (
            <div className="p-6 border-t">
              <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
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

        <div className="bg-white rounded-lg shadow mb-8">
          <div className="px-6 py-4 border-b">
            <h2 className="text-xl font-semibold text-gray-900">
              Professores ({professores.length})
            </h2>
          </div>
          <div className="p-6">
            {professores.length === 0 ? (
              <p className="text-gray-500 text-center py-4">Nenhum professor cadastrado</p>
            ) : (
              <div className="space-y-3">
                {professores.map((prof) => (
                  <div key={prof.id} className="flex justify-between items-center p-4 border rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{prof.name}</p>
                      <p className="text-sm text-gray-500">{prof.email}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b">
            <h2 className="text-xl font-semibold text-gray-900">Alunos ({alunos.length})</h2>
          </div>
          <div className="p-6">
            {alunos.length === 0 ? (
              <p className="text-gray-500 text-center py-4">Nenhum aluno cadastrado</p>
            ) : (
              <div className="space-y-3">
                {alunos.map((aluno) => {
                  const professor = professores.find(p => p.id === aluno.professorId);
                  return (
                    <div key={aluno.id} className="flex justify-between items-center p-4 border rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{aluno.name}</p>
                        <p className="text-sm text-gray-500">{aluno.email}</p>
                        {professor && (
                          <p className="text-xs text-gray-400">Professor: {professor.name}</p>
                        )}
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
