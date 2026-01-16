// src/components/ui/MobileNavigation.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from './Button';

interface NavItem {
  label: string;
  href: string;
  icon: string;
  roles?: ('professor' | 'aluno' | 'admin')[];
}

/**
 * Componente de navegação mobile-first
 * Menu hambúrguer responsivo com navegação por role
 */
export function MobileNavigation() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { user, isProfessor, isAluno, isAdmin } = useAuth();

  const professorNav: NavItem[] = [
    { label: 'Dashboard', href: '/professor', icon: '📊', roles: ['professor'] },
    { label: 'Disciplinas', href: '/professor/disciplinas/new', icon: '📚', roles: ['professor'] },
    { label: 'Unidades', href: '/professor/unidades/new', icon: '📖', roles: ['professor'] },
    { label: 'Planos', href: '/professor/planos', icon: '📝', roles: ['professor'] },
  ];

  const alunoNav: NavItem[] = [
    { label: 'Dashboard', href: '/aluno', icon: '📊', roles: ['aluno'] },
    { label: 'Disciplinas', href: '/aluno', icon: '📚', roles: ['aluno'] },
  ];

  const adminNav: NavItem[] = [
    { label: 'Admin', href: '/admin', icon: '⚙️', roles: ['admin'] },
  ];

  const getNavItems = (): NavItem[] => {
    if (isAdmin) return [...professorNav, ...adminNav];
    if (isProfessor) return professorNav;
    if (isAluno) return alunoNav;
    return [];
  };

  const navItems = getNavItems();

  const isActive = (href: string) => {
    if (href === '/professor' || href === '/aluno') {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  if (!user) return null;

  return (
    <>
      {/* Botão hambúrguer - sempre visível em mobile */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        variant="secondary"
        size="sm"
        className="md:hidden fixed bottom-4 right-4 z-50 rounded-full p-3 shadow-lg"
        aria-label={isOpen ? 'Fechar menu' : 'Abrir menu'}
        aria-expanded={isOpen}
      >
        {isOpen ? '✕' : '☰'}
      </Button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Menu lateral */}
      <nav
        className={`
          fixed bottom-0 left-0 right-0 md:static
          bg-white border-t md:border-t-0 md:border-r border-gray-200
          z-50
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-y-0' : 'translate-y-full md:translate-y-0'}
          md:translate-y-0
          md:w-64 md:h-screen
          shadow-lg md:shadow-none
        `}
        aria-label="Navegação principal"
      >
        <div className="flex flex-row md:flex-col h-16 md:h-full overflow-x-auto md:overflow-y-auto">
          {navItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`
                  flex items-center gap-3 px-4 py-3 md:py-4
                  min-w-[120px] md:min-w-0
                  transition-colors
                  ${active 
                    ? 'bg-blue-50 text-blue-600 border-b-2 md:border-b-0 md:border-l-2 border-blue-600' 
                    : 'text-gray-700 hover:bg-gray-50'
                  }
                `}
                aria-current={active ? 'page' : undefined}
              >
                <span className="text-xl">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
