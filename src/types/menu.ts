export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  available: boolean;
  preparationTime: number;
  veg: boolean;
}

export interface Category {
  id: string;
  name: string;
  image: string;
}

export interface Order {
  id: string;
  userId: string;
  items: {
    id: string;
    name: string;
    price: number;
    quantity: number;
  }[];
  totalAmount: number;
  status: 'pending' | 'preparing' | 'ready' | 'completed' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed';
  orderDate: string;
  preparationTime: number;
  qrCode: string;
}

export interface Favorite {
  id: string;
  userId: string;
  itemId: string;
  item: MenuItem;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'staff';
}