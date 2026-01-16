export function StatsSection() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
      <div className="card">
        <h3 className="text-gray-600 text-sm font-medium">Disciplinas</h3>
        <p className="text-3xl font-bold mt-2">0</p>
      </div>
      <div className="card">
        <h3 className="text-gray-600 text-sm font-medium">Unidades</h3>
        <p className="text-3xl font-bold mt-2">0</p>
      </div>
      <div className="card">
        <h3 className="text-gray-600 text-sm font-medium">Planos de Aula</h3>
        <p className="text-3xl font-bold mt-2">0</p>
      </div>
    </div>
  );
}
