import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Users, ShoppingBag, DollarSign, Package, Trash2, ShieldCheck, RefreshCw, Search, CheckCircle, XCircle } from 'lucide-react';
import { User, Product, Order, UserRole } from '../types';
import { db } from '../services/db';

interface AdminDashboardProps {
  onDeleteProduct: (id: string) => void;
  currentUser: User;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onDeleteProduct, currentUser }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'products' | 'orders'>('overview');
  const [searchTerm, setSearchTerm] = useState('');

  const refreshData = async () => {
    setIsLoading(true);
    const [fetchedUsers, fetchedProducts, fetchedOrders] = await Promise.all([
      db.getAllUsers(),
      db.getProducts(),
      db.getOrders()
    ]);
    setUsers(fetchedUsers);
    setProducts(fetchedProducts);
    setOrders(fetchedOrders);
    setIsLoading(false);
  };

  useEffect(() => {
    refreshData();
    window.addEventListener('db-products-changed', refreshData);
    window.addEventListener('db-orders-changed', refreshData);
    window.addEventListener('db-users-changed', refreshData);
    return () => {
      window.removeEventListener('db-products-changed', refreshData);
      window.removeEventListener('db-orders-changed', refreshData);
      window.removeEventListener('db-users-changed', refreshData);
    };
  }, []);

  const handleDeleteUser = async (userId: string) => {
    if (userId === currentUser.id) {
      alert("You cannot delete yourself.");
      return;
    }
    const user = users.find(u => u.id === userId);
    const isVendor = user?.role === UserRole.VENDOR;
    const warning = isVendor 
      ? `This user is a Vendor. Deleting them will also delete ALL their products. Are you sure?`
      : 'Are you sure you want to delete this user? This action is irreversible.';

    if (confirm(warning)) {
      await db.deleteUser(userId);
      refreshData();
    }
  };

  const handleToggleVerification = async (user: User) => {
      // In a real app, this would update a 'verified' boolean in the DB
      // For this mock, we'll just toggle a mock property by updating the user object
      // Since our User type doesn't explicitly have 'isVerified', we simulate it via db update
      // This is a visual toggle for the "Admin Features" request
      const updatedUser = { ...user, isVerified: !(user as any).isVerified };
      await db.updateUser(updatedUser);
  };

  const handleDeleteProduct = async (productId: string) => {
    if (confirm('Are you sure you want to remove this product from the marketplace?')) {
      onDeleteProduct(productId);
    }
  };

  // Stats
  const totalRevenue = orders.reduce((acc, order) => acc + order.total, 0);
  const totalVendors = users.filter(u => u.role === UserRole.VENDOR).length;
  const totalBuyers = users.filter(u => u.role === UserRole.BUYER).length;

  const roleData = [
    { name: 'Buyers', value: totalBuyers, color: '#4F46E5' },
    { name: 'Vendors', value: totalVendors, color: '#9333EA' },
    { name: 'Admins', value: users.filter(u => u.role === UserRole.ADMIN).length, color: '#EF4444' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
            <ShieldCheck className="text-red-600" size={32} /> Admin Portal
          </h1>
          <p className="text-gray-500 mt-1">Platform-wide management and analytics.</p>
        </div>
        <button onClick={refreshData} className="p-2.5 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 text-gray-600 transition-colors" title="Refresh Data">
          <RefreshCw size={20} className={isLoading ? "animate-spin" : ""} />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 bg-white p-1 rounded-xl shadow-sm border border-gray-100 max-w-fit">
        {[
            { id: 'overview', label: 'Overview', icon: LayoutGrid },
            { id: 'users', label: 'User Management', icon: Users },
            { id: 'products', label: 'Products', icon: Package },
            { id: 'orders', label: 'All Orders', icon: ShoppingBag }
        ].map(tab => (
            <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === tab.id ? 'bg-gray-900 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}
            >
                <tab.icon size={16} /> {tab.label}
            </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <div className="space-y-8 animate-slide-up">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: 'Total Revenue', value: `$${totalRevenue.toLocaleString()}`, icon: DollarSign, color: 'text-green-600', bg: 'bg-green-50' },
              { title: 'Total Users', value: users.length, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
              { title: 'Total Products', value: products.length, icon: Package, color: 'text-purple-600', bg: 'bg-purple-50' },
              { title: 'Total Orders', value: orders.length, icon: ShoppingBag, color: 'text-orange-600', bg: 'bg-orange-50' },
            ].map((stat, idx) => (
              <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-5 hover:shadow-md transition-shadow">
                <div className={`p-4 ${stat.bg} ${stat.color} rounded-xl`}>
                  <stat.icon size={28} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-80">
                <h3 className="text-lg font-bold text-gray-900 mb-4">User Distribution</h3>
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie data={roleData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                            {roleData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip />
                    </PieChart>
                </ResponsiveContainer>
                <div className="flex justify-center gap-4 mt-[-20px]">
                    {roleData.map((entry, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }}></div>
                            <span>{entry.name} ({entry.value})</span>
                        </div>
                    ))}
                </div>
            </div>
            
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Activity</h3>
                <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                    {orders.slice(0, 5).map(order => (
                        <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
                                    <ShoppingBag size={16} />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-gray-900">New Order {order.id}</p>
                                    <p className="text-xs text-gray-500">{order.date}</p>
                                </div>
                            </div>
                            <span className="font-bold text-gray-900">${order.total.toFixed(2)}</span>
                        </div>
                    ))}
                    {users.slice(0, 3).reverse().map(u => (
                         <div key={u.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-green-100 text-green-600 rounded-lg">
                                    <Users size={16} />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-gray-900">New User: {u.name}</p>
                                    <p className="text-xs text-gray-500">{u.role}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-slide-up">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <h3 className="font-bold text-lg">All Users</h3>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input 
                        type="text" 
                        placeholder="Search users..." 
                        className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 text-gray-600 text-xs uppercase">
                        <tr>
                            <th className="px-6 py-4">User</th>
                            <th className="px-6 py-4">Role</th>
                            <th className="px-6 py-4">Verified</th>
                            <th className="px-6 py-4">Email</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {users.filter(u => u.name.toLowerCase().includes(searchTerm.toLowerCase()) || u.email.toLowerCase().includes(searchTerm.toLowerCase())).map(u => (
                            <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 flex items-center gap-3">
                                    <img src={u.avatarUrl} className="w-8 h-8 rounded-full" alt="" />
                                    <span className="font-medium text-gray-900">{u.name}</span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                                        u.role === UserRole.ADMIN ? 'bg-red-100 text-red-700' :
                                        u.role === UserRole.VENDOR ? 'bg-purple-100 text-purple-700' :
                                        'bg-blue-100 text-blue-700'
                                    }`}>
                                        {u.role}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                   {u.role === UserRole.VENDOR && (
                                     <button 
                                       onClick={() => handleToggleVerification(u)}
                                       className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full border ${
                                          (u as any).isVerified ? 'bg-green-50 border-green-200 text-green-700' : 'bg-gray-50 border-gray-200 text-gray-500'
                                       }`}
                                     >
                                       {(u as any).isVerified ? <CheckCircle size={12} /> : <XCircle size={12} />}
                                       {(u as any).isVerified ? 'Verified' : 'Unverified'}
                                     </button>
                                   )}
                                </td>
                                <td className="px-6 py-4 text-gray-500 text-sm">{u.email}</td>
                                <td className="px-6 py-4 text-right">
                                    <button 
                                        onClick={() => handleDeleteUser(u.id)}
                                        className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors"
                                        title="Delete User"
                                        disabled={u.id === currentUser.id}
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
      )}

      {activeTab === 'products' && (
         <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-slide-up">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <h3 className="font-bold text-lg">All Products</h3>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input 
                        type="text" 
                        placeholder="Search products..." 
                        className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 text-gray-600 text-xs uppercase">
                        <tr>
                            <th className="px-6 py-4">Product</th>
                            <th className="px-6 py-4">Category</th>
                            <th className="px-6 py-4">Vendor</th>
                            <th className="px-6 py-4">Price</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase())).map(p => (
                            <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 flex items-center gap-3">
                                    <img src={p.imageUrl} className="w-10 h-10 rounded-lg object-cover" alt="" />
                                    <span className="font-medium text-gray-900 line-clamp-1">{p.name}</span>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500">{p.category}</td>
                                <td className="px-6 py-4 text-sm text-gray-500">{p.vendorName}</td>
                                <td className="px-6 py-4 font-bold text-gray-900">${p.price}</td>
                                <td className="px-6 py-4 text-right">
                                    <button 
                                        onClick={() => handleDeleteProduct(p.id)}
                                        className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors"
                                        title="Delete Product"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
         </div>
      )}

      {activeTab === 'orders' && (
         <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-slide-up">
            <div className="p-6 border-b border-gray-100">
                <h3 className="font-bold text-lg">Platform Orders</h3>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 text-gray-600 text-xs uppercase">
                        <tr>
                            <th className="px-6 py-4">Order ID</th>
                            <th className="px-6 py-4">Date</th>
                            <th className="px-6 py-4">Customer</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4 text-right">Total</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {orders.map(o => (
                            <tr key={o.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 font-mono text-xs text-gray-500">{o.id}</td>
                                <td className="px-6 py-4 text-sm">{o.date}</td>
                                <td className="px-6 py-4 text-sm font-medium">{users.find(u => u.id === o.userId)?.name || 'Unknown'}</td>
                                <td className="px-6 py-4">
                                     <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                                        o.status === 'delivered' ? 'bg-green-100 text-green-700' :
                                        o.status === 'shipped' ? 'bg-blue-100 text-blue-700' :
                                        'bg-yellow-100 text-yellow-700'
                                    }`}>
                                        {o.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right font-bold text-gray-900">${o.total.toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
         </div>
      )}
    </div>
  );
};

// Helper component for Icon
const LayoutGrid = ({ size }: { size: number }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></svg>
);

export default AdminDashboard;