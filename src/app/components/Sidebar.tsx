'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    Home,
    BookOpen,
    Users,
    BarChart2,
    Settings,
    LogOut,
    Menu,
    X
} from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';

const MENU_ITEMS = [
    { label: 'Início', href: '/professor', icon: Home },
    { label: 'Minhas Aulas', href: '/professor/planos', icon: BookOpen },
    { label: 'Turmas', href: '/professor/turmas', icon: Users },
    { label: 'Resultados', href: '/professor/resultados', icon: BarChart2 },
    { label: 'Configurações', href: '/professor/config', icon: Settings },
];

export function Sidebar() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            {/* Mobile Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-surface rounded-lg shadow-md border border-border"
            >
                {isOpen ? <X size={24} className="text-text-main" /> : <Menu size={24} className="text-text-main" />}
            </button>

            {/* Overlay for Mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar Container */}
            <aside className={`
        fixed top-0 left-0 z-40 h-screen w-64 bg-surface border-r border-border transition-transform duration-300 ease-in-out
        flex flex-col
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
                {/* Logo Area */}
                <div className="h-20 flex items-center px-8 border-b border-border/50">
                    <div className="flex items-center gap-2">
                        <span className="text-3xl">🦉</span>
                        <div>
                            <h1 className="font-heading font-bold text-xl text-primary leading-none">EduDigital</h1>
                            <span className="text-xs text-secondary font-medium tracking-wider">PROFESSOR</span>
                        </div>
                    </div>
                </div>

                {/* Navigation Items */}
                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                    {MENU_ITEMS.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`
                  flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group
                  ${isActive
                                        ? 'bg-primary/10 text-primary font-semibold'
                                        : 'text-text-secondary hover:bg-gray-50 hover:text-text-main'
                                    }
                `}
                            >
                                <Icon size={20} className={isActive ? 'text-primary' : 'text-gray-400 group-hover:text-primary transition-colors'} />
                                <span className={isActive ? 'text-primary' : ''}>{item.label}</span>

                                {isActive && (
                                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* User Footer */}
                <div className="p-4 border-t border-border/50 bg-gray-50/50">
                    <button className="flex items-center gap-3 w-full px-4 py-3 text-text-secondary hover:text-error transition-colors rounded-xl hover:bg-red-50">
                        <LogOut size={20} />
                        <span className="font-medium">Sair</span>
                    </button>
                </div>
            </aside>
        </>
    );
}
