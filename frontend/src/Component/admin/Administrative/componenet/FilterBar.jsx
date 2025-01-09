import React from 'react';
import { Search, Filter } from 'lucide-react';

export default function FilterBar({ 
  filters, 
  onFilterChange, 
  searchQuery, 
  onSearchChange,
  onFilterSubmit 
}) {
  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow mb-6">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4">
          {filters.map((filter) => (
            <div key={filter.key} className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {filter.label}
              </label>
              {filter.type === 'select' ? (
                <select
                  value={filter.value}
                  onChange={(e) => onFilterChange(filter.key, e.target.value)}
                  className="w-full p-2 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                >
                  <option value="">All</option>
                  {filter.options.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type={filter.type}
                  value={filter.value}
                  onChange={(e) => onFilterChange(filter.key, e.target.value)}
                  className="w-full p-2 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                  placeholder={filter.placeholder}
                />
              )}
            </div>
          ))}

          <button
            onClick={onFilterSubmit}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Filter className="w-4 h-4" />
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
}