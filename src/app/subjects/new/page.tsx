// src/app/subjects/new/page.tsx
// Rota: /subjects/new (Nova Disciplina)
'use client';

import { NewSubjectPage } from '../../pages/subjects/NewSubjectPage';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

export default function Page() {
  return (
    <ProtectedRoute allowedRoles={['professor', 'admin']}>
      <NewSubjectPage />
    </ProtectedRoute>
  );
}
