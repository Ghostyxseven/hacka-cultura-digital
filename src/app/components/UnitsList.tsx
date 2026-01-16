'use client';

import Link from 'next/link';
import { UnitCard } from './UnitCard';

export function UnitsList() {
  const units: any[] = []; // Será preenchido com dados reais

  if (units.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600 mb-4">Nenhuma unidade cadastrada</p>
        <Link href="/professor/unidades/new" className="btn-primary">
          Criar Unidade
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {units.map((unit) => (
        <UnitCard key={unit.id} unit={unit} />
      ))}
    </div>
  );
}
