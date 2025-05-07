import React, { useState, useEffect } from 'react';
import { orderService } from '../../services/orderService';
import { Order } from '../../types/menu';
import OrderCard from '../../components/OrderCard';
import { LayoutList, Clock, CheckCheck, XCircle, RefreshCcw } from 'lucide-react';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import toast from 'react-hot-toast';

const StoreOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<string>('active');
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const allOrders = await orderService.getAllOrders();
      setOrders(allOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchOrders();
    
    // Poll for new orders every 30 seconds
    const interval = setInterval(() => {
      fetchOrders();
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Apply filters
  useEffect(() => {
    if (filter === 'all') {
      setFilteredOrders(orders);
    } else if (filter === 'active') {
      setFilteredOrders(
        orders.filter(order => 
          ['pending', 'preparing', 'ready'].includes(order.status) &&
          order.paymentStatus === 'paid'
        )
      );
    } else {
      setFilteredOrders(orders.filter(order => order.status === filter));
    }
  }, [filter, orders]);
  
  const handleFilterChange = (newFilter: string) => {
    setFilter(newFilter);
  };
  
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchOrders();
    setIsRefreshing(false);
    toast.success('Orders refreshed');
  };
  
  const handleUpdateStatus = async (orderId: string, newStatus: 'pending' | 'preparing' | 'ready' | 'completed' | 'cancelled') => {
    try {
      await orderService.updateOrderStatus(orderId, newStatus);
      
      // Update the orders in state
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
      
      toast.success(`Order #${orderId} updated to ${newStatus}`);
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Failed to update order status');
    }
  };
  
  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <h1 className="text-2xl font-bold mb-2 sm:mb-0">Order Management</h1>
        
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          isLoading={isRefreshing}
          className="self-start sm:self-auto"
        >
          <RefreshCcw className="h-4 w-4 mr-1" />
          Refresh
        </Button>
      </div>
      
      {/* Order Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h3 className="text-sm font-medium text-gray-500 mb-2">New Orders</h3>
          <div className="flex items-center justify-between">
            <p className="text-2xl font-bold">
              {orders.filter(order => order.status === 'pending' && order.paymentStatus === 'paid').length}
            </p>
            <Badge variant="secondary">Pending</Badge>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Preparing</h3>
          <div className="flex items-center justify-between">
            <p className="text-2xl font-bold">
              {orders.filter(order => order.status === 'preparing').length}
            </p>
            <Badge variant="warning">In Progress</Badge>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Ready for Pickup</h3>
          <div className="flex items-center justify-between">
            <p className="text-2xl font-bold">
              {orders.filter(order => order.status === 'ready').length}
            </p>
            <Badge variant="primary">Ready</Badge>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Completed Today</h3>
          <div className="flex items-center justify-between">
            <p className="text-2xl font-bold">
              {orders.filter(order => {
                const today = new Date();
                const orderDate = new Date(order.orderDate);
                return order.status === 'completed' && 
                  orderDate.getDate() === today.getDate() &&
                  orderDate.getMonth() === today.getMonth() &&
                  orderDate.getFullYear() === today.getFullYear();
              }).length}
            </p>
            <Badge variant="success">Completed</Badge>
          </div>
        </div>
      </div>
      
      {/* Filter Tabs */}
      <div className="mb-6 overflow-x-auto">
        <div className="flex space-x-2 min-w-max p-1">
          <Button
            variant={filter === 'active' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => handleFilterChange('active')}
            className="gap-1.5"
          >
            <Clock className="h-4 w-4" />
            Active Orders
          </Button>
          
          <Button
            variant={filter === 'pending' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => handleFilterChange('pending')}
            className="gap-1.5"
          >
            <Clock className="h-4 w-4" />
            New
          </Button>
          
          <Button
            variant={filter === 'preparing' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => handleFilterChange('preparing')}
            className="gap-1.5"
          >
            <Clock className="h-4 w-4" />
            Preparing
          </Button>
          
          <Button
            variant={filter === 'ready' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => handleFilterChange('ready')}
            className="gap-1.5"
          >
            <CheckCheck className="h-4 w-4" />
            Ready
          </Button>
          
          <Button
            variant={filter === 'completed' ? 'primary' : 'outline'}
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
          
          <Button
            variant={filter === 'all' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => handleFilterChange('all')}
            className="gap-1.5"
          >
            <LayoutList className="h-4 w-4" />
            All
          </Button>
        </div>
      </div>
      
      {/* Orders List */}
      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <div className="loading-dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      ) : filteredOrders.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredOrders.map(order => (
            <div key={order.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
              <OrderCard
                order={order}
                showDetails={false}
                isStoreView={true}
              />
              
              {/* Order Actions */}
              <div className="p-4 bg-gray-50 border-t">
                <div className="flex flex-wrap gap-2">
                  {order.status === 'pending' && (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleUpdateStatus(order.id, 'preparing')}
                    >
                      Start Preparing
                    </Button>
                  )}
                  
                  {order.status === 'preparing' && (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleUpdateStatus(order.id, 'ready')}
                    >
                      Mark Ready
                    </Button>
                  )}
                  
                  {order.status === 'ready' && (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleUpdateStatus(order.id, 'completed')}
                    >
                      Complete Order
                    </Button>
                  )}
                  
                  {['pending', 'preparing'].includes(order.status) && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleUpdateStatus(order.id, 'cancelled')}
                    >
                      Cancel
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-lg shadow-sm">
          <LayoutList className="h-16 w-16 mx-auto text-gray-300 mb-4" />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">No orders found</h2>
          <p className="text-gray-500 mb-6">
            {filter === 'all'
              ? "There are no orders in the system."
              : `No ${filter} orders at the moment.`}
          </p>
          <Button 
            variant="primary" 
            onClick={() => handleFilterChange('all')}
          >
            View All Orders
          </Button>
        </div>
      )}
    </div>
  );
};

export default StoreOrders;