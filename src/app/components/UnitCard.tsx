import Link from 'next/link';

interface UnitCardProps {
  unit: {
    id: string;
    title: string;
    theme: string;
  };
}

export function UnitCard({ unit }: UnitCardProps) {
  return (
    <Link href={`/professor/unidades/${unit.id}/plano`}>
      <div className="card hover:shadow-lg transition cursor-pointer">
        <h3 className="text-lg font-bold">{unit.title}</h3>
        <p className="text-gray-600 text-sm mt-2">Tema: {unit.theme}</p>
      </div>
    </Link>
  );
}
