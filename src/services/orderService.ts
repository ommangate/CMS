import { Order } from '../types/menu';

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock orders data
let orders: Order[] = [
  {
    id: '1',
    userId: '1',
    items: [
      { id: '1', name: 'Veggie Burger', price: 7.99, quantity: 2 },
      { id: '5', name: 'French Fries', price: 3.99, quantity: 1 }
    ],
    totalAmount: 19.97,
    status: 'completed',
    paymentStatus: 'paid',
    orderDate: '2023-08-15T14:30:00Z',
    preparationTime: 20,
    qrCode: 'ORD001'
  },
  {
    id: '2',
    userId: '1',
    items: [
      { id: '3', name: 'Margherita Pizza', price: 11.99, quantity: 1 },
      { id: '6', name: 'Chocolate Milkshake', price: 4.99, quantity: 1 }
    ],
    totalAmount: 16.98,
    status: 'ready',
    paymentStatus: 'paid',
    orderDate: '2023-08-16T12:45:00Z',
    preparationTime: 15,
    qrCode: 'ORD002'
  }
];

export const orderService = {
  async placeOrder(userId: string, items: { id: string; name: string; price: number; quantity: number }[], totalAmount: number) {
    await delay(1000);
    
    // Calculate total preparation time (simplified)
    const preparationTime = Math.max(10, items.reduce((total, item) => total + item.quantity * 2, 0));
    
    const newOrder: Order = {
      id: Math.random().toString(36).substring(2, 9),
      userId,
      items,
      totalAmount,
      status: 'pending',
      paymentStatus: 'pending',
      orderDate: new Date().toISOString(),
      preparationTime,
      qrCode: `ORD${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`
    };
    
    orders.push(newOrder);
    return newOrder;
  },
  
  async processPayment(orderId: string, paymentMethod: string, paymentDetails: any) {
    await delay(1500);
    
    const orderIndex = orders.findIndex(order => order.id === orderId);
    if (orderIndex === -1) {
      throw new Error('Order not found');
    }
    
    // Simulate payment processing
    const paymentSuccess = Math.random() > 0.1; // 90% success rate
    
    if (!paymentSuccess) {
      throw new Error('Payment failed');
    }
    
    // Update order status
    orders[orderIndex] = {
      ...orders[orderIndex],
      paymentStatus: 'paid',
      status: 'preparing'
    };
    
    return { 
      success: true, 
      order: orders[orderIndex] 
    };
  },
  
  async getUserOrders(userId: string) {
    await delay(800);
    return orders
      .filter(order => order.userId === userId)
      .sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime());
  },
  
  async getOrderById(orderId: string) {
    await delay(500);
    const order = orders.find(order => order.id === orderId);
    if (!order) {
      throw new Error('Order not found');
    }
    return order;
  },
  
  async getAllOrders() {
    await delay(800);
    return orders.sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime());
  },
  
  async updateOrderStatus(orderId: string, status: 'pending' | 'preparing' | 'ready' | 'completed' | 'cancelled') {
    await delay(600);
    
    const orderIndex = orders.findIndex(order => order.id === orderId);
    if (orderIndex === -1) {
      throw new Error('Order not found');
    }
    
    orders[orderIndex] = {
      ...orders[orderIndex],
      status
    };
    
    return orders[orderIndex];
  },
  
  async cancelOrder(orderId: string) {
    await delay(700);
    
    const orderIndex = orders.findIndex(order => order.id === orderId);
    if (orderIndex === -1) {
      throw new Error('Order not found');
    }
    
    // Check if order can be cancelled
    if (['completed', 'ready'].includes(orders[orderIndex].status)) {
      throw new Error('Cannot cancel order at this stage');
    }
    
    orders[orderIndex] = {
      ...orders[orderIndex],
      status: 'cancelled'
    };
    
    return { success: true };
  }
};