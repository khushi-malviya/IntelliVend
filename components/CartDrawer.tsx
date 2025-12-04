import React from 'react';
import { X, Trash2, ShoppingBag, CreditCard } from 'lucide-react';
import { CartItem } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onRemove: (id: string) => void;
  onUpdateQuantity: (id: string, delta: number) => void;
  onCheckout?: () => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose, items, onRemove, onUpdateQuantity, onCheckout }) => {
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>, productName: string) => {
    const encodedName = encodeURIComponent(productName);
    e.currentTarget.src = `https://placehold.co/200x200/f3f4f6/9ca3af?text=${encodedName}`;
    e.currentTarget.onerror = null;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] overflow-hidden">
      <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity" onClick={onClose} />
      
      <div className="fixed inset-y-0 right-0 pl-10 max-w-full flex">
        <div className="w-screen max-w-md animate-slide-up">
          <div className="h-full flex flex-col bg-white shadow-2xl">
            <div className="flex-1 py-6 overflow-y-auto px-4 sm:px-6">
              <div className="flex items-start justify-between">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <ShoppingBag className="text-indigo-600" /> Your Cart
                </h2>
                <div className="ml-3 h-7 flex items-center">
                  <button onClick={onClose} className="bg-gray-100 rounded-full p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-200 transition-colors">
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div className="mt-8">
                {items.length === 0 ? (
                  <div className="text-center py-20 flex flex-col items-center">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-gray-400">
                      <ShoppingBag size={32} />
                    </div>
                    <p className="text-gray-900 font-medium text-lg">Your cart is empty.</p>
                    <p className="text-gray-500 mt-1">Looks like you haven't added anything yet.</p>
                    <button onClick={onClose} className="mt-6 text-indigo-600 font-medium hover:text-indigo-700">
                      Start Shopping &rarr;
                    </button>
                  </div>
                ) : (
                  <div className="flow-root">
                    <ul role="list" className="-my-6 divide-y divide-gray-100">
                      {items.map((product) => (
                        <li key={product.id} className="py-6 flex">
                          <div className="flex-shrink-0 w-24 h-24 border border-gray-200 rounded-xl overflow-hidden bg-gray-50">
                            <img
                              src={product.imageUrl}
                              alt={product.name}
                              className="w-full h-full object-center object-cover"
                              onError={(e) => handleImageError(e, product.name)}
                            />
                          </div>

                          <div className="ml-4 flex-1 flex flex-col">
                            <div>
                              <div className="flex justify-between text-base font-medium text-gray-900">
                                <h3 className="line-clamp-1 mr-2">{product.name}</h3>
                                <p>${(product.price * product.quantity).toFixed(2)}</p>
                              </div>
                              <p className="mt-1 text-sm text-gray-500">{product.category}</p>
                            </div>
                            <div className="flex-1 flex items-end justify-between text-sm">
                              <div className="flex items-center border border-gray-200 rounded-lg bg-gray-50">
                                <button 
                                  onClick={() => onUpdateQuantity(product.id, -1)}
                                  className="px-3 py-1 hover:bg-white rounded-l-lg transition-colors disabled:opacity-50"
                                  disabled={product.quantity <= 1}
                                >-</button>
                                <span className="px-2 font-medium w-8 text-center">{product.quantity}</span>
                                <button 
                                  onClick={() => onUpdateQuantity(product.id, 1)}
                                  className="px-3 py-1 hover:bg-white rounded-r-lg transition-colors"
                                >+</button>
                              </div>

                              <button
                                type="button"
                                onClick={() => onRemove(product.id)}
                                className="font-medium text-red-500 hover:text-red-600 flex items-center gap-1 p-2 hover:bg-red-50 rounded-lg transition-colors"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {items.length > 0 && (
              <div className="border-t border-gray-100 py-6 px-4 sm:px-6 bg-gray-50">
                <div className="flex justify-between text-base font-medium text-gray-900 mb-4">
                  <p>Subtotal</p>
                  <p>${total.toFixed(2)}</p>
                </div>
                <button
                  onClick={() => {
                     onClose();
                     if (onCheckout) {
                       onCheckout();
                     } else {
                       window.dispatchEvent(new CustomEvent('initCheckout'));
                     }
                  }}
                  className="w-full flex justify-center items-center gap-2 px-6 py-4 border border-transparent rounded-xl shadow-lg shadow-indigo-500/20 text-base font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-all transform hover:-translate-y-1"
                >
                  <CreditCard size={20} /> Checkout Now
                </button>
                <div className="mt-4 flex justify-center text-sm text-center text-gray-500">
                  <p>
                    or{' '}
                    <button
                      type="button"
                      className="text-indigo-600 font-medium hover:text-indigo-500"
                      onClick={onClose}
                    >
                      Continue Shopping<span aria-hidden="true"> &rarr;</span>
                    </button>
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartDrawer;