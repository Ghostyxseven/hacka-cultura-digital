'use client';

import { Header } from '@/components/layout/Header';

/**
 * Layout do Professor - Single User Application
 * Sem autenticação necessária
 */
export default function ProfessorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <Header />
      {children}
    </div>
  );
}
