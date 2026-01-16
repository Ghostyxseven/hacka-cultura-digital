'use client';

import { Sidebar } from '@/app/components';

/**
 * Layout do Professor - Single User Application
 * Com sidebar de navegação moderna
 */
export default function ProfessorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 ml-64">
        {children}
      </main>
    </div>
  );
}
