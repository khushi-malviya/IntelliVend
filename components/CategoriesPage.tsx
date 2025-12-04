import React from 'react';
import { ArrowRight, Tag } from 'lucide-react';
import { CATEGORIES_DATA } from '../constants';

interface CategoriesPageProps {
  onSelectCategory: (category: string) => void;
}

const CategoriesPage: React.FC<CategoriesPageProps> = ({ onSelectCategory }) => {
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const category = e.currentTarget.alt || 'Category';
    e.currentTarget.src = `https://placehold.co/600x400/f3f4f6/9ca3af?text=${encodeURIComponent(category)}`;
    e.currentTarget.onerror = null;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Explore Categories</h1>
        <p className="text-gray-500 mt-2">Find exactly what you are looking for in our diverse collections.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {CATEGORIES_DATA.map((cat, idx) => (
          <div 
            key={idx}
            className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col h-full"
          >
            {/* Header / Image Area */}
            <div 
               onClick={() => onSelectCategory(cat.name)}
               className="relative h-48 sm:h-64 cursor-pointer group overflow-hidden"
            >
              <div className="absolute inset-0 bg-gray-900/20 group-hover:bg-gray-900/30 transition-colors z-10" />
              <img 
                src={cat.image} 
                alt={cat.name} 
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                onError={handleImageError}
              />
              <div className="absolute bottom-0 left-0 right-0 p-6 z-20 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                 <div className="flex justify-between items-center">
                    <h3 className="text-3xl font-bold text-white tracking-tight">{cat.name}</h3>
                    <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 transition-all duration-300">
                      <ArrowRight size={20} />
                    </div>
                 </div>
              </div>
            </div>

            {/* Sub-categories List */}
            <div className="p-6 flex-1 bg-gray-50/50">
              <p className="text-sm font-semibold text-gray-500 mb-3 flex items-center gap-2">
                <Tag size={14} /> Popular in {cat.name}
              </p>
              <div className="flex flex-wrap gap-2">
                {cat.subCategories && cat.subCategories.length > 0 ? (
                  cat.subCategories.map((sub, sIdx) => (
                    <span 
                      key={sIdx} 
                      className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 font-medium hover:border-indigo-300 hover:text-indigo-600 transition-colors cursor-default"
                    >
                      {sub}
                    </span>
                  ))
                ) : (
                  <span className="text-sm text-gray-400 italic">No sub-categories</span>
                )}
              </div>
            </div>
            
            <div className="px-6 pb-6 pt-2 bg-gray-50/50">
               <button 
                onClick={() => onSelectCategory(cat.name)}
                className="w-full py-3 bg-white border border-gray-200 rounded-xl text-indigo-600 font-bold hover:bg-indigo-50 hover:border-indigo-200 transition-colors shadow-sm"
               >
                 Shop {cat.name}
               </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoriesPage;