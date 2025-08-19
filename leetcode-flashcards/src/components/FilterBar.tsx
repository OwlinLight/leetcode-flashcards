'use client';

import { FilterOptions, Difficulty, Status } from '@/types/flashcard';

interface FilterBarProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  onClearFilters: () => void;
}

export default function FilterBar({ filters, onFiltersChange, onClearFilters }: FilterBarProps) {
  const handleFilterChange = (key: keyof FilterOptions, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl mb-8 border border-white/20">
      <div className="flex flex-wrap gap-6 items-end">
        <div className="flex flex-col min-w-[120px]">
          <label className="text-sm font-medium text-gray-700 mb-2">Difficulty</label>
          <select
            value={filters.difficulty}
            onChange={(e) => handleFilterChange('difficulty', e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all bg-white shadow-sm"
          >
            <option value="all">All</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>

        <div className="flex flex-col min-w-[120px]">
          <label className="text-sm font-medium text-gray-700 mb-2">Status</label>
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all bg-white shadow-sm"
          >
            <option value="all">All</option>
            <option value="new">New</option>
            <option value="learning">Learning</option>
            <option value="review">Review</option>
            <option value="mastered">Mastered</option>
          </select>
        </div>

        <div className="flex flex-col min-w-[150px]">
          <label className="text-sm font-medium text-gray-700 mb-2">Due Date</label>
          <input
            type="date"
            value={filters.dateFilter}
            onChange={(e) => handleFilterChange('dateFilter', e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all bg-white shadow-sm"
          />
        </div>

        <button
          onClick={onClearFilters}
          className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200 font-medium border border-gray-200 shadow-sm"
        >
          Clear Filters
        </button>
      </div>
    </div>
  );
}