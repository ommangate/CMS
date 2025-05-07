import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { Minus, Plus, Trash2, ArrowLeft, ShoppingBag } from 'lucide-react';
import Button from '../../components/ui/Button';
import toast from 'react-hot-toast';

const Cart = () => {
  const { cart, updateQuantity, removeItem } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isUpdatingCart, setIsUpdatingCart] = useState(false);

  const handleDecreaseQuantity = (id: string, currentQuantity: number) => {
    setIsUpdatingCart(true);
    if (currentQuantity > 1) {
      updateQuantity(id, currentQuantity - 1);
    } else {
      removeItem(id);
    }
    setTimeout(() => setIsUpdatingCart(false), 300);
  };

  const handleIncreaseQuantity = (id: string, currentQuantity: number) => {
    setIsUpdatingCart(true);
    updateQuantity(id, currentQuantity + 1);
    setTimeout(() => setIsUpdatingCart(false), 300);
  };

  const handleRemoveItem = (id: string) => {
    setIsUpdatingCart(true);
    removeItem(id);
    setTimeout(() => setIsUpdatingCart(false), 300);
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      toast.error('Please log in to proceed to checkout');
      navigate('/login');
      return;
    }
    
    if (cart.items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }
    
    navigate('/payment');
  };

  return (
    <div className="py-8 px-4 md:px-6">
      <div className="container-custom max-w-5xl mx-auto">
        <div className="mb-6">
          <Link to="/menu" className="flex items-center text-gray-600 hover:text-primary-600 transition-colors">
            <ArrowLeft className="h-4 w-4 mr-1" />
            <span>Continue Shopping</span>
          </Link>
        </div>
        
        <h1 className="text-2xl md:text-3xl font-bold mb-8">Your Cart</h1>
        
        {cart.items.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg shadow-sm">
            <ShoppingBag className="h-16 w-16 mx-auto text-gray-300 mb-4" />
            <h2 className="text-xl font-semibold text-gray-700 mb-2">Your cart is empty</h2>
            <p className="text-gray-500 mb-6">Looks like you haven't added any items to your cart yet.</p>
            <Link to="/menu">
              <Button variant="primary" className="px-6">
                Browse Menu
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="p-6">
                  <h2 className="text-lg font-semibold mb-4">Cart Items ({cart.totalItems})</h2>
                  
                  <div className="divide-y">
                    {cart.items.map((item) => (
                      <div key={item.id} className="py-4 flex items-start">
                        {/* Item Image */}
                        <div className="w-20 h-20 rounded-md overflow-hidden flex-shrink-0 bg-gray-100">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        
                        {/* Item Details */}
                        <div className="ml-4 flex-1">
                          <div className="flex justify-between">
                            <h3 className="font-medium text-gray-900">{item.name}</h3>
                            <p className="font-medium text-gray-900">
                              ${(item.price * item.quantity).toFixed(2)}
                            </p>
                          </div>
                          
                          <p className="text-sm text-gray-500 mt-1">
                            ${item.price.toFixed(2)} each
                          </p>
                          
                          <div className="flex items-center justify-between mt-4">
                            {/* Quantity Controls */}
                            <div className="flex items-center border rounded-md">
                              <button
                                className="px-2 py-1 text-gray-600 hover:text-primary-600 transition-colors"
                                onClick={() => handleDecreaseQuantity(item.id, item.quantity)}
                                disabled={isUpdatingCart}
                              >
                                <Minus className="h-4 w-4" />
                              </button>
                              
                              <span className="w-8 text-center">
                                {item.quantity}
                              </span>
                              
                              <button
                                className="px-2 py-1 text-gray-600 hover:text-primary-600 transition-colors"
                                onClick={() => handleIncreaseQuantity(item.id, item.quantity)}
                                disabled={isUpdatingCart}
                              >
                                <Plus className="h-4 w-4" />
                              </button>
                            </div>
                            
                            {/* Remove Button */}
                            <button
                              className="text-gray-500 hover:text-error-500 transition-colors"
                              onClick={() => handleRemoveItem(item.id)}
                              disabled={isUpdatingCart}
                            >
                              <Trash2 className="h-5 w-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-20">
                <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">${cart.totalAmount.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Discount</span>
                    <span className="font-medium">$0.00</span>
                  </div>
                  
                  <div className="border-t pt-3 flex justify-between">
                    <span className="font-semibold">Total</span>
                    <span className="font-semibold text-lg text-primary-600">
                      ${cart.totalAmount.toFixed(2)}
                    </span>
                  </div>
                </div>
                
                <Button
                  variant="primary"
                  fullWidth
                  onClick={handleCheckout}
                  disabled={cart.items.length === 0}
                >
                  Proceed to Checkout
                </Button>
                
                <p className="text-xs text-gray-500 mt-4 text-center">
                  By proceeding to checkout, you agree to our terms and conditions.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;