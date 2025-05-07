import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, ChevronRight } from 'lucide-react';
import { Order } from '../types/menu';
import Badge from './ui/Badge';

interface OrderCardProps {
  order: Order;
  showDetails?: boolean;
  isStoreView?: boolean;
}

const OrderCard: React.FC<OrderCardProps> = ({ 
  order, 
  showDetails = true,
  isStoreView = false 
}) => {
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
  
  // Determine badge style based on status
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="warning">Pending</Badge>;
      case 'preparing':
        return <Badge variant="secondary">Preparing</Badge>;
      case 'ready':
        return <Badge variant="primary">Ready for Pickup</Badge>;
      case 'completed':
        return <Badge variant="success">Completed</Badge>;
      case 'cancelled':
        return <Badge variant="error">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="warning">Payment Pending</Badge>;
      case 'paid':
        return <Badge variant="success">Paid</Badge>;
      case 'failed':
        return <Badge variant="error">Payment Failed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="font-medium text-gray-900">Order #{order.id}</h3>
            <p className="text-sm text-gray-500">{formatDate(order.orderDate)}</p>
          </div>
          <div className="flex flex-col items-end gap-1">
            {getStatusBadge(order.status)}
            {getPaymentStatusBadge(order.paymentStatus)}
          </div>
        </div>
        
        <div className="mb-3">
          <p className="text-sm font-medium text-gray-700">Items:</p>
          <ul className="mt-1 text-sm text-gray-600">
            {order.items.slice(0, 2).map((item, index) => (
              <li key={index} className="flex justify-between">
                <span>
                  {item.name} x{item.quantity}
                </span>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </li>
            ))}
            {order.items.length > 2 && (
              <li className="text-gray-500 italic">
                +{order.items.length - 2} more items
              </li>
            )}
          </ul>
        </div>
        
        <div className="flex justify-between items-center pt-2 border-t border-gray-100">
          <div className="flex items-center text-sm text-gray-500">
            <Clock className="mr-1 h-4 w-4" />
            <span>Prep time: {order.preparationTime} mins</span>
          </div>
          <p className="font-medium text-primary-600">
            Total: ${order.totalAmount.toFixed(2)}
          </p>
        </div>
        
        {showDetails && (
          <div className="mt-4">
            {isStoreView ? (
              <Link 
                to={`/store/orders/${order.id}`}
                className="flex items-center justify-center w-full py-2 px-4 bg-primary-50 text-primary-600 text-sm font-medium rounded-md hover:bg-primary-100 transition-colors"
              >
                Manage Order
                <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            ) : (
              <Link 
                to={`/orders/${order.id}`}
                className="flex items-center justify-center w-full py-2 px-4 bg-primary-50 text-primary-600 text-sm font-medium rounded-md hover:bg-primary-100 transition-colors"
              >
                View Details
                <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderCard;