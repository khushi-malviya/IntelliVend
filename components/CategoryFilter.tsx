import React from 'react';
import { Filter, ChevronDown } from 'lucide-react';

interface CategoryFilterProps {
  categories: string[];
  activeCategory: string;
  onSelectCategory: (category: string) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  activeCategory,
  onSelectCategory,
  sortBy,
  onSortChange,
}) => {
  return (
    <div className="bg-white border-b border-gray-200 sticky top-20 z-40 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Categories Scrollable List */}
        <div className="w-full sm:w-auto overflow-x-auto no-scrollbar flex items-center gap-2 pb-2 sm:pb-0">
          <button
            onClick={() => onSelectCategory('All')}
            className={`whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
              activeCategory === 'All'
                ? 'bg-gray-900 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            All Products
          </button>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => onSelectCategory(category)}
              className={`whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                activeCategory === category
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <span className="text-sm text-gray-500 font-medium">Sort by:</span>
          <div className="relative group">
            <button className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:border-gray-400">
              {sortBy === 'featured' && 'Featured'}
              {sortBy === 'price_low' && 'Price: Low to High'}
              {sortBy === 'price_high' && 'Price: High to Low'}
              {sortBy === 'rating' && 'Avg. Customer Review'}
              <ChevronDown size={14} />
            </button>
            <div className="absolute right-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 overflow-hidden">
              <button onClick={() => onSortChange('featured')} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Featured</button>
              <button onClick={() => onSortChange('price_low')} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Price: Low to High</button>
              <button onClick={() => onSortChange('price_high')} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Price: High to Low</button>
              <button onClick={() => onSortChange('rating')} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Avg. Customer Review</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryFilter;
