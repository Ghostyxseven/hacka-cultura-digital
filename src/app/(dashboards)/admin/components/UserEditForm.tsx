// src/app/(dashboards)/admin/components/UserEditForm.tsx
'use client';

import { useState, useEffect } from 'react';
import { Button, Input, Select } from '@/components';
import { useEmailValidation, usePasswordValidation } from '@/hooks';
import type { User } from '@/core/entities/User';

interface UserEditFormProps {
  user: User;
  professores: User[];
  checkEmailExists?: (email: string) => User | undefined;
  onSubmit: (data: {
    name?: string;
    email?: string;
    password?: string;
    professorId?: string;
  }) => boolean;
  onCancel: () => void;
}

export function UserEditForm({ user, professores, checkEmailExists, onSubmit, onCancel }: UserEditFormProps) {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [password, setPassword] = useState('');
  const [professorId, setProfessorId] = useState(user.professorId || '');
  const [nameError, setNameError] = useState<string | undefined>();
  const [professorIdError, setProfessorIdError] = useState<string | undefined>();

  const { error: emailError, validate: validateEmail, clearError: clearEmailError } = useEmailValidation();
  const { error: passwordError, validate: validatePassword, clearErrors: clearPasswordErrors } = usePasswordValidation();

  useEffect(() => {
    setName(user.name);
    setEmail(user.email);
    setPassword('');
    setProfessorId(user.professorId || '');
    setNameError(undefined);
    setProfessorIdError(undefined);
    clearEmailError();
    clearPasswordErrors();
  }, [user, clearEmailError, clearPasswordErrors]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let isValid = true;

    if (!name.trim()) {
      setNameError('Nome é obrigatório');
      isValid = false;
    } else {
      setNameError(undefined);
    }

    // Validação de email com verificação de duplicata
    if (!email.trim()) {
      clearEmailError();
      isValid = false;
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        clearEmailError();
        isValid = false;
      } else if (checkEmailExists) {
        const existingUser = checkEmailExists(email);
        if (existingUser && existingUser.id !== user.id) {
          // Email já existe para outro usuário
          clearEmailError();
          isValid = false;
        } else {
          clearEmailError();
        }
      } else {
        if (!validateEmail(email)) {
          isValid = false;
        }
      }
    }

    if (password && !validatePassword(password)) {
      isValid = false;
    }

    if (user.role === 'aluno' && !professorId) {
      setProfessorIdError('Selecione um professor');
      isValid = false;
    } else {
      setProfessorIdError(undefined);
    }

    if (!isValid) {
      return;
    }

    const updates: any = {
      name: name.trim(),
      email: email.trim(),
    };

    if (password) {
      updates.password = password;
    }

    if (user.role === 'aluno') {
      updates.professorId = professorId;
    }

    const success = onSubmit(updates);

    if (success) {
      setPassword('');
      setNameError(undefined);
      setProfessorIdError(undefined);
      clearEmailError();
      clearPasswordErrors();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-md">
      <Input
        id="editName"
        label="Nome"
        value={name}
        onChange={(e) => {
          setName(e.target.value);
          if (nameError) setNameError(undefined);
        }}
        error={nameError}
        required
      />
      <Input
        id="editEmail"
        type="email"
        label="Email"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          clearEmailError();
        }}
        error={emailError}
        required
      />
      <Input
        id="editPassword"
        type="password"
        label="Nova Senha (deixe em branco para manter a atual)"
        value={password}
        onChange={(e) => {
          setPassword(e.target.value);
          clearPasswordErrors();
        }}
        error={passwordError}
        helperText="Mínimo de 4 caracteres. Deixe em branco para não alterar."
      />
      {user.role === 'aluno' && (
        <Select
          id="editProfessorId"
          label="Professor"
          value={professorId}
          onChange={(e) => {
            setProfessorId(e.target.value);
            if (professorIdError) setProfessorIdError(undefined);
          }}
          error={professorIdError}
          required
          placeholder="Selecione um professor"
          options={professores.map((p) => ({
            value: p.id,
            label: `${p.name} (${p.email})`,
          }))}
        />
      )}
      <div className="flex gap-2">
        <Button type="submit" variant="success">
          💾 Salvar Alterações
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel}>
          ✕ Cancelar
        </Button>
      </div>
    </form>
  );
}
