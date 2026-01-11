// src/app/subjects/[id]/page.tsx
// Rota: /subjects/[id] (Detalhes da Disciplina)
'use client';

import { useParams } from 'next/navigation';
import { SubjectDetailPage } from '../../pages/SubjectDetailPage';

export default function Page() {
  const params = useParams();
  const subjectId = params.id as string;
  
  return <SubjectDetailPage subjectId={subjectId} />;
}
