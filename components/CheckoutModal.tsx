import React, { useState } from 'react';
import { X, CreditCard, MapPin, Check, Loader2, ShieldCheck, ChevronRight, ShoppingBag } from 'lucide-react';
import { CartItem, Address } from '../types';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onSuccess: () => void;
}

const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose, cartItems, onSuccess }) => {
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [address, setAddress] = useState<Address>({ street: '', city: '', state: '', zip: '' });
  const [payment, setPayment] = useState({ number: '', expiry: '', cvc: '', name: '' });

  if (!isOpen) return null;

  const total = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const tax = total * 0.08;
  const shipping = total > 100 ? 0 : 15;
  const grandTotal = total + tax + shipping;

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsProcessing(false);
    onSuccess();
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-4xl h-[600px] overflow-hidden flex animate-slide-up">
        
        {/* Left Side - Summary (Hidden on Mobile) */}
        <div className="hidden md:block w-1/3 bg-gray-50 border-r border-gray-100 p-8 overflow-y-auto">
          <div className="flex items-center gap-2 mb-8">
            <ShoppingBag className="text-indigo-600" />
            <h3 className="font-bold text-gray-900">Order Summary</h3>
          </div>
          
          <div className="space-y-4 mb-8">
            {cartItems.map(item => (
              <div key={item.id} className="flex gap-3">
                <div className="w-16 h-16 rounded-lg bg-gray-200 overflow-hidden flex-shrink-0">
                  <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 line-clamp-1">{item.name}</p>
                  <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                  <p className="text-sm font-bold text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-200 pt-4 space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Subtotal</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>Tax (8%)</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>Shipping</span>
              <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
            </div>
            <div className="flex justify-between text-lg font-bold text-gray-900 pt-2">
              <span>Total</span>
              <span>${grandTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Right Side - Steps */}
        <div className="flex-1 flex flex-col relative">
          <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-2">
            <X size={20} />
          </button>

          {/* Progress Header */}
          <div className="p-8 pb-4 border-b border-gray-100">
            <div className="flex items-center justify-between max-w-md mx-auto">
              {[
                { s: 1, label: 'Shipping', icon: MapPin },
                { s: 2, label: 'Payment', icon: CreditCard },
                { s: 3, label: 'Review', icon: Check }
              ].map((item, idx) => (
                <div key={item.s} className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                    step >= item.s ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-400'
                  }`}>
                    <item.icon size={14} />
                  </div>
                  <span className={`text-sm font-medium hidden sm:block ${step >= item.s ? 'text-indigo-900' : 'text-gray-400'}`}>
                    {item.label}
                  </span>
                  {idx < 2 && <ChevronRight size={16} className="text-gray-300 ml-2 hidden sm:block" />}
                </div>
              ))}
            </div>
          </div>

          {/* Form Content */}
          <div className="flex-1 p-8 overflow-y-auto">
            <form id="checkout-form" onSubmit={handlePayment} className="max-w-md mx-auto space-y-6">
              
              {step === 1 && (
                <div className="space-y-4 animate-fade-in">
                  <h2 className="text-2xl font-bold text-gray-900">Shipping Address</h2>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Street Address</label>
                      <input required type="text" className="w-full mt-1 p-3 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500" 
                        value={address.street} onChange={e => setAddress({...address, street: e.target.value})} placeholder="123 Galaxy Way" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700">City</label>
                        <input required type="text" className="w-full mt-1 p-3 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500" 
                          value={address.city} onChange={e => setAddress({...address, city: e.target.value})} placeholder="New York" />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">ZIP Code</label>
                        <input required type="text" className="w-full mt-1 p-3 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500" 
                          value={address.zip} onChange={e => setAddress({...address, zip: e.target.value})} placeholder="10001" />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4 animate-fade-in">
                  <h2 className="text-2xl font-bold text-gray-900">Payment Details</h2>
                  
                  {/* Card Visual */}
                  <div className="w-full h-48 rounded-xl bg-gradient-to-br from-gray-900 to-gray-800 p-6 text-white shadow-lg mb-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
                    <div className="flex justify-between items-start mb-8">
                      <CreditCard size={32} className="text-white/80" />
                      <span className="font-mono text-sm opacity-50">DEBIT</span>
                    </div>
                    <div className="font-mono text-2xl tracking-widest mb-4">
                      {payment.number || '0000 0000 0000 0000'}
                    </div>
                    <div className="flex justify-between items-end">
                      <div>
                        <p className="text-xs opacity-50 uppercase">Card Holder</p>
                        <p className="font-medium tracking-wide uppercase">{payment.name || 'YOUR NAME'}</p>
                      </div>
                      <div>
                        <p className="text-xs opacity-50 uppercase text-right">Expires</p>
                        <p className="font-medium tracking-wide">{payment.expiry || 'MM/YY'}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Card Number</label>
                      <input required type="text" maxLength={19} className="w-full mt-1 p-3 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500" 
                        value={payment.number} onChange={e => setPayment({...payment, number: e.target.value})} placeholder="0000 0000 0000 0000" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Cardholder Name</label>
                      <input required type="text" className="w-full mt-1 p-3 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500" 
                        value={payment.name} onChange={e => setPayment({...payment, name: e.target.value})} placeholder="John Doe" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700">Expiry Date</label>
                        <input required type="text" maxLength={5} className="w-full mt-1 p-3 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500" 
                          value={payment.expiry} onChange={e => setPayment({...payment, expiry: e.target.value})} placeholder="MM/YY" />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">CVC</label>
                        <input required type="password" maxLength={3} className="w-full mt-1 p-3 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500" 
                          value={payment.cvc} onChange={e => setPayment({...payment, cvc: e.target.value})} placeholder="123" />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-6 animate-fade-in text-center py-4">
                  <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto text-indigo-600 mb-4">
                    <ShieldCheck size={40} />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Confirm Purchase</h2>
                  <p className="text-gray-500 max-w-xs mx-auto">
                    You are about to pay <span className="font-bold text-gray-900">${grandTotal.toFixed(2)}</span>. 
                    Please review your order details.
                  </p>
                  
                  <div className="bg-gray-50 p-4 rounded-xl text-left text-sm space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Ship to:</span>
                      <span className="font-medium text-gray-900 text-right">{address.street}, {address.city}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Payment:</span>
                      <span className="font-medium text-gray-900">Ending in {payment.number.slice(-4)}</span>
                    </div>
                  </div>
                </div>
              )}
            </form>
          </div>

          {/* Footer Actions */}
          <div className="p-8 border-t border-gray-100 flex justify-between items-center bg-gray-50/50">
            {step > 1 ? (
              <button 
                type="button" 
                onClick={() => setStep(step - 1)} 
                className="text-gray-500 font-medium hover:text-gray-800 transition-colors"
              >
                Back
              </button>
            ) : (
              <div></div>
            )}
            
            {step < 3 ? (
              <button 
                type="button" 
                onClick={handleNext} 
                disabled={step === 1 ? (!address.street || !address.zip) : (!payment.number || !payment.cvc)}
                className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-indigo-500/30"
              >
                Next Step
              </button>
            ) : (
              <button 
                onClick={handlePayment} 
                disabled={isProcessing}
                className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 disabled:opacity-80 transition-all shadow-lg shadow-indigo-500/30 flex items-center gap-2 min-w-[160px] justify-center"
              >
                {isProcessing ? <Loader2 className="animate-spin" /> : <>Confirm Payment</>}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutModal;
