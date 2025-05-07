import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { orderService } from '../../services/orderService';
import { Order } from '../../types/menu';
import { CheckCircle, Clock, Home, FileText } from 'lucide-react';
import Button from '../../components/ui/Button';
import QRCode from 'qrcode.react';

const OrderSuccess = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        if (!orderId) {
          setError('Order ID is missing');
          setIsLoading(false);
          return;
        }
        
        const orderData = await orderService.getOrderById(orderId);
        setOrder(orderData);
        
      } catch (error) {
        console.error('Error fetching order:', error);
        setError('Could not load order details');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchOrder();
  }, [orderId]);
  
  if (isLoading) {
    return (
      <div className="min-h-[80vh] flex justify-center items-center">
        <div className="loading-dots">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    );
  }
  
  if (error || !order) {
    return (
      <div className="min-h-[80vh] flex flex-col justify-center items-center p-4">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Error</h1>
        <p className="text-gray-600 mb-8">{error || 'Could not load order details'}</p>
        <Link to="/menu">
          <Button variant="primary">Back to Menu</Button>
        </Link>
      </div>
    );
  }
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    }).format(date);
  };
  
  // Calculate estimated pickup time
  const calculatePickupTime = () => {
    const orderDate = new Date(order.orderDate);
    const pickupTime = new Date(orderDate.getTime() + order.preparationTime * 60000);
    
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    }).format(pickupTime);
  };
  
  return (
    <div className="py-8 px-4 md:px-6">
      <div className="container-custom max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Success Header */}
          <div className="bg-primary-600 text-white p-6 text-center">
            <CheckCircle className="h-16 w-16 mx-auto mb-4" />
            <h1 className="text-2xl md:text-3xl font-bold mb-2">Order Confirmed!</h1>
            <p className="opacity-90">Your order has been successfully placed.</p>
          </div>
          
          {/* Order Details */}
          <div className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row justify-between mb-8">
              <div className="mb-4 md:mb-0">
                <h2 className="text-sm text-gray-500">ORDER NUMBER</h2>
                <p className="text-lg font-semibold">#{order.id}</p>
              </div>
              
              <div className="mb-4 md:mb-0">
                <h2 className="text-sm text-gray-500">ORDER DATE</h2>
                <p className="text-lg font-semibold">{formatDate(order.orderDate)}</p>
              </div>
              
              <div>
                <h2 className="text-sm text-gray-500">TOTAL AMOUNT</h2>
                <p className="text-lg font-semibold text-primary-600">
                  ${order.totalAmount.toFixed(2)}
                </p>
              </div>
            </div>
            
            {/* QR Code */}
            <div className="flex flex-col items-center justify-center mb-8 p-6 border rounded-lg bg-gray-50">
              <div className="mb-4 p-4 bg-white rounded-lg shadow-sm">
                <QRCode
                  value={order.qrCode}
                  size={160}
                  level="M"
                  renderAs="svg"
                  includeMargin={true}
                  fgColor="#000000"
                  bgColor="#FFFFFF"
                />
              </div>
              <p className="text-lg font-semibold mb-2">QR Code: {order.qrCode}</p>
              <p className="text-sm text-gray-600 text-center">
                Show this QR code when you pick up your order at the canteen.
              </p>
            </div>
            
            {/* Pickup Information */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold mb-4">Pickup Information</h2>
              <div className="flex items-start gap-4 p-4 border rounded-lg bg-primary-50">
                <Clock className="h-6 w-6 text-primary-600 flex-shrink-0 mt-1" />
                <div>
                  <p className="font-medium text-gray-900">
                    Estimated pickup time: <span className="font-semibold">{calculatePickupTime()}</span>
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    Your order will be ready in approximately {order.preparationTime} minutes.
                  </p>
                </div>
              </div>
            </div>
            
            {/* Order Items */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold mb-4">Order Items</h2>
              <div className="border rounded-lg overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-4 py-3 text-sm font-medium text-gray-500">Item</th>
                      <th className="px-4 py-3 text-sm font-medium text-gray-500">Qty</th>
                      <th className="px-4 py-3 text-sm font-medium text-gray-500 text-right">Price</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {order.items.map((item, index) => (
                      <tr key={index}>
                        <td className="px-4 py-3 font-medium">{item.name}</td>
                        <td className="px-4 py-3 text-gray-600">{item.quantity}</td>
                        <td className="px-4 py-3 text-right font-medium">
                          ${(item.price * item.quantity).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-gray-50 border-t">
                    <tr>
                      <td className="px-4 py-3 font-medium" colSpan={2}>
                        Total
                      </td>
                      <td className="px-4 py-3 text-right font-semibold text-primary-600">
                        ${order.totalAmount.toFixed(2)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/menu" className="flex-1">
                <Button
                  variant="outline"
                  fullWidth
                  className="gap-2"
                >
                  <Home className="h-4 w-4" />
                  Order More
                </Button>
              </Link>
              
              <Link to="/orders" className="flex-1">
                <Button
                  variant="primary"
                  fullWidth
                  className="gap-2"
                >
                  <FileText className="h-4 w-4" />
                  View Orders
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;