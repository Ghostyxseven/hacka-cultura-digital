// src/app/(dashboards)/professor/layout.tsx
'use client';

import { Sidebar } from '@/app/components/Sidebar';

export default function ProfessorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-background">
      <aside className="w-64 shrink-0">
        <Sidebar />
      </aside>

      <main className="flex-1 flex justify-center lg:ml-64">
        <div className="w-full max-w-7xl px-6 py-6">
          {children}
        </div>
      </main>
    </div>
  );
}
