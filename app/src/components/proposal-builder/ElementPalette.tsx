'use client';

import { useState } from 'react';
import { ELEMENT_METADATA, ELEMENT_CATEGORIES, type ElementType } from '@/types/proposal';
import { Search } from 'lucide-react';

interface ElementPaletteProps {
  onAddElement: (elementType: ElementType) => void;
}

export function ElementPalette({ onAddElement }: ElementPaletteProps) {
  const [searchQuery, setSearchQuery] = useState('');

  // Filter elements by search query
  const filteredElements = ELEMENT_METADATA.filter((element) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      element.label.toLowerCase().includes(query) ||
      element.description?.toLowerCase().includes(query)
    );
  });

  // Group elements by category
  const groupedElements = filteredElements.reduce(
    (acc, element) => {
      if (!acc[element.category]) {
        acc[element.category] = [];
      }
      acc[element.category].push(element);
      return acc;
    },
    {} as Record<string, typeof ELEMENT_METADATA>
  );

  return (
    <div className="w-60 bg-gray-800 border-r border-gray-700 flex flex-col overflow-hidden">
      {/* Search */}
      <div className="p-4 border-b border-gray-700">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search elements..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-3 py-2 bg-gray-900 border border-gray-600 rounded text-sm text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Elements by Category */}
      <div className="flex-1 overflow-y-auto p-4">
        {Object.entries(groupedElements).map(([category, elements]) => (
          <div key={category} className="mb-6">
            <h4 className="text-xs font-semibold text-gray-400 uppercase mb-2">
              {ELEMENT_CATEGORIES[category as keyof typeof ELEMENT_CATEGORIES]}
            </h4>
            <div className="space-y-1">
              {elements.map((element) => (
                <button
                  key={element.type}
                  onClick={() => onAddElement(element.type)}
                  className="w-full flex items-center gap-3 p-2 bg-gray-700 hover:bg-gray-600 border border-gray-600 hover:border-blue-500 rounded text-left transition-colors"
                  title={element.description}
                >
                  <span className="text-lg">{element.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-white truncate">
                      {element.label}
                    </div>
                    {element.description && (
                      <div className="text-xs text-gray-400 truncate">
                        {element.description}
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))}

        {filteredElements.length === 0 && (
          <div className="text-center text-gray-400 text-sm mt-8">
            No elements match your search
          </div>
        )}
      </div>
    </div>
  );
}
