import React, { useState, useRef } from 'react';
import { Plus, Star, Heart } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onViewDetails: (product: Product) => void;
  isWishlisted?: boolean;
  onToggleWishlist?: (product: Product) => void;
  onViewVendor?: (vendorId: string) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  onAddToCart, 
  onViewDetails, 
  isWishlisted = false, 
  onToggleWishlist,
  onViewVendor
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  
  const hasDiscount = product.originalPrice && product.originalPrice > product.price;
  const discountPercent = hasDiscount 
    ? Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100) 
    : 0;

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    // Fallback to a placeholder with the product name if the AI image fails
    const encodedName = encodeURIComponent(product.name);
    e.currentTarget.src = `https://placehold.co/800x800/f3f4f6/9ca3af?text=${encodedName}`;
    e.currentTarget.onerror = null; // Prevent infinite loop
  };
  
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Calculate rotation (-10 to 10 degrees)
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = ((y - centerY) / centerY) * -5;
    const rotateY = ((x - centerX) / centerX) * 5;
    
    setRotation({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotation({ x: 0, y: 0 });
  };

  // Determine images to show
  const primaryImage = product.imageUrl;
  const secondaryImage = product.images && product.images.length > 1 ? product.images[1] : primaryImage;

  return (
    <div 
      ref={cardRef}
      className="perspective-1000 h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div 
        className="bg-white rounded-2xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] border border-gray-100 overflow-hidden flex flex-col h-full relative transition-all duration-200 ease-out transform-style-3d will-change-transform"
        style={{
          transform: isHovered 
            ? `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) scale3d(1.02, 1.02, 1.02)` 
            : 'rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
          boxShadow: isHovered 
            ? '0 20px 40px -5px rgba(0, 0, 0, 0.15), 0 10px 20px -5px rgba(0, 0, 0, 0.1)' 
            : undefined
        }}
      >
        {/* Wishlist Button */}
        {onToggleWishlist && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleWishlist(product);
            }}
            className={`absolute top-3 right-3 z-20 p-2 rounded-full backdrop-blur-md transition-all duration-300 transform-style-3d ${
              isWishlisted 
                ? 'bg-red-50 text-red-500 shadow-sm' 
                : 'bg-white/70 text-gray-400 hover:bg-white hover:text-red-500'
            } ${isHovered ? 'translate-z-20' : ''}`}
            style={{ transform: isHovered ? 'translateZ(30px)' : 'translateZ(0px)' }}
          >
            <Heart size={18} fill={isWishlisted ? "currentColor" : "none"} />
          </button>
        )}

        {/* Sale Badge */}
        {hasDiscount && (
          <div 
            className="absolute top-3 left-3 z-20 bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-lg shadow-red-500/30 animate-pulse"
            style={{ transform: isHovered ? 'translateZ(30px)' : 'translateZ(0px)' }}
          >
            {discountPercent}% OFF
          </div>
        )}

        <div 
          className="relative h-56 overflow-hidden bg-gray-100 cursor-pointer group"
          onClick={() => onViewDetails(product)}
        >
          <img
            src={isHovered ? secondaryImage : primaryImage}
            alt={product.name}
            className={`w-full h-full object-cover transition-transform duration-700 ease-in-out ${isHovered && primaryImage === secondaryImage ? 'scale-110' : 'scale-100'}`}
            onError={handleImageError}
          />
          <div 
             className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-gray-700 shadow-sm border border-white/50 transition-transform duration-200"
             style={{ transform: isHovered ? 'translateZ(20px)' : 'translateZ(0px)' }}
          >
            {product.category}
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
        
        <div className="p-5 flex flex-col flex-grow bg-white relative z-10">
          <div className="mb-2">
            <div className="flex justify-between items-start">
              <h3 
                className="text-lg font-bold text-gray-900 line-clamp-1 hover:text-indigo-600 transition-colors duration-200 cursor-pointer" 
                onClick={() => onViewDetails(product)}
                title={product.name}
              >
                {product.name}
              </h3>
            </div>
            <button 
              onClick={(e) => {
                 e.stopPropagation();
                 if (onViewVendor) onViewVendor(product.vendorId);
              }}
              className="text-xs font-medium text-gray-400 mt-1 uppercase tracking-wider hover:text-indigo-600 hover:underline transition-colors text-left"
            >
              {product.vendorName}
            </button>
          </div>
          
          <div className="flex items-center mb-3">
            <div className="flex items-center bg-yellow-50 px-2 py-0.5 rounded-md border border-yellow-100">
              <Star className="w-3.5 h-3.5 text-yellow-500 fill-current" />
              <span className="ml-1 text-sm text-yellow-700 font-bold">{product.rating}</span>
            </div>
            <span className="ml-2 text-xs text-gray-400">({product.reviewsCount} reviews)</span>
          </div>

          <p className="text-sm text-gray-600 mb-4 line-clamp-2 flex-grow leading-relaxed cursor-pointer" onClick={() => onViewDetails(product)}>
            {product.description}
          </p>

          <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
            <div className="flex flex-col">
              {hasDiscount && (
                <span className="text-xs text-gray-400 line-through font-medium">
                  ${product.originalPrice?.toFixed(2)}
                </span>
              )}
              <span className={`text-xl font-bold ${hasDiscount ? 'text-red-600' : 'text-gray-900'}`}>
                ${product.price.toFixed(2)}
              </span>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                const button = e.currentTarget;
                button.classList.add('scale-95');
                setTimeout(() => button.classList.remove('scale-95'), 150);
                onAddToCart(product);
              }}
              className="group/btn flex items-center justify-center w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-600 hover:text-white transition-all duration-300 shadow-sm hover:shadow-indigo-500/30"
              aria-label="Add to cart"
              style={{ transform: isHovered ? 'translateZ(10px)' : 'translateZ(0px)' }}
            >
              <Plus size={22} className="transition-transform group-hover/btn:rotate-90 duration-300" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;