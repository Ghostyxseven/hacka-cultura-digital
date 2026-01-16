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
    <div className="border-b-2 border-gray-200 mb-6 bg-white rounded-t-xl">
      <nav className="flex space-x-2" aria-label="Tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`
              relative py-4 px-6 font-semibold text-sm transition-all duration-200 transform
              ${
                activeTab === tab.id
                  ? 'text-indigo-700 bg-indigo-50 rounded-t-xl'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-t-xl'
              }
            `}
          >
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-t-full"></div>
            )}
            <span className="flex items-center gap-2">
              {tab.icon && <span className="text-lg">{tab.icon}</span>}
              <span>{tab.label}</span>
            </span>
          </button>
        ))}
      </nav>
    </div>
  );
}
