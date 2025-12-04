import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, Sparkles, Zap, Globe } from 'lucide-react';
import { Product } from '../types';

interface HeroSectionProps {
  onNavigateDeals: () => void;
  featuredProducts: Product[];
}

const HeroSection: React.FC<HeroSectionProps> = ({ onNavigateDeals, featuredProducts }) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [typedText, setTypedText] = useState('');
  const fullText = "The Future of Retail.";
  const containerRef = useRef<HTMLDivElement>(null);

  // Typing effect
  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setTypedText(fullText.slice(0, index));
      index++;
      if (index > fullText.length) clearInterval(interval);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  // Mouse parallax effect
  const handleMouseMove = (e: React.MouseEvent) => {
    if (containerRef.current) {
      const { left, top, width, height } = containerRef.current.getBoundingClientRect();
      const x = (e.clientX - left) / width;
      const y = (e.clientY - top) / height;
      setMousePos({ x, y });
    }
  };

  const images = featuredProducts.slice(0, 3).map(p => p.imageUrl);
  
  // Fallback images if no products - using reliable Unsplash IDs matching constants
  const displayImages = images.length >= 3 ? images : [
    'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80', // Earbuds
    'https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&w=800&q=80', // Chair
    'https://images.unsplash.com/photo-1602143407151-01114192008b?auto=format&fit=crop&w=800&q=80'  // Bottle
  ];

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative w-full h-[500px] md:h-[600px] bg-gray-900 rounded-3xl overflow-hidden shadow-2xl mb-12 group perspective-1000"
    >
      {/* Animated Background Gradients */}
      <div className="absolute inset-0 bg-gray-900">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
      </div>

      {/* Floating 3D Elements */}
      <div 
        className="absolute inset-0 z-10 transition-transform duration-100 ease-out"
        style={{ transform: `translate(${mousePos.x * -20}px, ${mousePos.y * -20}px)` }}
      >
         {/* Floating Product Bubble 1 */}
         <div className="absolute top-10 right-10 md:right-20 w-32 h-32 md:w-48 md:h-48 rounded-full border-4 border-white/20 overflow-hidden shadow-2xl animate-float glass">
           <img src={displayImages[0]} className="w-full h-full object-cover opacity-90" alt="" />
         </div>

         {/* Floating Product Bubble 2 */}
         <div className="absolute bottom-20 right-40 md:right-1/4 w-24 h-24 md:w-36 md:h-36 rounded-full border-4 border-white/20 overflow-hidden shadow-2xl animate-float-delayed glass">
           <img src={displayImages[1]} className="w-full h-full object-cover opacity-90" alt="" />
         </div>

         {/* Floating Product Bubble 3 */}
         <div className="hidden md:block absolute top-1/2 right-10 w-20 h-20 rounded-full border-4 border-white/20 overflow-hidden shadow-2xl animate-float glass" style={{ animationDelay: '2s' }}>
           <img src={displayImages[2]} className="w-full h-full object-cover opacity-90" alt="" />
         </div>
      </div>

      {/* Content */}
      <div className="absolute inset-0 z-20 flex items-center px-8 md:px-16">
        <div 
           className="max-w-2xl"
           style={{ transform: `translate(${mousePos.x * 10}px, ${mousePos.y * 10}px)` }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-indigo-200 text-sm font-semibold mb-6 animate-fade-in">
            <Sparkles size={14} className="text-yellow-400" /> 
            <span>AI-Powered Shopping Experience</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight tracking-tight">
             <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-200 via-white to-indigo-200 animate-text-shimmer">
               {typedText}
             </span>
             <span className="animate-pulse text-indigo-400">|</span>
          </h1>

          <p className="text-lg md:text-xl text-indigo-100 mb-8 max-w-lg leading-relaxed opacity-0 animate-slide-up" style={{ animationDelay: '500ms' }}>
            Discover a curated marketplace where artificial intelligence helps you find exactly what you need, instantly.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 opacity-0 animate-slide-up" style={{ animationDelay: '700ms' }}>
            <button 
              onClick={onNavigateDeals}
              className="px-8 py-4 bg-white text-indigo-900 rounded-full font-bold hover:bg-indigo-50 transition-all shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] flex items-center justify-center gap-2 group"
            >
              Start Exploring <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
            
            <div className="flex items-center gap-4 px-6 py-4 rounded-full glass text-white font-medium cursor-default">
              <Globe size={20} className="text-indigo-300" />
              <span>Global Shipping</span>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-gray-900 to-transparent z-10"></div>
    </div>
  );
};

export default HeroSection;