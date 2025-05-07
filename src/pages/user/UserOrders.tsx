import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { orderService } from '../../services/orderService';
import { Order } from '../../types/menu';
import OrderCard from '../../components/OrderCard';
import { LayoutList, Clock, CheckCheck, XCircle } from 'lucide-react';
import Button from '../../components/ui/Button';

const UserOrders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        if (user) {
          const userOrders = await orderService.getUserOrders(user.id);
          setOrders(userOrders);
          setFilteredOrders(userOrders);
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchOrders();
  }, [user]);
  
  // Apply filters
  useEffect(() => {
    if (filter === 'all') {
      setFilteredOrders(orders);
    } else {
      setFilteredOrders(orders.filter(order => order.status === filter));
    }
  }, [filter, orders]);
  
  const handleFilterChange = (newFilter: string) => {
    setFilter(newFilter);
  };
  
  return (
    <div className="py-8 px-4 md:px-6">
      <div className="container-custom">
        <h1 className="text-2xl md:text-3xl font-bold mb-8">My Orders</h1>
        
        {/* Filter Tabs */}
        <div className="mb-8 overflow-x-auto">
          <div className="flex space-x-2 min-w-max p-1">
            <Button
              variant={filter === 'all' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => handleFilterChange('all')}
              className="gap-1.5"
            >
              <LayoutList className="h-4 w-4" />
              All Orders
            </Button>
            
            <Button
              variant={filter === 'pending' || filter === 'preparing' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => handleFilterChange('preparing')}
              className="gap-1.5"
            >
              <Clock className="h-4 w-4" />
              In Progress
            </Button>
            
            <Button
              variant={filter === 'ready' || filter === 'completed' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => handleFilterChange('completed')}
              className="gap-1.5"
            >
              <CheckCheck className="h-4 w-4" />
              Completed
            </Button>
            
            <Button
              variant={filter === 'cancelled' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => handleFilterChange('cancelled')}
              className="gap-1.5"
            >
              <XCircle className="h-4 w-4" />
              Cancelled
            </Button>
          </div>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="loading-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        ) : filteredOrders.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredOrders.map(order => (
              <OrderCard
                key={order.id}
                order={order}
                showDetails={true}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-lg shadow-sm">
            <LayoutList className="h-16 w-16 mx-auto text-gray-300 mb-4" />
            <h2 className="text-xl font-semibold text-gray-700 mb-2">No orders found</h2>
            <p className="text-gray-500 mb-6">
              {filter === 'all'
                ? "You haven't placed any orders yet."
                : `You don't have any ${filter} orders.`}
            </p>
            <Button 
              variant="primary" 
              onClick={() => handleFilterChange('all')}
              className="mr-2"
            >
              {filter === 'all' ? 'Browse Menu' : 'View All Orders'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserOrders;