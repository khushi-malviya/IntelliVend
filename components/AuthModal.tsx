import React, { useState } from 'react';
import { X, Mail, Lock, User, ArrowRight, Store, ShoppingBag, MapPin, Calendar, ChevronLeft, ShieldAlert, KeyRound, Check } from 'lucide-react';
import { UserRole, Address } from '../types';
import { db } from '../services/db';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (email: string, role: UserRole) => void;
  onRegister: (
    name: string, 
    email: string, 
    role: UserRole, 
    details: { age: string; gender: string; address: Address }
  ) => void;
}

type AuthView = 'LOGIN' | 'REGISTER' | 'FORGOT_EMAIL' | 'FORGOT_RESET';

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLogin, onRegister }) => {
  const [view, setView] = useState<AuthView>('LOGIN');
  const [step, setStep] = useState(1); // Only for Register flow
  const [role, setRole] = useState<UserRole>(UserRole.BUYER);
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState<{type: 'success' | 'error', msg: string} | null>(null);

  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    password: '',
    confirmPassword: '',
    resetCode: '',
    age: '',
    gender: 'Prefer not to say',
    street: '',
    city: '',
    state: '',
    zip: ''
  });

  if (!isOpen) return null;

  const handleNextRegisterStep = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
  };

  const resetState = () => {
    setView('LOGIN');
    setStep(1);
    setFeedback(null);
    setFormData(prev => ({ ...prev, password: '', confirmPassword: '', resetCode: '' }));
  };

  const handleBack = () => {
    if (view === 'REGISTER' && step === 2) {
      setStep(1);
    } else if (view === 'FORGOT_EMAIL' || view === 'FORGOT_RESET') {
      setView('LOGIN');
      setFeedback(null);
    } else {
      setView('LOGIN');
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(formData.email, role);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const address: Address = {
      street: formData.street,
      city: formData.city,
      state: formData.state,
      zip: formData.zip
    };
    onRegister(
      formData.name, 
      formData.email, 
      role, 
      { 
        age: formData.age, 
        gender: formData.gender, 
        address 
      }
    );
  };

  const handleForgotEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setFeedback(null);
    try {
      await db.requestPasswordReset(formData.email);
      setFeedback({ type: 'success', msg: 'Reset code sent! Use 123456' }); // Demo code shown
      setTimeout(() => {
        setFeedback(null);
        setView('FORGOT_RESET');
      }, 1500);
    } catch (error) {
      setFeedback({ type: 'error', msg: 'Failed to send reset link' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setFeedback({ type: 'error', msg: 'Passwords do not match' });
      return;
    }
    setIsLoading(true);
    try {
      await db.resetPassword(formData.resetCode, formData.password);
      setFeedback({ type: 'success', msg: 'Password updated successfully' });
      setTimeout(() => {
        resetState();
      }, 1500);
    } catch (error) {
      setFeedback({ type: 'error', msg: 'Invalid reset code' });
    } finally {
      setIsLoading(false);
    }
  };

  // Dynamic Content based on View
  const getHeaderTitle = () => {
    switch (view) {
      case 'LOGIN': return 'Welcome Back';
      case 'REGISTER': return step === 1 ? 'Create Account' : 'Complete Profile';
      case 'FORGOT_EMAIL': return 'Reset Password';
      case 'FORGOT_RESET': return 'New Password';
      default: return 'IntelliVend';
    }
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity" onClick={onClose} />
      
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-slide-up">
        {/* Header Graphic */}
        <div className="h-32 bg-gradient-to-br from-indigo-600 to-purple-700 flex items-center justify-center relative">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          <h2 className="text-2xl font-bold text-white relative z-10 transition-all duration-300">
            {getHeaderTitle()}
          </h2>
          <button onClick={onClose} className="absolute top-4 right-4 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-1.5 rounded-full transition-colors z-20">
            <X size={20} />
          </button>
          
          {(view === 'FORGOT_EMAIL' || view === 'FORGOT_RESET' || (view === 'REGISTER' && step === 2)) && (
             <button onClick={handleBack} className="absolute top-4 left-4 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-1.5 rounded-full transition-colors z-20">
               <ChevronLeft size={20} />
             </button>
          )}
        </div>

        <div className="p-8">
          {/* Feedback Message */}
          {feedback && (
            <div className={`mb-6 p-3 rounded-xl text-sm font-medium flex items-center gap-2 animate-fade-in ${feedback.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
              {feedback.type === 'success' ? <Check size={16} /> : <ShieldAlert size={16} />}
              {feedback.msg}
            </div>
          )}

          {view === 'LOGIN' && (
            <div className="animate-fade-in">
              {/* Role Selection */}
              <div className="flex p-1 bg-gray-100 rounded-xl mb-6">
                <button type="button" onClick={() => setRole(UserRole.BUYER)} className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-xs sm:text-sm font-medium rounded-lg transition-all ${role === UserRole.BUYER ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}> <ShoppingBag size={14} /> Buyer </button>
                <button type="button" onClick={() => setRole(UserRole.VENDOR)} className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-xs sm:text-sm font-medium rounded-lg transition-all ${role === UserRole.VENDOR ? 'bg-white text-purple-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}> <Store size={14} /> Vendor </button>
                <button type="button" onClick={() => setRole(UserRole.ADMIN)} className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-xs sm:text-sm font-medium rounded-lg transition-all ${role === UserRole.ADMIN ? 'bg-white text-red-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}> <ShieldAlert size={14} /> Admin </button>
              </div>

              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
                    <input required type="email" className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all" placeholder="you@example.com" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-medium text-gray-700">Password</label>
                    <button type="button" onClick={() => setView('FORGOT_EMAIL')} className="text-xs font-semibold text-indigo-600 hover:text-indigo-800">Forgot Password?</button>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
                    <input required type="password" className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all" placeholder="••••••••" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} />
                  </div>
                </div>

                <button type="submit" className={`w-full py-3 rounded-xl text-white font-semibold shadow-lg transition-all flex items-center justify-center gap-2 mt-2 ${role === UserRole.VENDOR ? 'bg-purple-600 hover:bg-purple-700 shadow-purple-500/30' : role === UserRole.ADMIN ? 'bg-gray-800 hover:bg-gray-900 shadow-gray-500/30' : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-500/30'}`}>
                  Sign In <ArrowRight size={18} />
                </button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-500">
                  Don't have an account?{' '}
                  <button onClick={() => { setView('REGISTER'); setStep(1); }} className="font-semibold text-indigo-600 hover:text-indigo-700 transition-colors">Sign up</button>
                </p>
              </div>
            </div>
          )}

          {view === 'REGISTER' && step === 1 && (
            <div className="animate-fade-in">
              {/* Role Selection */}
              <div className="flex p-1 bg-gray-100 rounded-xl mb-6">
                <button type="button" onClick={() => setRole(UserRole.BUYER)} className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-xs sm:text-sm font-medium rounded-lg transition-all ${role === UserRole.BUYER ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}> <ShoppingBag size={14} /> Buyer </button>
                <button type="button" onClick={() => setRole(UserRole.VENDOR)} className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-xs sm:text-sm font-medium rounded-lg transition-all ${role === UserRole.VENDOR ? 'bg-white text-purple-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}> <Store size={14} /> Vendor </button>
                <button type="button" onClick={() => setRole(UserRole.ADMIN)} className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-xs sm:text-sm font-medium rounded-lg transition-all ${role === UserRole.ADMIN ? 'bg-white text-red-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}> <ShieldAlert size={14} /> Admin </button>
              </div>

              <form onSubmit={handleNextRegisterStep} className="space-y-4">
                <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 text-gray-400" size={18} />
                      <input required type="text" className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all" placeholder="John Doe" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                    </div>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
                    <input required type="email" className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all" placeholder="you@example.com" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
                    <input required type="password" className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all" placeholder="••••••••" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} />
                  </div>
                </div>

                <button type="submit" className={`w-full py-3 rounded-xl text-white font-semibold shadow-lg transition-all flex items-center justify-center gap-2 mt-2 ${role === UserRole.VENDOR ? 'bg-purple-600 hover:bg-purple-700 shadow-purple-500/30' : role === UserRole.ADMIN ? 'bg-gray-800 hover:bg-gray-900 shadow-gray-500/30' : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-500/30'}`}>
                  Next Step <ArrowRight size={18} />
                </button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-500">
                  Already have an account?{' '}
                  <button onClick={() => { setView('LOGIN'); }} className="font-semibold text-indigo-600 hover:text-indigo-700 transition-colors">Log in</button>
                </p>
              </div>
            </div>
          )}

          {view === 'REGISTER' && step === 2 && (
            <form onSubmit={handleRegisterSubmit} className="space-y-4 animate-fade-in">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Age</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 text-gray-400" size={18} />
                    <input required type="number" min="13" max="120" className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all" placeholder="25" value={formData.age} onChange={e => setFormData({ ...formData, age: e.target.value })} />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Gender</label>
                  <select className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all appearance-none" value={formData.gender} onChange={e => setFormData({ ...formData, gender: e.target.value })}>
                    <option>Prefer not to say</option>
                    <option>Male</option>
                    <option>Female</option>
                    <option>Non-binary</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Address</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 text-gray-400" size={18} />
                  <input required type="text" className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all" placeholder="123 Galaxy St" value={formData.street} onChange={e => setFormData({ ...formData, street: e.target.value })} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">City</label>
                  <input required type="text" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all" placeholder="New York" value={formData.city} onChange={e => setFormData({ ...formData, city: e.target.value })} />
                </div>
                 <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">State</label>
                  <input required type="text" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all" placeholder="NY" value={formData.state} onChange={e => setFormData({ ...formData, state: e.target.value })} />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">ZIP Code</label>
                <input required type="text" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all" placeholder="10001" value={formData.zip} onChange={e => setFormData({ ...formData, zip: e.target.value })} />
              </div>

              <button type="submit" className="w-full py-3 rounded-xl text-white font-semibold shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 transition-all flex items-center justify-center gap-2 mt-2 bg-indigo-600 hover:bg-indigo-700">
                Create Account <ArrowRight size={18} />
              </button>
            </form>
          )}

          {view === 'FORGOT_EMAIL' && (
            <div className="animate-fade-in space-y-6">
               <p className="text-sm text-gray-600">Enter your email address and we'll send you a link to reset your password.</p>
               <form onSubmit={handleForgotEmailSubmit} className="space-y-6">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
                    <input required type="email" className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all" placeholder="you@example.com" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                  </div>
                </div>
                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full py-3 rounded-xl text-white font-semibold shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 transition-all flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Sending...' : 'Send Reset Link'} <ArrowRight size={18} />
                </button>
               </form>
            </div>
          )}

          {view === 'FORGOT_RESET' && (
             <div className="animate-fade-in space-y-4">
               <p className="text-sm text-gray-600">Enter the code sent to your email and choose a new password.</p>
               <form onSubmit={handleResetPasswordSubmit} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">Reset Code</label>
                    <div className="relative">
                      <KeyRound className="absolute left-3 top-3 text-gray-400" size={18} />
                      <input required type="text" className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all tracking-widest font-mono" placeholder="123456" value={formData.resetCode} onChange={e => setFormData({ ...formData, resetCode: e.target.value })} />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">New Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
                      <input required type="password" className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all" placeholder="••••••••" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">Confirm Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
                      <input required type="password" className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all" placeholder="••••••••" value={formData.confirmPassword} onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })} />
                    </div>
                  </div>
                  <button 
                    type="submit" 
                    disabled={isLoading}
                    className="w-full py-3 rounded-xl text-white font-semibold shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 transition-all flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-70 disabled:cursor-not-allowed mt-2"
                  >
                    {isLoading ? 'Updating...' : 'Update Password'} <ArrowRight size={18} />
                  </button>
               </form>
             </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default AuthModal;