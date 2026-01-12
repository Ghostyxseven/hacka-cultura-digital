// src/app/register/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { getAuthService } from '@/lib/authService';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { showError, showSuccess } from '@/utils/notifications';

export default function RegisterPage() {
  const router = useRouter();
  const authService = getAuthService();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [professorId, setProfessorId] = useState('');
  const [loading, setLoading] = useState(false);
  const [professores, setProfessores] = useState<Array<{ id: string; name: string; email: string }>>([]);
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    professorId?: string;
  }>({});

  // Carrega lista de professores
  useEffect(() => {
    const professoresList = authService.getAllProfessores();
    setProfessores(
      professoresList.map((p) => ({
        id: p.id,
        name: p.name,
        email: p.email,
      }))
    );
  }, [authService]);

  const validateForm = () => {
    const newErrors: typeof errors = {};

    if (!name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    } else if (name.trim().length < 3) {
      newErrors.name = 'Nome deve ter pelo menos 3 caracteres';
    }

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

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Confirmação de senha é obrigatória';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Senhas não coincidem';
    }

    if (!professorId) {
      newErrors.professorId = 'Selecione um professor';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      authService.registerAluno(name.trim(), email.trim(), password, professorId);
      showSuccess('Cadastro realizado com sucesso! Faça login para continuar.');
      router.push('/login');
    } catch (error) {
      showError(error instanceof Error ? error.message : 'Erro ao realizar cadastro');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-primary-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-8 hover:shadow-3xl transition-all duration-300">
          <div className="text-center mb-8">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-4xl shadow-lg">
              📝
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Cadastro de Aluno
            </h1>
            <p className="text-gray-600">Crie sua conta para acessar os materiais</p>
          </div>

          {professores.length === 0 && (
            <div className="mb-6 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-300 rounded-xl shadow-sm">
              <p className="text-sm text-yellow-800 flex items-center gap-2 font-medium">
                <span className="text-lg">⚠️</span>
                <span>Nenhum professor cadastrado ainda. Peça ao administrador para cadastrar professores primeiro.</span>
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              id="name"
              type="text"
              label="Nome Completo"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name) setErrors({ ...errors, name: undefined });
              }}
              error={errors.name}
              required
              placeholder="Seu nome completo"
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
              placeholder="seu@email.com"
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
              placeholder="••••••••"
              helperText="Mínimo de 4 caracteres"
            />

            <Input
              id="confirmPassword"
              type="password"
              label="Confirmar Senha"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: undefined });
              }}
              error={errors.confirmPassword}
              required
              placeholder="••••••••"
            />

            <Select
              id="professorId"
              label="Professor"
              value={professorId}
              onChange={(e) => {
                setProfessorId(e.target.value);
                if (errors.professorId) setErrors({ ...errors, professorId: undefined });
              }}
              error={errors.professorId}
              required
              placeholder="Selecione seu professor"
              options={professores.map((p) => ({
                value: p.id,
                label: `${p.name} (${p.email})`,
              }))}
            />

            <Button type="submit" className="w-full" disabled={loading || professores.length === 0}>
              {loading ? 'Cadastrando...' : 'Cadastrar'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Já tem uma conta?{' '}
              <a href="/login" className="text-primary-600 hover:text-primary-700 font-medium">
                Faça login
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
