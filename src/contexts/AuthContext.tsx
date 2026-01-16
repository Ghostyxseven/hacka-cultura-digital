// src/contexts/AuthContext.tsx
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserRole } from '../core/entities/User';
import { AuthService } from '../application/services/AuthService';
import { LocalStorageUserRepository } from '../repository/implementations/LocalStorageUserRepository';

interface AuthContextType {
  user: Omit<User, 'password'> | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isProfessor: boolean;
  isAluno: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USER_STORAGE_KEY = '@hacka-cultura:current-user';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Omit<User, 'password'> | null>(null);
  const [loading, setLoading] = useState(true);

  // Inicializa AuthService
  const userRepository = LocalStorageUserRepository.getInstance();
  const authService = new AuthService(userRepository);

  // Carrega usuário do localStorage na inicialização
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedUser = localStorage.getItem(USER_STORAGE_KEY);
      if (savedUser) {
        try {
          const parsedUser = JSON.parse(savedUser);
          setUser(parsedUser);
        } catch (error) {
          console.error('Erro ao carregar usuário:', error);
          localStorage.removeItem(USER_STORAGE_KEY);
        }
      }
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const loggedUser = authService.login(email, password);
      
      // AuthService já retorna sem password
      setUser(loggedUser);
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(loggedUser));
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(USER_STORAGE_KEY);
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isProfessor: user?.role === 'professor',
    isAluno: user?.role === 'aluno',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}
