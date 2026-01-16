interface StatCardProps {
  title: string;
  value: number | string;
}

export function StatCard({ title, value }: StatCardProps) {
  return (
    <div className="card">
      <h3 className="text-gray-600 text-sm font-medium">{title}</h3>
      <p className="text-3xl font-bold mt-2">{value}</p>
    </div>
  );
}
