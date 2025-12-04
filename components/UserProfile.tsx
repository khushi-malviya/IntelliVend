import React, { useState, useEffect, useRef } from 'react';
import { User, MapPin, Package, Heart, LogOut, Settings, Save, X, Camera, Upload } from 'lucide-react';
import { Product, User as UserType, Address } from '../types';

interface UserProfileProps {
  user: UserType;
  wishlist: Set<string>;
  products: Product[];
  onRemoveWishlist: (id: string) => void;
  onLogout: () => void;
  onUpdateProfile?: (updatedUser: UserType) => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ user, wishlist, products, onRemoveWishlist, onLogout, onUpdateProfile }) => {
  const [activeTab, setActiveTab] = useState<'orders' | 'wishlist' | 'settings'>('orders');
  
  // Edit Mode State
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: user.name,
    age: user.age?.toString() || '',
    gender: user.gender || 'Prefer not to say',
    street: user.address?.street || '',
    city: user.address?.city || '',
    state: user.address?.state || '',
    zip: user.address?.zip || '',
    avatarUrl: user.avatarUrl,
  });
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync state when user prop changes (e.g. initial load or external update)
  useEffect(() => {
    setEditForm({
      name: user.name,
      age: user.age?.toString() || '',
      gender: user.gender || 'Prefer not to say',
      street: user.address?.street || '',
      city: user.address?.city || '',
      state: user.address?.state || '',
      zip: user.address?.zip || '',
      avatarUrl: user.avatarUrl,
    });
  }, [user]);

  const wishlistProducts = products.filter(p => wishlist.has(p.id));

  // Mock Orders
  const orders = [
    { id: 'ORD-7782', date: 'Oct 24, 2023', total: 124.50, status: 'Delivered', items: ['Wireless Headphones', 'USB-C Cable'] },
    { id: 'ORD-9921', date: 'Nov 12, 2023', total: 45.00, status: 'Shipped', items: ['Smart Water Bottle'] },
    { id: 'ORD-1102', date: 'Jan 05, 2024', total: 599.99, status: 'Processing', items: ['Ergonomic AI Chair'] },
  ];

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (onUpdateProfile) {
      const updatedUser: UserType = {
        ...user,
        name: editForm.name,
        avatarUrl: editForm.avatarUrl,
        age: parseInt(editForm.age) || undefined,
        gender: editForm.gender,
        address: {
          street: editForm.street,
          city: editForm.city,
          state: editForm.state,
          zip: editForm.zip
        }
      };
      onUpdateProfile(updatedUser);
      setIsEditing(false);
    }
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditForm(prev => ({ ...prev, avatarUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Sidebar */}
        <div className="col-span-1">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-center mb-6">
            <div className="relative w-24 h-24 mx-auto mb-4 group">
              <div className="w-full h-full rounded-full bg-indigo-100 p-1 overflow-hidden">
                <img src={editForm.avatarUrl} alt="User" className="w-full h-full rounded-full object-cover" />
              </div>
              
              {/* Avatar Edit Overlay - Always visible when editing */}
              {isEditing && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center cursor-pointer transition-colors hover:bg-black/50"
                  title="Change Profile Picture"
                >
                  <Camera className="text-white" size={24} />
                </button>
              )}
              
              {/* Always visible camera badge when editing */}
              {isEditing && (
                 <div className="absolute bottom-0 right-0 bg-indigo-600 rounded-full p-1.5 border-2 border-white cursor-pointer shadow-sm" onClick={() => fileInputRef.current?.click()}>
                    <Camera size={14} className="text-white" />
                 </div>
              )}

              <input 
                ref={fileInputRef}
                type="file" 
                accept="image/*" 
                className="hidden" 
                onChange={handleAvatarUpload}
              />
            </div>
            
             {isEditing && (
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 mb-3 flex items-center justify-center gap-1 mx-auto"
              >
                <Upload size={12} /> Change Photo
              </button>
            )}
            
            <h2 className="font-bold text-lg text-gray-900">{user.name}</h2>
            <p className="text-sm text-gray-500 mb-4">{user.email}</p>
            <div className="inline-flex px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-full uppercase tracking-wider">
              {user.role}
            </div>
          </div>

          <nav className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <button 
              onClick={() => setActiveTab('orders')}
              className={`w-full flex items-center gap-3 px-6 py-4 text-sm font-medium transition-colors ${activeTab === 'orders' ? 'bg-indigo-50 text-indigo-600 border-l-4 border-indigo-600' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              <Package size={18} /> My Orders
            </button>
            <button 
              onClick={() => setActiveTab('wishlist')}
              className={`w-full flex items-center gap-3 px-6 py-4 text-sm font-medium transition-colors ${activeTab === 'wishlist' ? 'bg-indigo-50 text-indigo-600 border-l-4 border-indigo-600' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              <Heart size={18} /> Wishlist <span className="ml-auto bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">{wishlist.size}</span>
            </button>
            <button 
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center gap-3 px-6 py-4 text-sm font-medium transition-colors ${activeTab === 'settings' ? 'bg-indigo-50 text-indigo-600 border-l-4 border-indigo-600' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              <Settings size={18} /> Account Settings
            </button>
            <button 
              onClick={onLogout}
              className="w-full flex items-center gap-3 px-6 py-4 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors border-t border-gray-100"
            >
              <LogOut size={18} /> Sign Out
            </button>
          </nav>
        </div>

        {/* Content Area */}
        <div className="col-span-1 md:col-span-3">
          {activeTab === 'orders' && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 animate-slide-up">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Order History</h2>
              <div className="space-y-6">
                {orders.map(order => (
                  <div key={order.id} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                    <div className="flex flex-col sm:flex-row justify-between mb-4 pb-4 border-b border-gray-100">
                      <div>
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Order ID</span>
                        <p className="font-mono font-medium text-gray-900">{order.id}</p>
                      </div>
                      <div className="mt-2 sm:mt-0">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Date</span>
                        <p className="font-medium text-gray-900">{order.date}</p>
                      </div>
                      <div className="mt-2 sm:mt-0">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total</span>
                        <p className="font-bold text-gray-900">${order.total.toFixed(2)}</p>
                      </div>
                      <div className="mt-2 sm:mt-0">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Status</span>
                        <p className={`font-medium ${order.status === 'Delivered' ? 'text-green-600' : 'text-orange-500'}`}>{order.status}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-2">Items:</p>
                      <div className="flex flex-wrap gap-2">
                        {order.items.map((item, idx) => (
                          <span key={idx} className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-lg">{item}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'wishlist' && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 animate-slide-up">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">My Wishlist</h2>
              {wishlistProducts.length === 0 ? (
                <div className="text-center py-12">
                  <Heart className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                  <p className="text-gray-500">Your wishlist is empty.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {wishlistProducts.map(product => (
                    <div key={product.id} className="border border-gray-200 rounded-xl overflow-hidden group">
                      <div className="relative h-48 bg-gray-100">
                        <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                        <button 
                          onClick={() => onRemoveWishlist(product.id)}
                          className="absolute top-2 right-2 p-1.5 bg-white rounded-full shadow-sm text-red-500 hover:bg-red-50"
                        >
                          <Heart size={16} fill="currentColor" />
                        </button>
                      </div>
                      <div className="p-4">
                        <h3 className="font-bold text-gray-900 truncate">{product.name}</h3>
                        <p className="text-sm text-gray-500 mb-2">{product.category}</p>
                        <p className="font-bold text-indigo-600">${product.price}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 animate-slide-up">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Account Settings</h2>
                {!isEditing ? (
                  <button 
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
                  >
                    <Settings size={16} /> Edit Profile
                  </button>
                ) : (
                  <button 
                    onClick={() => setIsEditing(false)}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <X size={16} /> Cancel
                  </button>
                )}
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-6 max-w-lg">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input 
                      type="text" 
                      disabled={!isEditing}
                      value={editForm.name}
                      onChange={e => setEditForm({...editForm, name: e.target.value})}
                      className={`w-full p-2.5 border rounded-lg outline-none transition-all ${isEditing ? 'border-gray-300 focus:ring-2 focus:ring-indigo-500' : 'bg-gray-50 border-transparent text-gray-600'}`} 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input 
                      type="email" 
                      value={user.email} 
                      disabled 
                      className="w-full p-2.5 border border-transparent rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed" 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                    <input 
                      type="number" 
                      disabled={!isEditing}
                      value={editForm.age}
                      onChange={e => setEditForm({...editForm, age: e.target.value})}
                      className={`w-full p-2.5 border rounded-lg outline-none transition-all ${isEditing ? 'border-gray-300 focus:ring-2 focus:ring-indigo-500' : 'bg-gray-50 border-transparent text-gray-600'}`} 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                    {isEditing ? (
                      <select 
                        value={editForm.gender}
                        onChange={e => setEditForm({...editForm, gender: e.target.value})}
                        className="w-full p-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                      >
                         <option>Prefer not to say</option>
                         <option>Male</option>
                         <option>Female</option>
                         <option>Non-binary</option>
                         <option>Other</option>
                      </select>
                    ) : (
                      <input 
                        type="text" 
                        disabled
                        value={editForm.gender} 
                        className="w-full p-2.5 border border-transparent rounded-lg bg-gray-50 text-gray-600" 
                      />
                    )}
                  </div>
                </div>
                
                <div className="pt-6 border-t border-gray-100">
                  <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><MapPin size={18} /> Address Details</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                      <input 
                        type="text" 
                        disabled={!isEditing}
                        value={editForm.street}
                        onChange={e => setEditForm({...editForm, street: e.target.value})}
                        className={`w-full p-2.5 border rounded-lg outline-none transition-all ${isEditing ? 'border-gray-300 focus:ring-2 focus:ring-indigo-500' : 'bg-gray-50 border-transparent text-gray-600'}`} 
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                        <input 
                          type="text" 
                          disabled={!isEditing}
                          value={editForm.city}
                          onChange={e => setEditForm({...editForm, city: e.target.value})}
                          className={`w-full p-2.5 border rounded-lg outline-none transition-all ${isEditing ? 'border-gray-300 focus:ring-2 focus:ring-indigo-500' : 'bg-gray-50 border-transparent text-gray-600'}`} 
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                        <input 
                          type="text" 
                          disabled={!isEditing}
                          value={editForm.state}
                          onChange={e => setEditForm({...editForm, state: e.target.value})}
                          className={`w-full p-2.5 border rounded-lg outline-none transition-all ${isEditing ? 'border-gray-300 focus:ring-2 focus:ring-indigo-500' : 'bg-gray-50 border-transparent text-gray-600'}`} 
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code</label>
                      <input 
                        type="text" 
                        disabled={!isEditing}
                        value={editForm.zip}
                        onChange={e => setEditForm({...editForm, zip: e.target.value})}
                        className={`w-full p-2.5 border rounded-lg outline-none transition-all ${isEditing ? 'border-gray-300 focus:ring-2 focus:ring-indigo-500' : 'bg-gray-50 border-transparent text-gray-600'}`} 
                      />
                    </div>
                  </div>
                </div>

                {isEditing && (
                  <div className="flex gap-4 pt-4">
                    <button 
                      type="submit"
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 shadow-lg shadow-indigo-500/30 transition-all"
                    >
                      <Save size={18} /> Save Changes
                    </button>
                  </div>
                )}
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;