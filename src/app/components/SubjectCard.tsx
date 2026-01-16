import Link from 'next/link';

interface SubjectCardProps {
  subject: {
    id: string;
    name: string;
    description?: string;
  };
}

export function SubjectCard({ subject }: SubjectCardProps) {
  return (
    <Link href={`/professor/disciplinas/${subject.id}`}>
      <div className="card hover:shadow-lg transition cursor-pointer">
        <h3 className="text-lg font-bold">{subject.name}</h3>
        {subject.description && (
          <p className="text-gray-600 text-sm mt-2">{subject.description}</p>
        )}
      </div>
    </Link>
  );
}
