'use client';

interface TabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  tabs: Array<{
    id: string;
    label: string;
    icon?: string;
  }>;
}

/**
 * Componente de abas (tabs) reutilizável
 * Usado para organizar conteúdo em seções (Plano, Atividade, Slides)
 */
export function Tabs({ activeTab, onTabChange, tabs }: TabsProps) {
  return (
    <div className="border-b border-gray-200 mb-6">
      <nav className="flex space-x-8" aria-label="Tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`
              py-4 px-1 border-b-2 font-medium text-sm transition-colors
              ${
                activeTab === tab.id
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }
            `}
          >
            {tab.icon && <span className="mr-2">{tab.icon}</span>}
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  );
}
