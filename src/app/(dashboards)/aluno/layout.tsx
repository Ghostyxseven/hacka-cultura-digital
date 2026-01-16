'use client';

import { HeaderWithAuth } from '@/components/layout/HeaderWithAuth';

export default function AlunoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <HeaderWithAuth />
      {children}
    </div>
  );
}
