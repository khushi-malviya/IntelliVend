import React from 'react';
import { CATEGORIES_DATA } from '../constants';
import { ArrowRight, Star } from 'lucide-react';

interface Showcase3DProps {
  onSelectCategory: (category: string) => void;
}

const Showcase3D: React.FC<Showcase3DProps> = ({ onSelectCategory }) => {
  const categories = CATEGORIES_DATA.slice(0, 6); // Take top 6
  
  // Calculate positioning for 3D circle
  const itemCount = categories.length;
  const radius = 320; // Distance from center
  const angleStep = 360 / itemCount;

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>, categoryName: string) => {
    e.currentTarget.src = `https://placehold.co/400x600/1e293b/ffffff?text=${encodeURIComponent(categoryName)}`;
    e.currentTarget.onerror = null;
  };

  return (
    <div className="w-full overflow-hidden py-16 bg-gray-900 relative">
      {/* Background Gradients */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-indigo-950 to-gray-900 opacity-80"></div>
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

      <div className="relative z-10 text-center mb-12">
         <span className="text-indigo-400 font-bold tracking-widest text-xs uppercase mb-2 block">Immersive Experience</span>
         <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Trending Collections</h2>
         <p className="text-indigo-200 max-w-lg mx-auto">Explore our premium categories in a whole new dimension.</p>
      </div>

      <div className="h-[400px] w-full flex items-center justify-center perspective-1000 relative">
        <div className="relative w-[280px] h-[360px] transform-style-3d animate-spin-3d pause-hover">
            {categories.map((cat, index) => (
                <div 
                    key={index}
                    onClick={() => onSelectCategory(cat.name)}
                    className="absolute inset-0 rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-gray-800/90 backdrop-blur-sm group hover:border-indigo-500/50 transition-colors cursor-pointer"
                    style={{
                        transform: `rotateY(${index * angleStep}deg) translateZ(${radius}px)`,
                    }}
                >
                    <div className="relative h-2/3 overflow-hidden">
                        <img 
                            src={cat.image} 
                            alt={cat.name} 
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                            onError={(e) => handleImageError(e, cat.name)}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>
                        <div className="absolute top-2 right-2 bg-white/20 backdrop-blur-md rounded-full px-2 py-0.5 text-xs text-white font-bold flex items-center gap-1">
                            <Star size={10} className="fill-yellow-400 text-yellow-400" /> 4.9
                        </div>
                    </div>
                    
                    <div className="p-5 text-left relative z-10">
                        <h3 className="text-xl font-bold text-white mb-1">{cat.name}</h3>
                        <div className="flex flex-wrap gap-1 mb-3">
                            {cat.subCategories.slice(0, 2).map((sub, i) => (
                                <span key={i} className="text-[10px] text-gray-400 bg-white/5 px-2 py-0.5 rounded-full">{sub}</span>
                            ))}
                        </div>
                        <button 
                          className="text-sm text-indigo-400 font-bold flex items-center gap-1 group-hover:gap-2 transition-all"
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectCategory(cat.name);
                          }}
                        >
                            Explore <ArrowRight size={14} />
                        </button>
                    </div>

                    {/* Gloss Effect */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent pointer-events-none"></div>
                </div>
            ))}
        </div>
      </div>
      
      {/* Decorative Floor */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-indigo-500/20 filter blur-[100px] rounded-[100%] pointer-events-none"></div>
    </div>
  );
};

export default Showcase3D;