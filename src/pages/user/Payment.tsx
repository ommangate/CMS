import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import { orderService } from '../../services/orderService';
import { CreditCard, DollarSign, ArrowLeft } from 'lucide-react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import toast from 'react-hot-toast';

const Payment = () => {
  const { user } = useAuth();
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();
  
  const [paymentMethod, setPaymentMethod] = useState('credit-card');
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Check if cart is empty and redirect if needed
  useEffect(() => {
    if (cart.items.length === 0) {
      toast.error('Your cart is empty');
      navigate('/cart');
    }
  }, [cart.items.length, navigate]);
  
  const validateForm = () => {
    if (paymentMethod === 'credit-card') {
      if (!cardNumber.trim() || cardNumber.length < 16) {
        toast.error('Please enter a valid card number');
        return false;
      }
      
      if (!cardName.trim()) {
        toast.error('Please enter the cardholder name');
        return false;
      }
      
      if (!expiryDate.trim() || !expiryDate.match(/^\d{2}\/\d{2}$/)) {
        toast.error('Please enter a valid expiry date (MM/YY)');
        return false;
      }
      
      if (!cvv.trim() || cvv.length < 3) {
        toast.error('Please enter a valid CVV');
        return false;
      }
    }
    
    return true;
  };
  
  const handlePayment = async () => {
    if (!validateForm()) return;
    
    try {
      setIsLoading(true);
      
      // First, place the order
      const orderItems = cart.items.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity
      }));
      
      const newOrder = await orderService.placeOrder(
        user!.id,
        orderItems,
        cart.totalAmount
      );
      
      // Then process the payment
      const paymentDetails = {
        cardNumber: paymentMethod === 'credit-card' ? cardNumber : 'N/A',
        cardName: paymentMethod === 'credit-card' ? cardName : 'N/A',
        expiryDate: paymentMethod === 'credit-card' ? expiryDate : 'N/A',
        cvv: paymentMethod === 'credit-card' ? cvv : 'N/A'
      };
      
      await orderService.processPayment(newOrder.id, paymentMethod, paymentDetails);
      
      // Clear cart and redirect to success page
      clearCart();
      navigate(`/order-success/${newOrder.id}`);
      
    } catch (error) {
      console.error('Payment failed:', error);
      toast.error('Payment failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Format card number with spaces
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];
    
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    
    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };
  
  // Format expiry date (MM/YY)
  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    
    if (v.length >= 2) {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`;
    }
    
    return v;
  };
  
  return (
    <div className="py-8 px-4 md:px-6">
      <div className="container-custom max-w-3xl mx-auto">
        <div className="mb-4">
          <button
            onClick={() => navigate('/cart')}
            className="flex items-center text-gray-600 hover:text-primary-600 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            <span>Back to Cart</span>
          </button>
        </div>
        
        <h1 className="text-2xl md:text-3xl font-bold mb-8">Payment</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Order Summary */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
              
              <div className="divide-y">
                {cart.items.map(item => (
                  <div key={item.id} className="py-3 flex justify-between">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-500">x{item.quantity}</p>
                    </div>
                    <p className="font-medium">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
              
              <div className="border-t mt-4 pt-4">
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span className="text-primary-600">
                    ${cart.totalAmount.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Payment Form */}
          <div className="md:col-span-3">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">Payment Method</h2>
              
              {/* Payment Method Selection */}
              <div className="mb-6">
                <div className="space-y-3">
                  <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="credit-card"
                      checked={paymentMethod === 'credit-card'}
                      onChange={() => setPaymentMethod('credit-card')}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="ml-3 flex items-center">
                      <CreditCard className="h-5 w-5 mr-2 text-gray-600" />
                      Credit/Debit Card
                    </span>
                  </label>
                  
                  <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cash"
                      checked={paymentMethod === 'cash'}
                      onChange={() => setPaymentMethod('cash')}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="ml-3 flex items-center">
                      <DollarSign className="h-5 w-5 mr-2 text-gray-600" />
                      Cash on Pickup
                    </span>
                  </label>
                </div>
              </div>
              
              {/* Credit Card Form */}
              {paymentMethod === 'credit-card' && (
                <div className="space-y-4">
                  <Input
                    label="Card Number"
                    type="text"
                    placeholder="0000 0000 0000 0000"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                    maxLength={19}
                    fullWidth
                  />
                  
                  <Input
                    label="Cardholder Name"
                    type="text"
                    placeholder="John Smith"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    fullWidth
                  />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="Expiry Date"
                      type="text"
                      placeholder="MM/YY"
                      value={expiryDate}
                      onChange={(e) => setExpiryDate(formatExpiryDate(e.target.value))}
                      maxLength={5}
                    />
                    
                    <Input
                      label="CVV"
                      type="text"
                      placeholder="123"
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))}
                      maxLength={4}
                    />
                  </div>
                </div>
              )}
              
              {/* Cash on Pickup Notice */}
              {paymentMethod === 'cash' && (
                <div className="bg-primary-50 p-4 rounded-md mb-6">
                  <p className="text-primary-800">
                    You will pay in cash when you pick up your order at the canteen.
                  </p>
                </div>
              )}
              
              {/* Submit Button */}
              <div className="mt-6">
                <Button
                  variant="primary"
                  fullWidth
                  isLoading={isLoading}
                  onClick={handlePayment}
                >
                  {paymentMethod === 'credit-card' ? 'Pay Now' : 'Place Order'}
                </Button>
                
                <p className="text-xs text-gray-500 mt-4 text-center">
                  Your payment information is secure and encrypted.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;