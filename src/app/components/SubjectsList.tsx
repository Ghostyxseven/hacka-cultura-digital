'use client';

import Link from 'next/link';
import { SubjectCard } from './SubjectCard';

export function SubjectsList() {
  const subjects: any[] = []; // Será preenchido com dados reais

  if (subjects.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600 mb-4">Nenhuma disciplina cadastrada</p>
        <Link href="/professor/disciplinas/new" className="btn-primary">
          Criar Disciplina
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {subjects.map((subject) => (
        <SubjectCard key={subject.id} subject={subject} />
      ))}
    </div>
  );
}
