import { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import toast from 'react-hot-toast';
import { MenuItem } from '../types/menu';

interface CartItem extends MenuItem {
  quantity: number;
}

interface CartState {
  items: CartItem[];
  totalItems: number;
  totalAmount: number;
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: MenuItem }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' };

interface CartContextType {
  cart: CartState;
  addItem: (item: MenuItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
}

const initialState: CartState = {
  items: [],
  totalItems: 0,
  totalAmount: 0
};

const calculateTotals = (items: CartItem[]) => {
  const totalItems = items.reduce((total, item) => total + item.quantity, 0);
  const totalAmount = items.reduce((total, item) => total + item.price * item.quantity, 0);
  return { totalItems, totalAmount };
};

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItemIndex = state.items.findIndex(item => item.id === action.payload.id);
      
      if (existingItemIndex > -1) {
        const updatedItems = [...state.items];
        updatedItems[existingItemIndex].quantity += 1;
        const { totalItems, totalAmount } = calculateTotals(updatedItems);
        return { ...state, items: updatedItems, totalItems, totalAmount };
      } else {
        const newItem = { ...action.payload, quantity: 1 };
        const updatedItems = [...state.items, newItem];
        const { totalItems, totalAmount } = calculateTotals(updatedItems);
        return { ...state, items: updatedItems, totalItems, totalAmount };
      }
    }
    
    case 'REMOVE_ITEM': {
      const updatedItems = state.items.filter(item => item.id !== action.payload);
      const { totalItems, totalAmount } = calculateTotals(updatedItems);
      return { ...state, items: updatedItems, totalItems, totalAmount };
    }
    
    case 'UPDATE_QUANTITY': {
      const { id, quantity } = action.payload;
      if (quantity <= 0) {
        const updatedItems = state.items.filter(item => item.id !== id);
        const { totalItems, totalAmount } = calculateTotals(updatedItems);
        return { ...state, items: updatedItems, totalItems, totalAmount };
      }
      
      const updatedItems = state.items.map(item => 
        item.id === id ? { ...item, quantity } : item
      );
      const { totalItems, totalAmount } = calculateTotals(updatedItems);
      return { ...state, items: updatedItems, totalItems, totalAmount };
    }
    
    case 'CLEAR_CART':
      return initialState;
      
    default:
      return state;
  }
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  // Initialize cart from localStorage if available
  const savedCart = localStorage.getItem('cart');
  const initialCart = savedCart ? JSON.parse(savedCart) : initialState;
  
  const [cart, dispatch] = useReducer(cartReducer, initialCart);
  
  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);
  
  const addItem = (item: MenuItem) => {
    dispatch({ type: 'ADD_ITEM', payload: item });
    toast.success(`${item.name} added to cart`);
  };
  
  const removeItem = (id: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id });
    toast.success('Item removed from cart');
  };
  
  const updateQuantity = (id: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  };
  
  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };
  
  return (
    <CartContext.Provider
      value={{
        cart,
        addItem,
        removeItem,
        updateQuantity,
        clearCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};