'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function InitAdminPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [shouldShowForm, setShouldShowForm] = useState(false);

  useEffect(() => {
    // Verifica se já existe admin
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const hasAdmin = users.some((u: any) => u.role === 'admin');
    
    if (hasAdmin) {
      router.push('/login');
    } else {
      setShouldShowForm(true);
    }
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Cria o primeiro admin
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      
      users.push({
        id: Date.now(),
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: 'admin',
        createdAt: new Date().toISOString(),
      });

      localStorage.setItem('users', JSON.stringify(users));
      router.push('/login');
    } catch (err) {
      setError('Erro ao criar administrador');
    } finally {
      setLoading(false);
    }
  };

  if (!shouldShowForm) {
    return <div>Redirecionando...</div>;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-2 text-center">Inicializar Sistema</h1>
        <p className="text-sm text-gray-600 text-center mb-6">
          Crie a conta do primeiro administrador
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Nome Completo
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              E-mail
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
              required
            />
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Senha
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary disabled:opacity-50"
          >
            {loading ? 'Criando...' : 'Criar Administrador'}
          </button>
        </form>
      </div>
    </div>
  );
}
