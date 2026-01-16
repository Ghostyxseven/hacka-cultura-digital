'use client';

import { Sidebar } from '@/components/layout/Sidebar';
import { HeaderWithAuth } from '@/components/layout/HeaderWithAuth';

export default function ProfessorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1">
        <HeaderWithAuth />
        {children}
      </div>
    </div>
  );
}
