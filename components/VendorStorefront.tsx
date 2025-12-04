import React from 'react';
import { User, Product } from '../types';
import { Store, Star, Package, MapPin, Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import ProductCard from './ProductCard';

interface VendorStorefrontProps {
  vendor: User;
  products: Product[];
  onAddToCart: (product: Product) => void;
  onViewDetails: (product: Product) => void;
  isWishlisted: (id: string) => boolean;
  onToggleWishlist: (product: Product) => void;
  onBack: () => void;
}

const VendorStorefront: React.FC<VendorStorefrontProps> = ({
  vendor,
  products,
  onAddToCart,
  onViewDetails,
  isWishlisted,
  onToggleWishlist,
  onBack
}) => {
  // Calculate stats
  const totalReviews = products.reduce((acc, curr) => acc + curr.reviewsCount, 0);
  const avgRating = products.length > 0 
    ? (products.reduce((acc, curr) => acc + curr.rating, 0) / products.length).toFixed(1) 
    : 'New';

  return (
    <div className="min-h-screen bg-gray-50 pb-20 animate-fade-in">
      {/* Banner / Header */}
      <div className="relative h-64 bg-gradient-to-r from-indigo-800 to-purple-900 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-between py-6 relative z-10">
          <button 
            onClick={onBack}
            className="self-start flex items-center gap-2 text-white/80 hover:text-white transition-colors bg-black/20 hover:bg-black/30 px-4 py-2 rounded-full backdrop-blur-sm"
          >
            <ArrowLeft size={18} /> Back to Marketplace
          </button>
        </div>
      </div>

      {/* Profile Section - Overlapping Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-20">
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 flex flex-col md:flex-row gap-6 md:gap-8 items-start">
          
          {/* Avatar */}
          <div className="w-32 h-32 md:w-40 md:h-40 rounded-2xl bg-white p-1.5 shadow-lg -mt-16 md:-mt-24 flex-shrink-0">
            <img 
              src={vendor.avatarUrl} 
              alt={vendor.name} 
              className="w-full h-full object-cover rounded-xl bg-gray-100"
            />
          </div>

          {/* Info */}
          <div className="flex-1 w-full">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                  {vendor.name}
                  <CheckCircle size={24} className="text-blue-500 fill-blue-50" />
                </h1>
                <p className="text-gray-500 font-medium">Verified Vendor</p>
              </div>
              <div className="flex gap-3">
                 <div className="flex flex-col items-center px-6 py-2 bg-gray-50 rounded-xl border border-gray-100">
                    <span className="text-2xl font-bold text-gray-900">{products.length}</span>
                    <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">Products</span>
                 </div>
                 <div className="flex flex-col items-center px-6 py-2 bg-gray-50 rounded-xl border border-gray-100">
                    <span className="text-2xl font-bold text-gray-900">{avgRating}</span>
                    <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">Rating</span>
                 </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
              {vendor.address?.city && (
                <div className="flex items-center gap-1.5">
                  <MapPin size={16} className="text-indigo-500" />
                  {vendor.address.city}, {vendor.address.state}
                </div>
              )}
              <div className="flex items-center gap-1.5">
                <Store size={16} className="text-indigo-500" />
                Member since 2023
              </div>
              <div className="flex items-center gap-1.5">
                <Mail size={16} className="text-indigo-500" />
                Contact Seller
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <Package className="text-indigo-600" /> Shop All Products
        </h2>
        
        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map((product, idx) => (
              <div key={product.id} className="animate-slide-up" style={{ animationDelay: `${idx * 50}ms` }}>
                <ProductCard 
                  product={product} 
                  onAddToCart={onAddToCart}
                  onViewDetails={onViewDetails}
                  isWishlisted={isWishlisted(product.id)}
                  onToggleWishlist={onToggleWishlist}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-12 text-center border border-dashed border-gray-200">
            <Package size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-bold text-gray-900">No products found</h3>
            <p className="text-gray-500">This vendor hasn't listed any products yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VendorStorefront;