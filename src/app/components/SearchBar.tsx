'use client';

import { useState } from 'react';

interface SearchBarProps {
  placeholder?: string;
  onSearch: (query: string) => void;
  onFilterChange?: (filter: string) => void;
  filters?: Array<{ value: string; label: string }>;
  className?: string;
}

/**
 * Componente de busca e filtros
 * 
 * Características:
 * - Busca em tempo real
 * - Filtros opcionais
 * - Design moderno e limpo
 * - Responsivo
 */
export function SearchBar({ 
  placeholder = 'Buscar...', 
  onSearch, 
  onFilterChange,
  filters,
  className = '' 
}: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('');

  const handleSearch = (value: string) => {
    setQuery(value);
    onSearch(value);
  };

  const handleFilterChange = (value: string) => {
    setSelectedFilter(value);
    onFilterChange?.(value);
  };

  return (
    <div className={`flex gap-3 ${className}`}>
      {/* Campo de Busca */}
      <div className="flex-1 relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <span className="text-gray-400 text-xl">🔍</span>
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-white shadow-sm hover:shadow-md"
        />
        {query && (
          <button
            onClick={() => handleSearch('')}
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Limpar busca"
          >
            <span className="text-xl">✕</span>
          </button>
        )}
      </div>

      {/* Filtros */}
      {filters && filters.length > 0 && (
        <select
          value={selectedFilter}
          onChange={(e) => handleFilterChange(e.target.value)}
          className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-white shadow-sm hover:shadow-md cursor-pointer"
        >
          <option value="">Todos</option>
          {filters.map((filter) => (
            <option key={filter.value} value={filter.value}>
              {filter.label}
            </option>
          ))}
        </select>
      )}
    </div>
  );
}
