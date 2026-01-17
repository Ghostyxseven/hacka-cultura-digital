'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface SidebarItem {
  label: string;
  href: string;
  icon: string;
}

/**
 * Sidebar de navegação - Design moderno e limpo
 * Baseado no design de referência com sidebar escura
 * Responsivo: menu hambúrguer em mobile
 */
export function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsOpen(false); // Fecha sidebar em desktop
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const menuItems: SidebarItem[] = [
    { label: 'Início', href: '/professor', icon: '🏠' },
    { label: 'Criar Disciplina', href: '/professor/disciplinas/new', icon: '➕' },
    { label: 'Arquivados', href: '/professor/arquivados', icon: '📦' },
    { label: 'Configurações', href: '/professor/configuracoes', icon: '⚙️' },
  ];

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname?.startsWith(href);
  };

  // Fecha sidebar ao clicar em um link em mobile
  const handleLinkClick = () => {
    if (isMobile) {
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* Overlay para mobile */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 transition-opacity"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Botão hambúrguer para mobile */}
      {isMobile && (
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="fixed top-4 left-4 z-50 p-2 bg-gray-900 text-white rounded-lg shadow-lg hover:bg-gray-800 transition-all md:hidden"
          aria-label="Abrir menu"
          aria-expanded={isOpen}
        >
          <span className="text-2xl">{isOpen ? '✕' : '☰'}</span>
        </button>
      )}

      <aside
        className={`fixed left-0 top-0 h-full w-64 bg-gray-900 text-white shadow-xl z-40 transition-transform duration-300 ${
          isMobile && !isOpen ? '-translate-x-full' : 'translate-x-0'
        }`}
      >
      {/* Logo */}
      <div className="p-6 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-2xl">📖</span>
          </div>
          <div>
            <h1 className="font-bold text-lg text-white">Cultura Digital</h1>
            <p className="text-xs text-gray-400">PROFESSOR</p>
          </div>
        </div>
      </div>

      {/* Menu de Navegação */}
      <nav className="p-4 space-y-2 mt-4">
        {menuItems.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={handleLinkClick}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-lg transition-all
                ${
                  active
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }
              `}
            >
              {active && <span className="w-1.5 h-1.5 bg-green-400 rounded-full"></span>}
              <span className="text-lg">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer da Sidebar */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-800">
        <Link
          href="/professor"
          onClick={handleLinkClick}
          className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg transition-all"
        >
          <span className="text-lg">←</span>
          <span className="font-medium">Voltar</span>
        </Link>
      </div>
    </aside>
    </>
  );
}
