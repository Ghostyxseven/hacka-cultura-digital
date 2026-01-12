// src/app/subjects/[id]/page.tsx
// Rota: /subjects/[id] (Detalhes da Disciplina)
'use client';

import { useParams } from 'next/navigation';
import { SubjectDetailPage } from '../../pages/SubjectDetailPage';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

export default function Page() {
  const params = useParams();
  const subjectId = params.id as string;
  
  return (
    <ProtectedRoute allowedRoles={['professor', 'admin', 'aluno']}>
      <SubjectDetailPage subjectId={subjectId} />
    </ProtectedRoute>
  );
}
