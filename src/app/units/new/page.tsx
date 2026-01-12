// src/app/units/new/page.tsx
// Rota: /units/new (Nova Unidade - requer subjectId como query param)
'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { NewUnitPage } from '@/app/pages/units/NewUnitPage';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Loading } from '@/components/ui/Loading';

export default function Page() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const subjectId = searchParams.get('subjectId');

  if (!subjectId) {
    router.push('/professor');
    return <Loading />;
  }

  return (
    <ProtectedRoute requiredRole="professor">
      <NewUnitPage subjectId={subjectId} />
    </ProtectedRoute>
  );
}
