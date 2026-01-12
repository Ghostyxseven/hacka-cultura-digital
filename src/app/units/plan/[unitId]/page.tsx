// src/app/units/plan/[unitId]/page.tsx
// Rota: /units/plan/[unitId] (Visualização do Plano de Aula)
'use client';

import { useParams } from 'next/navigation';
import { LessonPlanPage } from '@/app/pages/units/LessonPlanPage';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

export default function Page() {
  const params = useParams();
  const unitId = params.unitId as string;
  
  return (
    <ProtectedRoute>
      <LessonPlanPage unitId={unitId} />
    </ProtectedRoute>
  );
}
