// src/app/units/[id]/lesson-plan/page.tsx
// Rota: /units/[id]/lesson-plan (Visualização do Plano de Aula)
'use client';

import { useParams } from 'next/navigation';
import { LessonPlanPage } from '../../../pages/LessonPlanPage';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

export default function Page() {
  const params = useParams();
  const unitId = params.id as string;
  
  return (
    <ProtectedRoute allowedRoles={['professor', 'admin', 'aluno']}>
      <LessonPlanPage unitId={unitId} />
    </ProtectedRoute>
  );
}
