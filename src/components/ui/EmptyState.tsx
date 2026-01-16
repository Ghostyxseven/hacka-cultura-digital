// src/components/ui/EmptyState.tsx

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="text-center py-12">
      <p className="text-gray-500 mb-4">{title}</p>
      {description && <p className="text-sm text-gray-400 mb-4">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
