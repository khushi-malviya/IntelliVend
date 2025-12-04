import React, { useState, useEffect } from 'react';
import { X, Star, Truck, ShieldCheck, Heart, ShoppingCart, ArrowRight, MessageSquare, Send } from 'lucide-react';
import { Product, User } from '../types';
import { db } from '../services/db';

interface ProductDetailsModalProps {
  product: Product;
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
  isWishlisted: boolean;
  onToggleWishlist: (product: Product) => void;
  onReviewAdded: () => void; // Callback to refresh parent
  onViewVendor?: (vendorId: string) => void;
}

const ProductDetailsModal: React.FC<ProductDetailsModalProps> = ({
  product,
  user,
  isOpen,
  onClose,
  onAddToCart,
  isWishlisted,
  onToggleWishlist,
  onReviewAdded,
  onViewVendor
}) => {
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedImage, setSelectedImage] = useState(product.imageUrl);

  // Update selected image when product changes
  useEffect(() => {
    setSelectedImage(product.imageUrl);
  }, [product]);

  if (!isOpen) return null;

  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + 3);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return; // Should likely prompt login
    setIsSubmitting(true);

    await db.addReview(product.id, {
      id: Date.now().toString(),
      userId: user.id,
      userName: user.name,
      rating: newReview.rating,
      comment: newReview.comment,
      date: new Date().toLocaleDateString()
    });

    setNewReview({ rating: 5, comment: '' });
    setIsSubmitting(false);
    onReviewAdded();
  };
  
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const encodedName = encodeURIComponent(product.name);
    e.currentTarget.src = `https://placehold.co/800x800/f3f4f6/9ca3af?text=${encodedName}`;
    e.currentTarget.onerror = null;
  };

  const reviews = product.reviews || [];
  const images = product.images && product.images.length > 0 ? product.images : [product.imageUrl];
  
  // Logic for display price
  const hasDiscount = product.originalPrice && product.originalPrice > product.price;
  const originalPrice = product.originalPrice || product.price * 1.2; 
  const discountPercent = hasDiscount 
    ? Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100) 
    : 0;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-0 md:p-4 overflow-y-auto">
      <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-white md:rounded-3xl shadow-2xl w-full max-w-6xl h-full md:h-[90vh] overflow-hidden flex flex-col md:flex-row animate-slide-up">
        
        <button onClick={onClose} className="absolute top-4 right-4 z-10 p-2 bg-white/50 hover:bg-white rounded-full transition-colors backdrop-blur-sm">
          <X size={24} className="text-gray-800" />
        </button>

        {/* Left Side - Images */}
        <div className="w-full md:w-1/2 bg-gray-50 flex flex-col">
          {/* Main Image */}
          <div className="flex-1 flex items-center justify-center p-8 relative">
            <img 
              src={selectedImage} 
              alt={product.name} 
              className="w-full h-full object-contain mix-blend-multiply transition-transform duration-500 hover:scale-105" 
              onError={handleImageError}
            />
          </div>
          
          {/* Gallery Thumbnails */}
          {images.length > 1 && (
             <div className="p-4 flex gap-3 overflow-x-auto justify-center bg-gray-100/50">
               {images.map((img, idx) => (
                 <button 
                   key={idx}
                   onClick={() => setSelectedImage(img)}
                   className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${selectedImage === img ? 'border-indigo-600 scale-105 shadow-md' : 'border-transparent opacity-70 hover:opacity-100'}`}
                 >
                   <img src={img} alt={`View ${idx}`} className="w-full h-full object-cover" onError={handleImageError} />
                 </button>
               ))}
             </div>
          )}
        </div>

        {/* Right Side - Info */}
        <div className="w-full md:w-1/2 p-8 md:p-10 overflow-y-auto">
          
          <div className="flex justify-between items-start mb-4">
            <div>
              <button 
                onClick={() => {
                   if (onViewVendor) {
                     onViewVendor(product.vendorId);
                     onClose();
                   }
                }}
                className="text-sm font-semibold text-indigo-600 uppercase tracking-wide hover:underline"
              >
                {product.vendorName}
              </button>
              <h1 className="text-3xl font-bold text-gray-900 mt-1">{product.name}</h1>
            </div>
            <button 
              onClick={() => onToggleWishlist(product)}
              className={`p-3 rounded-full border transition-all ${isWishlisted ? 'bg-red-50 border-red-200 text-red-500' : 'bg-gray-50 border-gray-200 text-gray-400 hover:text-gray-600'}`}
            >
              <Heart size={24} fill={isWishlisted ? "currentColor" : "none"} />
            </button>
          </div>

          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center gap-1 text-yellow-500">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={18} fill={i < Math.floor(product.rating) ? "currentColor" : "none"} className={i >= Math.floor(product.rating) ? "text-gray-300" : ""} />
              ))}
              <span className="text-gray-900 font-bold ml-1">{product.rating}</span>
            </div>
            <span className="text-gray-400">|</span>
            <span className="text-indigo-600 font-medium hover:underline cursor-pointer">{product.reviewsCount} Ratings & Reviews</span>
          </div>

          <div className="border-t border-b border-gray-100 py-6 mb-6">
            <div className="flex items-end gap-3 mb-2">
              <span className={`text-4xl font-bold ${hasDiscount ? 'text-red-600' : 'text-gray-900'}`}>
                ${product.price.toFixed(2)}
              </span>
              {hasDiscount && (
                <>
                  <span className="text-lg text-gray-400 line-through mb-1">${product.originalPrice?.toFixed(2)}</span>
                  <span className="text-white font-bold mb-1 text-sm bg-red-500 px-2 py-0.5 rounded shadow-sm">{discountPercent}% OFF</span>
                </>
              )}
            </div>
            <p className="text-sm text-gray-500">Inclusive of all taxes</p>
          </div>

          <div className="space-y-4 mb-8">
            <h3 className="font-semibold text-gray-900">Description</h3>
            <p className="text-gray-600 leading-relaxed">
              {product.description}
            </p>
            
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-xl">
                <Truck className="text-blue-600 mt-0.5" size={20} />
                <div>
                  <p className="text-sm font-bold text-gray-900">Free Delivery</p>
                  <p className="text-xs text-gray-500">By {deliveryDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-xl">
                <ShieldCheck className="text-purple-600 mt-0.5" size={20} />
                <div>
                  <p className="text-sm font-bold text-gray-900">1 Year Warranty</p>
                  <p className="text-xs text-gray-500">Official Brand Warranty</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-4 mb-10">
            <button 
              onClick={() => onAddToCart(product)}
              className="flex-1 py-4 rounded-xl border-2 border-indigo-600 text-indigo-700 font-bold hover:bg-indigo-50 transition-colors flex items-center justify-center gap-2"
            >
              <ShoppingCart size={20} /> Add to Cart
            </button>
            <button 
              onClick={() => {
                onAddToCart(product);
                onClose();
                window.dispatchEvent(new CustomEvent('initCheckout'));
              }}
              className="flex-1 py-4 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 shadow-xl shadow-indigo-500/30 transition-all flex items-center justify-center gap-2"
            >
              Buy Now <ArrowRight size={20} />
            </button>
          </div>

          {/* Reviews Section */}
          <div className="space-y-6">
            <h3 className="font-bold text-lg text-gray-900">Customer Reviews</h3>
            
            {/* Write Review */}
            {user ? (
              <form onSubmit={handleSubmitReview} className="bg-gray-50 p-4 rounded-xl border border-gray-100 mb-6">
                <h4 className="text-sm font-bold text-gray-700 mb-2">Write a review</h4>
                <div className="flex gap-1 mb-3">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setNewReview({ ...newReview, rating: star })}
                      className="text-yellow-400 focus:outline-none transition-transform hover:scale-110"
                    >
                      <Star size={20} fill={star <= newReview.rating ? "currentColor" : "none"} className={star > newReview.rating ? "text-gray-300" : ""} />
                    </button>
                  ))}
                </div>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={newReview.comment}
                    onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                    placeholder="Share your thoughts about this product..."
                    className="w-full pl-4 pr-12 py-3 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                  />
                  <button 
                    type="submit"
                    disabled={isSubmitting || !newReview.comment.trim()}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                  >
                    <Send size={16} />
                  </button>
                </div>
              </form>
            ) : (
              <div className="bg-blue-50 p-4 rounded-xl text-sm text-blue-700 mb-6">
                Please sign in to leave a review.
              </div>
            )}

            {reviews.length > 0 ? reviews.map(review => (
              <div key={review.id} className="border-b border-gray-100 pb-4 last:border-0 animate-fade-in">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-gray-200 to-gray-300 flex items-center justify-center text-xs font-bold text-gray-600">
                      {review.userName.charAt(0)}
                    </div>
                    <div>
                      <span className="font-semibold text-gray-900 text-sm block">{review.userName}</span>
                      <span className="text-xs text-gray-400">{review.date}</span>
                    </div>
                  </div>
                  <div className="flex text-yellow-500 scale-75 origin-right">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={16} fill={i < review.rating ? "currentColor" : "none"} className={i >= review.rating ? "text-gray-300" : ""} />
                    ))}
                  </div>
                </div>
                <p className="text-gray-600 text-sm ml-10">{review.comment}</p>
              </div>
            )) : (
              <div className="text-center py-8 text-gray-400">
                <MessageSquare className="mx-auto mb-2 opacity-50" />
                No reviews yet. Be the first to review!
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProductDetailsModal;