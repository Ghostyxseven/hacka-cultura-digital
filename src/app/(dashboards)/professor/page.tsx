'use client';

import { useAuth } from '@/contexts/AuthContext';
import { PageContainer } from '@/components/layout/PageContainer';
import { StatsSection } from '@/app/components/StatsSection';
import { SubjectsList } from '@/app/components/SubjectsList';

export default function ProfessorDashboard() {
  const { user } = useAuth();

  return (
    <PageContainer>
      <div className="py-8">
        <h1 className="text-3xl font-bold mb-6">Meus Materiais Didáticos</h1>
        <p className="text-gray-600">Bem-vindo, Professor(a) {user?.name}!</p>
        
        <StatsSection />
        
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Minhas Disciplinas</h2>
          <SubjectsList />
        </div>
      </div>
    </PageContainer>
  );
}
