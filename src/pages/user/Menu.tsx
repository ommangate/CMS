import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { menuService } from '../../services/menuService';
import { MenuItem, Category } from '../../types/menu';
import MenuCard from '../../components/MenuCard';
import CategoryCard from '../../components/CategoryCard';
import { Search, Filter, X } from 'lucide-react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Badge from '../../components/ui/Badge';

const Menu = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { isAuthenticated, user } = useAuth();
  
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [filterVeg, setFilterVeg] = useState(false);
  
  // Function to fetch menu items based on current filters
  const fetchMenuItems = useCallback(async () => {
    setIsLoading(true);
    try {
      let items: MenuItem[] = [];
      
      if (searchTerm) {
        items = await menuService.searchMenuItems(searchTerm);
      } else if (selectedCategory) {
        items = await menuService.getMenuItemsByCategory(selectedCategory);
      } else {
        items = await menuService.getMenuItems();
      }
      
      // Apply vegetarian filter if selected
      if (filterVeg) {
        items = items.filter(item => item.veg);
      }
      
      setMenuItems(items);
    } catch (error) {
      console.error('Error fetching menu items:', error);
    } finally {
      setIsLoading(false);
    }
  }, [searchTerm, selectedCategory, filterVeg]);
  
  // Fetch categories once on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesData = await menuService.getCategories();
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    
    fetchCategories();
  }, []);
  
  // Fetch favorites if user is authenticated
  useEffect(() => {
    const fetchFavorites = async () => {
      if (isAuthenticated && user) {
        try {
          const userFavorites = await menuService.getUserFavorites(user.id);
          const favoriteIds = new Set(userFavorites.map(fav => fav.itemId));
          setFavorites(favoriteIds);
        } catch (error) {
          console.error('Error fetching favorites:', error);
        }
      }
    };
    
    fetchFavorites();
  }, [isAuthenticated, user]);
  
  // Update search params when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    
    if (searchTerm) params.set('q', searchTerm);
    if (selectedCategory) params.set('category', selectedCategory);
    
    setSearchParams(params);
  }, [searchTerm, selectedCategory, setSearchParams]);
  
  // Fetch menu items when filters change
  useEffect(() => {
    fetchMenuItems();
  }, [fetchMenuItems]);
  
  // Handle search submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchMenuItems();
  };
  
  // Handle category selection
  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category === selectedCategory ? '' : category);
    setSearchTerm('');
  };
  
  // Handle favorite toggle
  const handleToggleFavorite = async () => {
    // Just refetch favorites
    if (isAuthenticated && user) {
      try {
        const userFavorites = await menuService.getUserFavorites(user.id);
        const favoriteIds = new Set(userFavorites.map(fav => fav.itemId));
        setFavorites(favoriteIds);
      } catch (error) {
        console.error('Error updating favorites:', error);
      }
    }
  };
  
  // Clear all filters
  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setFilterVeg(false);
  };
  
  return (
    <div className="py-8 px-4 md:px-6">
      <div className="container-custom">
        {/* Hero section */}
        <div className="mb-10 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Campus Canteen Menu</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Browse our delicious selection of food and beverages. Order online and skip the queue!
          </p>
        </div>
        
        {/* Search and filters */}
        <div className="mb-8">
          <form onSubmit={handleSearch} className="max-w-xl mx-auto mb-6">
            <div className="relative">
              <input
                type="text"
                placeholder="Search for food..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input w-full pr-10"
              />
              <button
                type="submit"
                className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:text-primary-600"
              >
                <Search className="h-5 w-5" />
              </button>
            </div>
          </form>
          
          {/* Active filters */}
          {(selectedCategory || filterVeg || searchTerm) && (
            <div className="flex flex-wrap items-center gap-2 mb-4 max-w-xl mx-auto">
              <span className="text-sm text-gray-700 flex items-center">
                <Filter className="h-4 w-4 mr-1" /> Active filters:
              </span>
              
              {selectedCategory && (
                <Badge
                  variant="primary"
                  className="flex items-center gap-1 cursor-pointer"
                  onClick={() => setSelectedCategory('')}
                >
                  Category: {selectedCategory}
                  <X className="h-3 w-3" />
                </Badge>
              )}
              
              {filterVeg && (
                <Badge
                  variant="success"
                  className="flex items-center gap-1 cursor-pointer"
                  onClick={() => setFilterVeg(false)}
                >
                  Vegetarian only
                  <X className="h-3 w-3" />
                </Badge>
              )}
              
              {searchTerm && (
                <Badge
                  variant="secondary"
                  className="flex items-center gap-1 cursor-pointer"
                  onClick={() => setSearchTerm('')}
                >
                  Search: {searchTerm}
                  <X className="h-3 w-3" />
                </Badge>
              )}
              
              <Button
                variant="outline"
                size="sm"
                onClick={clearFilters}
                className="ml-auto text-xs"
              >
                Clear all
              </Button>
            </div>
          )}
        </div>
        
        {/* Categories section - only show if not searching */}
        {!searchTerm && (
          <div className="mb-10">
            <h2 className="text-xl font-semibold mb-4">Categories</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {categories.map(category => (
                <CategoryCard 
                  key={category.id} 
                  category={category} 
                />
              ))}
            </div>
          </div>
        )}
        
        {/* Vegetarian filter */}
        <div className="mb-6 flex items-center">
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={filterVeg}
              onChange={() => setFilterVeg(!filterVeg)}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <span className="ml-2 text-sm text-gray-700">
              Vegetarian options only
            </span>
          </label>
        </div>
        
        {/* Menu items */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">
            {selectedCategory 
              ? `${selectedCategory} Menu` 
              : searchTerm 
                ? `Search Results for "${searchTerm}"` 
                : 'All Items'}
          </h2>
          
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="loading-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          ) : menuItems.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {menuItems.map(item => (
                <MenuCard
                  key={item.id}
                  item={item}
                  isFavorite={favorites.has(item.id)}
                  onToggleFavorite={handleToggleFavorite}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-gray-500">No items found matching your criteria.</p>
              <Button
                variant="outline"
                onClick={clearFilters}
                className="mt-4"
              >
                Clear filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Menu;