import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Navbar from './components/Navbar';
import MobileNav from './components/MobileNav';
import ProductCard from './components/ProductCard';
import CartDrawer from './components/CartDrawer';
import VendorDashboard from './components/VendorDashboard';
import AdminDashboard from './components/AdminDashboard';
import AIChatBot from './components/AIChatBot';
import AuthModal from './components/AuthModal';
import CheckoutModal from './components/CheckoutModal';
import Toast from './components/Toast';
import CategoryFilter from './components/CategoryFilter';
import ProductDetailsModal from './components/ProductDetailsModal';
import UserProfile from './components/UserProfile';
import CategoriesPage from './components/CategoriesPage';
import VendorStorefront from './components/VendorStorefront';
import HeroSection from './components/HeroSection';
import Showcase3D from './components/Showcase3D';
import { Product, CartItem, User, UserRole, ToastMessage, Address, Order } from './types';
import { VENDOR_STATS } from './constants';
import { Sparkles, ArrowRight, Loader2, Tag } from 'lucide-react';
import { db } from './services/db';

type ViewType = 'home' | 'deals' | 'profile' | 'dashboard' | 'categories' | 'admin-dashboard' | 'storefront';

function App() {
  // --- State ---
  const [user, setUser] = useState<User | null>(() => {
    try {
      const savedUser = localStorage.getItem('intellivend_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (error) {
      console.error("Failed to parse user data", error);
      return null;
    }
  });
  
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<Set<string>>(new Set());
  
  // UI State
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [currentView, setCurrentView] = useState<ViewType>('home');
  const [viewingVendor, setViewingVendor] = useState<User | null>(null);
  
  // Filtering & Sorting
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [sortBy, setSortBy] = useState('featured');
  
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Initialize view based on role
  useEffect(() => {
    if (user?.role === UserRole.VENDOR) {
      setCurrentView('dashboard');
    } else if (user?.role === UserRole.ADMIN) {
      setCurrentView('admin-dashboard');
    }
  }, []);

  // --- Helpers ---
  const addToast = useCallback((type: 'success' | 'error' | 'info', message: string) => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, type, message }]);
  }, []);

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const handleNavigate = (view: ViewType) => {
    // If not logged in and trying to access protected views, show login
    if (!user && (view === 'profile' || view === 'dashboard' || view === 'admin-dashboard')) {
      setIsAuthOpen(true);
      return;
    }
    
    // Reset filters when going home
    if (view === 'home') {
      setActiveCategory('All');
      setSearchQuery('');
    }
    
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectCategoryFromPage = (category: string) => {
    setActiveCategory(category);
    setCurrentView('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleViewVendor = async (vendorId: string) => {
    const fetchedVendor = await db.getUser(vendorId);
    if (fetchedVendor) {
      setViewingVendor(fetchedVendor);
      setCurrentView('storefront');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      addToast('error', 'Vendor not found.');
    }
  };

  // --- Data Fetching ---
  const refreshProducts = useCallback(async () => {
    const data = await db.getProducts();
    setProducts(data);
    setIsLoadingProducts(false);
  }, []);

  useEffect(() => {
    refreshProducts();
    // Listen for database changes to sync UI
    const handleDbChange = () => refreshProducts();
    window.addEventListener('db-products-changed', handleDbChange);
    return () => window.removeEventListener('db-products-changed', handleDbChange);
  }, [refreshProducts]);

  // --- Auth Handlers ---
  const handleLogin = (email: string, role: UserRole) => {
    // Determine ID based on role to allow vendors/admins to edit mock data
    const id = 
        email === 'alex.developer@example.com' && role === UserRole.VENDOR ? 'v1' : 
        role === UserRole.ADMIN ? `admin-${Date.now()}` : 
        'u-' + Date.now();
    
    const newUser: User = {
      id: id,
      name: email.split('@')[0],
      email: email,
      role: role,
      avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
    };
    setUser(newUser);
    localStorage.setItem('intellivend_user', JSON.stringify(newUser));
    
    // Also save to DB list of users to populate Admin dashboard
    db.updateUser(newUser);

    setIsAuthOpen(false);
    addToast('success', `Welcome back, ${newUser.name}!`);
    if (role === UserRole.VENDOR) setCurrentView('dashboard');
    else if (role === UserRole.ADMIN) setCurrentView('admin-dashboard');
    else setCurrentView('home');
  };

  const handleRegister = (
    name: string, 
    email: string, 
    role: UserRole, 
    details: { age: string; gender: string; address: Address }
  ) => {
    const newUser: User = {
      id: 'u-' + Date.now(),
      name: name,
      email: email,
      role: role,
      avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
      age: parseInt(details.age) || undefined,
      gender: details.gender,
      address: details.address
    };
    setUser(newUser);
    localStorage.setItem('intellivend_user', JSON.stringify(newUser));
    
    // Also save to DB list of users
    db.updateUser(newUser);

    setIsAuthOpen(false);
    addToast('success', 'Account created successfully!');
    if (role === UserRole.VENDOR) setCurrentView('dashboard');
    else if (role === UserRole.ADMIN) setCurrentView('admin-dashboard');
    else setCurrentView('home');
  };

  const handleUpdateUser = async (updatedUser: User) => {
    const result = await db.updateUser(updatedUser);
    setUser(result);
    addToast('success', 'Profile updated successfully!');
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('intellivend_user');
    setCartItems([]);
    setWishlist(new Set());
    setCurrentView('home');
    addToast('info', 'You have been logged out.');
  };

  // --- Core Features ---
  const handleAddToCart = (product: Product) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      addToast('success', `Added ${product.name} to cart`);
      if (existing) {
        return prev.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const handleRemoveFromCart = (id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const handleUpdateQuantity = (id: string, delta: number) => {
    setCartItems(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, quantity: Math.max(1, item.quantity + delta) };
      }
      return item;
    }));
  };

  const handleToggleWishlist = (product: Product) => {
    if (!user) {
      setIsAuthOpen(true);
      return;
    }
    setWishlist(prev => {
      const next = new Set(prev);
      if (next.has(product.id)) {
        next.delete(product.id);
        addToast('info', 'Removed from wishlist');
      } else {
        next.add(product.id);
        addToast('success', 'Added to wishlist');
      }
      return next;
    });
  };

  const handleCheckoutStart = useCallback(() => {
    setIsCartOpen(false);
    const currentUser = localStorage.getItem('intellivend_user'); 
    if (!currentUser) {
      addToast('info', 'Please sign in to complete your purchase.');
      setIsAuthOpen(true);
    } else {
      setIsCheckoutOpen(true);
    }
  }, [addToast]);

  const handlePaymentSuccess = async () => {
    if (!user) return;
    
    // Create actual order in DB
    const total = cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const tax = total * 0.08;
    const shipping = total > 100 ? 0 : 15;

    const newOrder: Order = {
      id: `ORD-${Date.now()}`,
      userId: user.id,
      items: [...cartItems],
      total: total + tax + shipping,
      date: new Date().toLocaleDateString(),
      status: 'processing',
      shippingAddress: user.address || { street: '', city: '', state: '', zip: '' },
      paymentMethod: 'Card ending 0000'
    };

    await db.createOrder(newOrder);

    setIsCheckoutOpen(false);
    setCartItems([]);
    addToast('success', 'Order placed successfully! Order ID: ' + newOrder.id);
  };

  // Vendor & Admin Actions
  const handleAddProduct = async (product: Product) => {
    await db.addProduct(product);
    addToast('success', 'Product listed successfully!');
    refreshProducts(); 
  };

  const handleUpdateProduct = async (product: Product) => {
    await db.updateProduct(product);
    addToast('success', 'Product updated successfully!');
    refreshProducts();
  };

  const handleDeleteProduct = async (id: string) => {
    await db.deleteProduct(id);
    addToast('info', 'Product removed successfully.');
    // Explicitly refresh after delete to ensure UI sync
    await refreshProducts();
  };

  // --- Effects ---
  useEffect(() => {
    const handleCheckoutEvent = () => handleCheckoutStart();
    window.addEventListener('initCheckout', handleCheckoutEvent);
    return () => window.removeEventListener('initCheckout', handleCheckoutEvent);
  }, [handleCheckoutStart]);

  // --- Filtering Logic ---
  const categories = useMemo(() => {
    return Array.from(new Set(products.map(p => p.category)));
  }, [products]);

  const filteredAndSortedProducts = useMemo(() => {
    let result = products;

    // View specific filtering
    if (currentView === 'deals') {
      result = result.filter(p => p.originalPrice && p.originalPrice > p.price);
    }

    // Standard filtering
    result = result.filter(p => 
      (p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
       p.category.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (activeCategory === 'All' || p.category === activeCategory)
    );

    switch (sortBy) {
      case 'price_low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price_high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      default:
        // Featured - default order
        break;
    }
    return result;
  }, [products, searchQuery, activeCategory, sortBy, currentView]);

  // --- Render ---
  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24 md:pb-20 font-sans">
      <Toast toasts={toasts} onRemove={removeToast} />
      
      <Navbar 
        user={user} 
        cartItems={cartItems}
        onOpenCart={() => setIsCartOpen(true)}
        onSearch={setSearchQuery}
        onLoginClick={() => setIsAuthOpen(true)}
        onLogoutClick={handleLogout}
        onProfileClick={() => handleNavigate('profile')}
        onNavigate={handleNavigate}
        currentView={currentView}
        wishlistCount={wishlist.size}
      />

      <main className="pt-0">
        {currentView === 'dashboard' && user?.role === UserRole.VENDOR ? (
          <div className="pt-8">
            <VendorDashboard 
              products={products.filter(p => p.vendorId === user.id)} 
              stats={VENDOR_STATS}
              onAddProduct={handleAddProduct}
              onUpdateProduct={handleUpdateProduct}
              onDeleteProduct={handleDeleteProduct}
              vendor={user}
            />
          </div>
        ) : currentView === 'admin-dashboard' && user?.role === UserRole.ADMIN ? (
           <div className="pt-8">
             <AdminDashboard 
                onDeleteProduct={handleDeleteProduct}
                currentUser={user}
             />
           </div>
        ) : currentView === 'storefront' && viewingVendor ? (
           <VendorStorefront
              vendor={viewingVendor}
              products={products.filter(p => p.vendorId === viewingVendor.id)}
              onAddToCart={handleAddToCart}
              onViewDetails={setSelectedProduct}
              isWishlisted={(id) => wishlist.has(id)}
              onToggleWishlist={handleToggleWishlist}
              onBack={() => handleNavigate('home')}
           />
        ) : currentView === 'profile' && user ? (
          <div className="pt-4">
             <UserProfile 
              user={user} 
              wishlist={wishlist}
              products={products}
              onRemoveWishlist={(id) => setWishlist(prev => {
                const next = new Set(prev);
                next.delete(id);
                return next;
              })}
              onLogout={handleLogout}
              onUpdateProfile={handleUpdateUser}
            />
          </div>
        ) : currentView === 'categories' ? (
          <CategoriesPage onSelectCategory={handleSelectCategoryFromPage} />
        ) : (
          /* Home & Deals View */
          <>
            <CategoryFilter 
              categories={categories}
              activeCategory={activeCategory}
              onSelectCategory={setActiveCategory}
              sortBy={sortBy}
              onSortChange={setSortBy}
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              {/* Header for Deals View */}
              {currentView === 'deals' && (
                <div className="mb-8 p-6 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-4 animate-fade-in">
                  <div className="p-3 bg-red-500 rounded-full text-white">
                    <Tag size={24} />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">Exclusive Deals</h1>
                    <p className="text-red-600 font-medium">Limited time offers on top rated products</p>
                  </div>
                </div>
              )}

              {/* Hero Section (Only show on Home if no search/filter active) */}
              {currentView === 'home' && searchQuery === '' && activeCategory === 'All' && (
                 <>
                   <HeroSection 
                     onNavigateDeals={() => handleNavigate('deals')} 
                     featuredProducts={products}
                   />
                   <div className="mb-16 -mx-4 sm:-mx-6 lg:-mx-8">
                      <Showcase3D onSelectCategory={handleSelectCategoryFromPage} />
                   </div>
                 </>
              )}

              {/* Product Grid Header */}
              <div className="flex flex-col md:flex-row items-end justify-between mb-8 gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {currentView === 'deals' 
                      ? 'Flash Sales' 
                      : activeCategory === 'All' ? 'Trending Products' : `${activeCategory} Collection`}
                  </h2>
                  <p className="text-gray-500">
                    {isLoadingProducts ? 'Loading inventory...' : `${filteredAndSortedProducts.length} items found`}
                  </p>
                </div>
              </div>
              
              {isLoadingProducts ? (
                <div className="flex justify-center py-32">
                  <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
                </div>
              ) : filteredAndSortedProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                  {filteredAndSortedProducts.map((product, idx) => (
                    <div key={product.id} className={`animate-slide-up`} style={{ animationDelay: `${idx * 50}ms` }}>
                      <ProductCard 
                        product={product} 
                        onAddToCart={handleAddToCart}
                        onViewDetails={setSelectedProduct}
                        isWishlisted={wishlist.has(product.id)}
                        onToggleWishlist={handleToggleWishlist}
                        onViewVendor={handleViewVendor}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-32 bg-white rounded-3xl border border-dashed border-gray-200">
                  <p className="text-xl text-gray-400 font-medium">No products found matching your criteria</p>
                  <button 
                    onClick={() => { setSearchQuery(''); setActiveCategory('All'); handleNavigate('home'); }}
                    className="mt-4 text-indigo-600 hover:text-indigo-700 font-medium"
                  >
                    Clear filters
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </main>

      {/* Mobile Navigation */}
      <MobileNav 
        currentView={currentView}
        onNavigate={handleNavigate}
        cartCount={cartItems.reduce((acc, i) => acc + i.quantity, 0)}
        onOpenCart={() => setIsCartOpen(true)}
        userRole={user?.role}
      />

      {/* Overlays */}
      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        items={cartItems} 
        onRemove={handleRemoveFromCart}
        onUpdateQuantity={handleUpdateQuantity}
        onCheckout={handleCheckoutStart}
      />

      <AuthModal 
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLogin={handleLogin}
        onRegister={handleRegister}
      />

      <CheckoutModal 
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cartItems}
        onSuccess={handlePaymentSuccess}
      />
      
      {selectedProduct && (
        <ProductDetailsModal
          product={selectedProduct}
          user={user}
          isOpen={!!selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={handleAddToCart}
          isWishlisted={wishlist.has(selectedProduct.id)}
          onToggleWishlist={handleToggleWishlist}
          onReviewAdded={refreshProducts} 
          onViewVendor={handleViewVendor}
        />
      )}

      {/* Chat Bot - Always Visible now */}
      <AIChatBot products={products} />
    </div>
  );
}

export default App;