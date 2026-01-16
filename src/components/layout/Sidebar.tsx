'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Sidebar() {
  const pathname = usePathname();

  const links = [
    { href: '/professor', label: 'Dashboard' },
    { href: '/professor/disciplinas', label: 'Disciplinas' },
    { href: '/professor/unidades', label: 'Unidades' },
    { href: '/professor/planos', label: 'Meus Planos' },
  ];

  return (
    <aside className="w-64 bg-gray-800 text-white h-screen">
      <div className="p-6">
        <h2 className="text-xl font-bold">Menu</h2>
      </div>
      <nav className="space-y-2 p-6">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`block px-4 py-2 rounded-lg transition ${
              pathname === link.href
                ? 'bg-blue-600 text-white'
                : 'text-gray-300 hover:bg-gray-700'
            }`}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
