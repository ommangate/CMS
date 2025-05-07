import { MenuItem, Category } from '../types/menu';

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock menu items data
const menuItems: MenuItem[] = [
  {
    id: '1',
    name: 'Veggie Burger',
    description: 'Delicious vegetable patty with lettuce, tomato, and special sauce',
    price: 7.99,
    image: 'https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?auto=compress&cs=tinysrgb&w=600',
    category: 'burgers',
    available: true,
    preparationTime: 10,
    veg: true
  },
  {
    id: '2',
    name: 'Chicken Burger',
    description: 'Juicy chicken patty with lettuce, tomato, and mayo',
    price: 8.99,
    image: 'https://images.pexels.com/photos/2983101/pexels-photo-2983101.jpeg?auto=compress&cs=tinysrgb&w=600',
    category: 'burgers',
    available: true,
    preparationTime: 12,
    veg: false
  },
  {
    id: '3',
    name: 'Margherita Pizza',
    description: 'Classic pizza with tomato sauce, mozzarella, and basil',
    price: 11.99,
    image: 'https://images.pexels.com/photos/2147491/pexels-photo-2147491.jpeg?auto=compress&cs=tinysrgb&w=600',
    category: 'pizza',
    available: true,
    preparationTime: 15,
    veg: true
  },
  {
    id: '4',
    name: 'Pepperoni Pizza',
    description: 'Pizza topped with tomato sauce, mozzarella, and pepperoni',
    price: 13.99,
    image: 'https://images.pexels.com/photos/803290/pexels-photo-803290.jpeg?auto=compress&cs=tinysrgb&w=600',
    category: 'pizza',
    available: true,
    preparationTime: 15,
    veg: false
  },
  {
    id: '5',
    name: 'French Fries',
    description: 'Crispy golden fries with a sprinkle of salt',
    price: 3.99,
    image: 'https://images.pexels.com/photos/1583884/pexels-photo-1583884.jpeg?auto=compress&cs=tinysrgb&w=600',
    category: 'sides',
    available: true,
    preparationTime: 8,
    veg: true
  },
  {
    id: '6',
    name: 'Chocolate Milkshake',
    description: 'Creamy chocolate milkshake topped with whipped cream',
    price: 4.99,
    image: 'https://images.pexels.com/photos/3727250/pexels-photo-3727250.jpeg?auto=compress&cs=tinysrgb&w=600',
    category: 'beverages',
    available: true,
    preparationTime: 5,
    veg: true
  },
  {
    id: '7',
    name: 'Choco Lava Cake',
    description: 'Warm chocolate cake with a gooey chocolate center',
    price: 5.99,
    image: 'https://images.pexels.com/photos/132694/pexels-photo-132694.jpeg?auto=compress&cs=tinysrgb&w=600',
    category: 'desserts',
    available: true,
    preparationTime: 10,
    veg: true
  },
  {
    id: '8',
    name: 'Chicken Wrap',
    description: 'Grilled chicken with fresh vegetables in a tortilla wrap',
    price: 7.49,
    image: 'https://images.pexels.com/photos/2955819/pexels-photo-2955819.jpeg?auto=compress&cs=tinysrgb&w=600',
    category: 'wraps',
    available: true,
    preparationTime: 8,
    veg: false
  }
];

// Mock categories data
const categories: Category[] = [
  {
    id: '1',
    name: 'Burgers',
    image: 'https://images.pexels.com/photos/2983101/pexels-photo-2983101.jpeg?auto=compress&cs=tinysrgb&w=600'
  },
  {
    id: '2',
    name: 'Pizza',
    image: 'https://images.pexels.com/photos/2147491/pexels-photo-2147491.jpeg?auto=compress&cs=tinysrgb&w=600'
  },
  {
    id: '3',
    name: 'Sides',
    image: 'https://images.pexels.com/photos/1583884/pexels-photo-1583884.jpeg?auto=compress&cs=tinysrgb&w=600'
  },
  {
    id: '4',
    name: 'Beverages',
    image: 'https://images.pexels.com/photos/3727250/pexels-photo-3727250.jpeg?auto=compress&cs=tinysrgb&w=600'
  },
  {
    id: '5',
    name: 'Desserts',
    image: 'https://images.pexels.com/photos/132694/pexels-photo-132694.jpeg?auto=compress&cs=tinysrgb&w=600'
  },
  {
    id: '6',
    name: 'Wraps',
    image: 'https://images.pexels.com/photos/2955819/pexels-photo-2955819.jpeg?auto=compress&cs=tinysrgb&w=600'
  }
];

// Mock favorites data (will be populated at runtime)
let favorites: { id: string; userId: string; itemId: string }[] = [];

export const menuService = {
  async getMenuItems() {
    await delay(800);
    return menuItems;
  },
  
  async getMenuItemById(id: string) {
    await delay(500);
    const item = menuItems.find(item => item.id === id);
    if (!item) {
      throw new Error('Menu item not found');
    }
    return item;
  },
  
  async getCategories() {
    await delay(600);
    return categories;
  },
  
  async getMenuItemsByCategory(categoryName: string) {
    await delay(700);
    return menuItems.filter(item => 
      item.category.toLowerCase() === categoryName.toLowerCase()
    );
  },
  
  async searchMenuItems(query: string) {
    await delay(500);
    const lowercaseQuery = query.toLowerCase();
    return menuItems.filter(item => 
      item.name.toLowerCase().includes(lowercaseQuery) ||
      item.description.toLowerCase().includes(lowercaseQuery) ||
      item.category.toLowerCase().includes(lowercaseQuery)
    );
  },
  
  async getUserFavorites(userId: string) {
    await delay(600);
    const userFavorites = favorites.filter(fav => fav.userId === userId);
    const favoriteItems = await Promise.all(
      userFavorites.map(async fav => {
        const item = await this.getMenuItemById(fav.itemId);
        return {
          id: fav.id,
          userId: fav.userId,
          itemId: fav.itemId,
          item
        };
      })
    );
    return favoriteItems;
  },
  
  async addToFavorites(userId: string, itemId: string) {
    await delay(400);
    // Check if already a favorite
    const existingFav = favorites.find(
      fav => fav.userId === userId && fav.itemId === itemId
    );
    
    if (existingFav) {
      return existingFav;
    }
    
    const newFavorite = {
      id: Math.random().toString(36).substring(2, 9),
      userId,
      itemId
    };
    
    favorites.push(newFavorite);
    return newFavorite;
  },
  
  async removeFromFavorites(userId: string, itemId: string) {
    await delay(400);
    const initialLength = favorites.length;
    favorites = favorites.filter(
      fav => !(fav.userId === userId && fav.itemId === itemId)
    );
    
    if (favorites.length === initialLength) {
      throw new Error('Favorite not found');
    }
    
    return { success: true };
  },
  
  async isItemFavorite(userId: string, itemId: string) {
    await delay(300);
    return favorites.some(fav => fav.userId === userId && fav.itemId === itemId);
  }
};