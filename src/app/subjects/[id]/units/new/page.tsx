// src/app/subjects/[id]/units/new/page.tsx
// Rota: /subjects/[id]/units/new (Nova Unidade)
'use client';

import { useParams } from 'next/navigation';
import { NewUnitPage } from '../../../../pages/NewUnitPage';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

export default function Page() {
  const params = useParams();
  const subjectId = params.id as string;
  
  return (
    <ProtectedRoute allowedRoles={['professor', 'admin']}>
      <NewUnitPage subjectId={subjectId} />
    </ProtectedRoute>
  );
}
