import React from 'react';
import { ShoppingCart, User as UserIcon, Store, Search, LogOut, LogIn, Heart, Tag, Home, Sparkles, LayoutDashboard, Grid, ShieldAlert } from 'lucide-react';
import { User, UserRole, CartItem } from '../types';

interface NavbarProps {
  user: User | null;
  cartItems: CartItem[];
  onOpenCart: () => void;
  onSearch: (query: string) => void;
  onLoginClick: () => void;
  onLogoutClick: () => void;
  onProfileClick: () => void;
  onNavigate: (view: 'home' | 'deals' | 'profile' | 'dashboard' | 'categories' | 'admin-dashboard') => void;
  currentView: string;
  wishlistCount: number;
}

const Navbar: React.FC<NavbarProps> = ({ 
  user, 
  cartItems, 
  onOpenCart,
  onSearch,
  onLoginClick,
  onLogoutClick,
  onProfileClick,
  onNavigate,
  currentView,
  wishlistCount
}) => {
  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const NavLink = ({ view, label, icon: Icon }: { view: any, label: string, icon: any }) => (
    <button
      onClick={() => onNavigate(view)}
      className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
        currentView === view 
          ? 'bg-gray-900 text-white' 
          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
      }`}
    >
      <Icon size={16} />
      {label}
    </button>
  );

  return (
    <nav className="sticky top-0 z-50 glass border-b border-gray-200/50 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div 
            className="flex-shrink-0 flex items-center gap-3 cursor-pointer group"
            onClick={() => onNavigate('home')} 
          >
            <div className="w-10 h-10 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30 group-hover:scale-105 transition-transform duration-300">
              <span className="text-white font-bold text-xl">I</span>
            </div>
            <span className="font-bold text-2xl tracking-tight text-slate-800 hidden sm:block">
              IntelliVend<span className="text-indigo-600">.</span>
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2 mx-6">
            <NavLink view="home" label="Home" icon={Home} />
            <NavLink view="categories" label="Categories" icon={Grid} />
            <NavLink view="deals" label="Deals" icon={Tag} />
            {user?.role === UserRole.VENDOR && (
               <NavLink view="dashboard" label="Dashboard" icon={LayoutDashboard} />
            )}
            {user?.role === UserRole.ADMIN && (
               <NavLink view="admin-dashboard" label="Admin" icon={ShieldAlert} />
            )}
          </div>

          {/* Search Bar - Hidden on Mobile, shown on Desktop */}
          {(!user || user.role === UserRole.BUYER || (user.role === UserRole.VENDOR && currentView !== 'dashboard') || (user.role === UserRole.ADMIN && currentView !== 'admin-dashboard')) && (
            <div className="flex-1 max-w-sm mx-4 hidden lg:block">
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-4 py-2 border border-gray-200 rounded-full leading-5 bg-gray-50/50 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white text-sm transition-all duration-300 shadow-sm"
                  placeholder="Search..."
                  onChange={(e) => onSearch(e.target.value)}
                />
              </div>
            </div>
          )}

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            
            {user ? (
              <>
                {user.role === UserRole.VENDOR && (
                  <button
                    onClick={() => onNavigate(currentView === 'dashboard' ? 'home' : 'dashboard')}
                    className="hidden sm:flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-600 hover:text-indigo-800 mr-2"
                  >
                    {currentView === 'dashboard' ? 'Switch to Buying' : 'Switch to Selling'}
                  </button>
                )}
                
                {user.role === UserRole.ADMIN && (
                   <button
                    onClick={() => onNavigate(currentView === 'admin-dashboard' ? 'home' : 'admin-dashboard')}
                    className="hidden sm:flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-red-600 hover:text-red-800 mr-2"
                  >
                    {currentView === 'admin-dashboard' ? 'Go to Store' : 'Go to Admin'}
                  </button>
                )}

                {currentView !== 'dashboard' && currentView !== 'admin-dashboard' && (
                  <>
                    <button 
                      onClick={() => onNavigate('profile')} 
                      className="hidden sm:flex items-center gap-2 p-2 text-gray-500 hover:text-indigo-600 transition-colors relative"
                      title="Wishlist"
                    >
                      <Heart className={`h-6 w-6 ${wishlistCount > 0 ? 'fill-red-500 text-red-500' : ''}`} />
                      {wishlistCount > 0 && <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>}
                    </button>

                    <button 
                      onClick={onOpenCart}
                      className="relative p-2.5 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-all duration-200"
                    >
                      <ShoppingCart className="h-6 w-6" />
                      {totalItems > 0 && (
                        <span className="absolute -top-1 -right-1 inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 text-xs font-bold leading-none text-white transform scale-100 bg-red-500 rounded-full shadow-sm animate-bounce">
                          {totalItems}
                        </span>
                      )}
                    </button>
                  </>
                )}

                <div 
                  className="flex items-center gap-3 pl-2 border-l border-gray-200 cursor-pointer"
                  onClick={onProfileClick}
                >
                   <div className={`h-10 w-10 rounded-full ring-2 ring-offset-2 ring-offset-gray-50 overflow-hidden shadow-sm transition-all ${currentView === 'profile' ? 'ring-indigo-500' : 'ring-white hover:ring-indigo-200'}`}>
                     <img src={user.avatarUrl} alt="User" className="h-full w-full object-cover" />
                  </div>
                </div>
              </>
            ) : (
              /* Guest View */
              <div className="flex items-center gap-3">
                 <button 
                  onClick={onOpenCart}
                  className="relative p-2.5 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-all duration-200"
                >
                  <ShoppingCart className="h-6 w-6" />
                  {totalItems > 0 && (
                    <span className="absolute -top-1 -right-1 inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 text-xs font-bold leading-none text-white transform scale-100 bg-red-500 rounded-full shadow-sm animate-bounce">
                      {totalItems}
                    </span>
                  )}
                </button>
                <button
                  onClick={onLoginClick}
                  className="hidden sm:flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white rounded-full font-medium hover:bg-gray-800 transition-all shadow-lg shadow-gray-900/20"
                >
                  <LogIn size={18} /> Sign In
                </button>
                 <button
                  onClick={onLoginClick}
                  className="sm:hidden p-2 text-gray-900"
                >
                  <LogIn size={24} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;