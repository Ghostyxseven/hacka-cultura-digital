// src/app/(dashboards)/admin/components/AlunoCreateForm.tsx
'use client';

import { useState } from 'react';
import { Button, Input, Select } from '@/components';
import { useEmailValidation, usePasswordValidation } from '@/hooks';
import { User } from '@/core/entities/User';

interface AlunoCreateFormProps {
  professores: User[];
  checkEmailExists?: (email: string) => boolean;
  onSubmit: (data: { name: string; email: string; password: string; professorId: string }) => boolean;
  onCancel: () => void;
}

export function AlunoCreateForm({ professores, checkEmailExists, onSubmit, onCancel }: AlunoCreateFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [professorId, setProfessorId] = useState('');
  const [nameError, setNameError] = useState<string | undefined>();
  const [professorError, setProfessorError] = useState<string | undefined>();

  const { error: emailError, validate: validateEmail, clearError: clearEmailError } = useEmailValidation();
  const { error: passwordError, validate: validatePassword, clearErrors: clearPasswordErrors } = usePasswordValidation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let isValid = true;

    if (!name.trim()) {
      setNameError('Nome é obrigatório');
      isValid = false;
    } else if (name.trim().length < 3) {
      setNameError('Nome deve ter pelo menos 3 caracteres');
      isValid = false;
    } else {
      setNameError(undefined);
    }

    if (!professorId) {
      setProfessorError('Selecione um professor');
      isValid = false;
    } else {
      setProfessorError(undefined);
    }

    if (checkEmailExists) {
      if (!validateEmail(email, checkEmailExists)) {
        isValid = false;
      }
    } else {
      if (!validateEmail(email)) {
        isValid = false;
      }
    }

    if (!validatePassword(password)) {
      isValid = false;
    }

    if (!isValid) {
      return;
    }

    const success = onSubmit({
      name: name.trim(),
      email: email.trim(),
      password,
      professorId,
    });

    if (success) {
      setName('');
      setEmail('');
      setPassword('');
      setProfessorId('');
      setNameError(undefined);
      setProfessorError(undefined);
      clearEmailError();
      clearPasswordErrors();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-md">
      <Input
        id="name"
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
        id="email"
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
        id="password"
        type="password"
        label="Senha"
        value={password}
        onChange={(e) => {
          setPassword(e.target.value);
          clearPasswordErrors();
        }}
        error={passwordError}
        required
        helperText="Mínimo de 4 caracteres"
      />
      <Select
        id="professorId"
        label="Professor"
        value={professorId}
        onChange={(e) => {
          setProfessorId(e.target.value);
          if (professorError) setProfessorError(undefined);
        }}
        error={professorError}
        required
      >
        <option value="">Selecione um professor</option>
        {professores.map((prof) => (
          <option key={prof.id} value={prof.id}>
            {prof.name} ({prof.email})
          </option>
        ))}
      </Select>
      <div className="flex gap-2">
        <Button type="submit">Cadastrar</Button>
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancelar
        </Button>
      </div>
    </form>
  );
}
