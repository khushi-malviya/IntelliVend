import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Plus, Wand2, Package, DollarSign, TrendingUp, Loader2, Image as ImageIcon, Upload, RefreshCw, Star, Edit3, Trash2, X, Move, ChevronDown } from 'lucide-react';
import { Product, SalesStat, User } from '../types';
import { generateProductDescription } from '../services/geminiService';
import { db } from '../services/db';
import { CATEGORIES_DATA } from '../constants';

interface VendorDashboardProps {
  products: Product[];
  stats: SalesStat[];
  onAddProduct: (product: Product) => void;
  onUpdateProduct: (product: Product) => void;
  onDeleteProduct: (id: string) => void;
  vendor: User;
}

const VendorDashboard: React.FC<VendorDashboardProps> = ({ 
  products, 
  onAddProduct, 
  onUpdateProduct, 
  onDeleteProduct,
  vendor 
}) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [productForm, setProductForm] = useState<Partial<Product>>({
    name: '',
    category: '',
    subCategory: '',
    price: 0,
    originalPrice: 0,
    description: '',
    images: [],
  });
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [dashboardStats, setDashboardStats] = useState<SalesStat[]>([]);
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const fetchStats = async () => {
    setIsLoadingStats(true);
    const s = await db.getVendorStats(vendor.id);
    setDashboardStats(s);
    setIsLoadingStats(false);
  };

  useEffect(() => {
    fetchStats();
    const handleOrderUpdate = () => fetchStats();
    window.addEventListener('db-orders-changed', handleOrderUpdate);
    return () => window.removeEventListener('db-orders-changed', handleOrderUpdate);
  }, []);

  const openAddForm = () => {
    setEditingId(null);
    setProductForm({
      name: '',
      category: '',
      subCategory: '',
      price: 0,
      originalPrice: 0,
      description: '',
      images: [],
    });
    setIsFormOpen(true);
  };

  const openEditForm = (product: Product) => {
    setEditingId(product.id);
    setProductForm({
      name: product.name,
      category: product.category,
      subCategory: product.subCategory || '',
      price: product.price,
      originalPrice: product.originalPrice || 0,
      description: product.description,
      images: product.images && product.images.length > 0 ? product.images : [product.imageUrl],
    });
    setIsFormOpen(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGenerateDescription = async () => {
    if (!productForm.name || !productForm.category) {
      alert("Please enter a product name and category first.");
      return;
    }
    setIsGenerating(true);
    const desc = await generateProductDescription(
      productForm.name,
      productForm.category,
      "high quality, premium, best seller"
    );
    setProductForm(prev => ({ ...prev, description: desc }));
    setIsGenerating(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      Array.from(files).forEach((file: File) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setProductForm(prev => ({
            ...prev,
            images: [...(prev.images || []), reader.result as string]
          }));
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index: number) => {
    setProductForm(prev => {
      const newImages = [...(prev.images || [])];
      newImages.splice(index, 1);
      return { ...prev, images: newImages };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productForm.name || !productForm.price) return;

    // Use default AI image if none provided
    const finalImages = productForm.images && productForm.images.length > 0 
      ? productForm.images 
      : [`https://image.pollinations.ai/prompt/${encodeURIComponent(productForm.name)}?nologo=true`];

    const finalProductData = {
      name: productForm.name,
      description: productForm.description || '',
      price: Number(productForm.price),
      originalPrice: Number(productForm.originalPrice) || undefined,
      category: productForm.category || 'General',
      subCategory: productForm.subCategory,
      imageUrl: finalImages[0], // Main image is the first one
      images: finalImages,
    };

    if (editingId) {
      // Update existing
      const existingProduct = products.find(p => p.id === editingId);
      if (existingProduct) {
        const updatedProduct: Product = {
          ...existingProduct,
          ...finalProductData
        };
        onUpdateProduct(updatedProduct);
      }
    } else {
      // Create new
      const product: Product = {
        id: `p-${Date.now()}`,
        ...finalProductData,
        vendorId: vendor.id, 
        vendorName: vendor.name,
        rating: 0,
        reviewsCount: 0,
        reviews: []
      };
      onAddProduct(product);
    }

    setIsFormOpen(false);
    setProductForm({ name: '', category: '', subCategory: '', price: 0, originalPrice: 0, description: '', images: [] });
  };

  const totalRevenue = dashboardStats.reduce((acc, curr) => acc + curr.revenue, 0);
  const totalSales = dashboardStats.reduce((acc, curr) => acc + curr.sales, 0);

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const name = (e.currentTarget.getAttribute('alt') || 'Product').split(' ').slice(0, 2).join(' ');
    e.currentTarget.src = `https://placehold.co/400x400/f3f4f6/9ca3af?text=${encodeURIComponent(name)}`;
    e.currentTarget.onerror = null;
  };

  // Get available sub-categories based on selected category
  const activeCategoryData = CATEGORIES_DATA.find(c => c.name === productForm.category);
  const availableSubCategories = activeCategoryData ? activeCategoryData.subCategories : [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Vendor Dashboard</h1>
          <p className="text-gray-500 mt-1">Manage products and track performance.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={fetchStats} className="p-2.5 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 text-gray-600 transition-colors" title="Refresh Data">
            <RefreshCw size={20} className={isLoadingStats ? "animate-spin" : ""} />
          </button>
          <button
            onClick={() => isFormOpen ? setIsFormOpen(false) : openAddForm()}
            className={`group flex items-center gap-2 px-5 py-2.5 text-white rounded-xl transition-all shadow-lg ${isFormOpen ? 'bg-gray-700 hover:bg-gray-800' : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-500/30'}`}
          >
            {isFormOpen ? 'Cancel' : <><Plus size={20} className="group-hover:rotate-90 transition-transform" /> Add New Product</>}
          </button>
        </div>
      </div>

      {/* Add/Edit Product Form */}
      {isFormOpen && (
        <div className="bg-white rounded-2xl shadow-xl border border-indigo-50 p-6 md:p-8 animate-slide-up relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
          <h2 className="text-xl font-bold mb-6 text-gray-800">{editingId ? 'Edit Product' : 'Create New Listing'}</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Image Upload Section */}
              <div className="lg:col-span-1">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-semibold text-gray-700">Product Images</label>
                  <span className="text-xs text-gray-400">Main image is first</span>
                </div>
                
                <div className="grid grid-cols-2 gap-3 mb-3">
                  {productForm.images?.map((img, idx) => (
                    <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 group">
                      <img src={img} alt={`Product ${idx}`} className="w-full h-full object-cover" onError={handleImageError} />
                      <button 
                        type="button"
                        onClick={() => removeImage(idx)}
                        className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={12} />
                      </button>
                      {idx === 0 && (
                        <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[10px] text-center py-1">
                          Main Image
                        </div>
                      )}
                    </div>
                  ))}
                  
                  <div 
                    className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-indigo-500 hover:bg-indigo-50/30 transition-all bg-gray-50"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <div className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mb-1">
                      <Plus size={16} />
                    </div>
                    <p className="text-xs text-gray-500">Add Image</p>
                  </div>
                </div>

                <input 
                  ref={fileInputRef}
                  type="file" 
                  accept="image/*" 
                  multiple
                  className="hidden" 
                  onChange={handleImageUpload}
                />
              </div>

              {/* Form Fields */}
              <div className="lg:col-span-2 space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Product Name</label>
                    <input
                      required
                      type="text"
                      className="w-full border border-gray-200 bg-gray-50 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all outline-none"
                      placeholder="e.g., Premium Leather Bag"
                      value={productForm.name}
                      onChange={e => setProductForm({...productForm, name: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Category</label>
                    <div className="relative">
                      <select
                        required
                        className="w-full border border-gray-200 bg-gray-50 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all outline-none appearance-none"
                        value={productForm.category}
                        onChange={e => setProductForm({...productForm, category: e.target.value, subCategory: ''})}
                      >
                        <option value="">Select Category</option>
                        {CATEGORIES_DATA.map(cat => (
                          <option key={cat.name} value={cat.name}>{cat.name}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-3 text-gray-400 pointer-events-none" size={16} />
                    </div>
                  </div>
                </div>

                {/* Sub Category Row */}
                {productForm.category && availableSubCategories && availableSubCategories.length > 0 && (
                   <div className="animate-fade-in">
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Sub-Category</label>
                      <div className="relative">
                        <select
                          className="w-full border border-gray-200 bg-gray-50 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all outline-none appearance-none"
                          value={productForm.subCategory}
                          onChange={e => setProductForm({...productForm, subCategory: e.target.value})}
                        >
                          <option value="">Select Sub-Category (Optional)</option>
                          {availableSubCategories.map(sub => (
                            <option key={sub} value={sub}>{sub}</option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-3 text-gray-400 pointer-events-none" size={16} />
                      </div>
                   </div>
                )}

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Price ($)</label>
                      <input
                        required
                        type="number"
                        min="0"
                        step="0.01"
                        className="w-full border border-gray-200 bg-gray-50 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all outline-none"
                        placeholder="0.00"
                        value={productForm.price}
                        onChange={e => setProductForm({...productForm, price: Number(e.target.value)})}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Original Price ($) <span className="text-gray-400 font-normal">(Optional)</span></label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        className="w-full border border-gray-200 bg-gray-50 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all outline-none"
                        placeholder="0.00"
                        value={productForm.originalPrice}
                        onChange={e => setProductForm({...productForm, originalPrice: Number(e.target.value)})}
                      />
                    </div>
                  </div>
                
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-sm font-semibold text-gray-700">Description</label>
                    <button
                      type="button"
                      onClick={handleGenerateDescription}
                      disabled={isGenerating}
                      className="text-xs flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 text-purple-700 rounded-full hover:bg-purple-100 transition-colors font-medium border border-purple-100"
                    >
                      {isGenerating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Wand2 className="w-3.5 h-3.5" />}
                      {isGenerating ? 'Generating...' : 'Generate with AI'}
                    </button>
                  </div>
                  <textarea
                    required
                    rows={4}
                    className="w-full border border-gray-200 bg-gray-50 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all outline-none resize-none"
                    value={productForm.description}
                    onChange={e => setProductForm({...productForm, description: e.target.value})}
                    placeholder="Describe your product clearly..."
                  />
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    className="px-8 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 font-semibold shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 transition-all transform hover:-translate-y-0.5"
                  >
                    {editingId ? 'Update Product' : 'Publish Product'}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { title: 'Total Revenue', value: `$${totalRevenue.toLocaleString()}`, icon: DollarSign, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100' },
          { title: 'Total Sales', value: totalSales, icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
          { title: 'Active Products', value: products.length, icon: Package, color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-100' },
        ].map((stat, idx) => (
          <div key={idx} className={`bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-5 hover:shadow-md transition-shadow animate-fade-in delay-${(idx+1)*100}`}>
            <div className={`p-4 ${stat.bg} ${stat.color} rounded-xl border ${stat.border}`}>
              <stat.icon size={28} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">{stat.title}</p>
              <p className="text-3xl font-bold text-gray-900 mt-0.5">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chart */}
        <div className="lg:col-span-2 bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 animate-slide-up delay-300">
          <h3 className="text-lg font-bold text-gray-900 mb-8">Weekly Performance</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dashboardStats}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dx={-10} tickFormatter={(val) => `$${val}`} />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', padding: '12px' }}
                />
                <Bar dataKey="revenue" fill="#4f46e5" radius={[6, 6, 0, 0]} barSize={50} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Products */}
        <div className="lg:col-span-1 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 animate-slide-up delay-300 flex flex-col">
           <h3 className="text-lg font-bold text-gray-900 mb-6">Top Performing</h3>
           <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
             {products.slice(0, 4).map(product => (
               <div key={product.id} className="flex gap-3 items-center p-3 hover:bg-gray-50 rounded-xl transition-colors border border-transparent hover:border-gray-100">
                 <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                   <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" onError={handleImageError} />
                 </div>
                 <div className="flex-1 min-w-0">
                   <p className="text-sm font-semibold text-gray-900 truncate">{product.name}</p>
                   <p className="text-xs text-gray-500 truncate">{product.category}</p>
                   {product.subCategory && <p className="text-[10px] text-gray-400 truncate">{product.subCategory}</p>}
                 </div>
                 <div className="text-right">
                   <p className="text-sm font-bold text-gray-900">${product.price}</p>
                 </div>
               </div>
             ))}
             {products.length === 0 && (
               <p className="text-center text-gray-400 text-sm py-4">No active products.</p>
             )}
           </div>
        </div>
      </div>

      {/* Active Listings Grid */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-slide-up delay-500">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h3 className="text-lg font-bold text-gray-900">Active Listings ({products.length})</h3>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6 bg-gray-50/50">
          {products.map((product) => (
            <div key={product.id} className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-md transition-all group relative">
              {/* Product Image */}
              <div className="h-40 relative bg-gray-100">
                <img 
                  src={product.imageUrl} 
                  alt={product.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  onError={handleImageError}
                />
                {/* Buttons Container - Increased z-index to 30 to ensure it is above everything */}
                <div 
                  className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-30 pointer-events-auto"
                  onClick={(e) => e.stopPropagation()} // Stop propagation from the container level as well
                >
                   <button 
                    type="button"
                    onClick={(e) => {
                       e.preventDefault();
                       e.stopPropagation();
                       openEditForm(product);
                    }}
                    className="p-1.5 bg-white/90 backdrop-blur rounded-full text-indigo-600 hover:text-indigo-800 shadow-sm hover:scale-110 transition-transform cursor-pointer" 
                    title="Edit Product"
                  >
                    <Edit3 size={16} />
                  </button>
                  <button 
                    type="button"
                    onClick={(e) => {
                       e.preventDefault();
                       e.stopPropagation();
                       if(window.confirm('Are you sure you want to delete this product?')) {
                         onDeleteProduct(product.id);
                       }
                    }}
                    className="p-1.5 bg-white/90 backdrop-blur rounded-full text-red-500 hover:text-red-700 shadow-sm hover:scale-110 transition-transform cursor-pointer"
                    title="Delete Product"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                {product.images && product.images.length > 1 && (
                  <div className="absolute bottom-2 right-2 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded-full flex items-center gap-1 z-20">
                    <ImageIcon size={10} /> {product.images.length}
                  </div>
                )}
              </div>
              
              {/* Product Info */}
              <div className="p-4">
                <div className="flex justify-between items-start mb-1">
                  <h4 className="font-semibold text-gray-900 line-clamp-1" title={product.name}>{product.name}</h4>
                </div>
                <div className="flex flex-col mb-3">
                   <p className="text-xs text-gray-600 font-medium">{product.category}</p>
                   {product.subCategory && <p className="text-[10px] text-gray-400">{product.subCategory}</p>}
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                     <span className="font-bold text-gray-900">${product.price.toFixed(2)}</span>
                     {product.originalPrice && product.originalPrice > product.price && (
                        <span className="text-xs text-gray-400 line-through ml-2">${product.originalPrice}</span>
                     )}
                  </div>
                  <div className="flex items-center gap-1 text-xs font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded-full">
                    <Star size={10} className="text-yellow-500 fill-current" />
                    {product.rating}
                  </div>
                </div>
              </div>
            </div>
          ))}
          {products.length === 0 && (
            <div className="col-span-full py-12 text-center text-gray-400">
              <Package size={48} className="mx-auto mb-3 opacity-30" />
              <p>You haven't listed any products yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VendorDashboard;