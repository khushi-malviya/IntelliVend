import React from 'react';
import { Home, Tag, User, ShoppingCart, LayoutDashboard, Grid, ShieldAlert } from 'lucide-react';
import { UserRole } from '../types';

interface MobileNavProps {
  currentView: string;
  onNavigate: (view: 'home' | 'deals' | 'profile' | 'dashboard' | 'categories' | 'admin-dashboard') => void;
  cartCount: number;
  onOpenCart: () => void;
  userRole?: UserRole;
}

const MobileNav: React.FC<MobileNavProps> = ({ currentView, onNavigate, cartCount, onOpenCart, userRole }) => {
  const NavItem = ({ view, label, icon: Icon, onClick }: { view?: string, label: string, icon: any, onClick?: () => void }) => {
    const isActive = currentView === view;
    return (
      <button 
        onClick={onClick || (() => view && onNavigate(view as any))}
        className={`flex flex-col items-center justify-center w-full py-3 transition-colors ${
          isActive ? 'text-indigo-600' : 'text-gray-400 hover:text-gray-600'
        }`}
      >
        <div className="relative">
          <Icon size={24} className={`mb-1 ${isActive ? 'fill-current' : ''}`} />
          {label === 'Cart' && cartCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold h-4 w-4 flex items-center justify-center rounded-full">
              {cartCount}
            </span>
          )}
        </div>
        <span className="text-[10px] font-medium">{label}</span>
      </button>
    );
  };

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40 pb-safe">
      <div className="flex justify-around items-center">
        <NavItem view="home" label="Home" icon={Home} />
        <NavItem view="categories" label="Cats" icon={Grid} />
        <NavItem label="Cart" icon={ShoppingCart} onClick={onOpenCart} />
        {userRole === UserRole.VENDOR && (
           <NavItem view="dashboard" label="Dash" icon={LayoutDashboard} />
        )}
        {userRole === UserRole.ADMIN && (
           <NavItem view="admin-dashboard" label="Admin" icon={ShieldAlert} />
        )}
        <NavItem view="profile" label="Profile" icon={User} />
      </div>
    </div>
  );
};

export default MobileNav;