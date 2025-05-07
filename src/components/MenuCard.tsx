import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, ShoppingCart, Clock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { MenuItem } from '../types/menu';
import { menuService } from '../services/menuService';
import Button from './ui/Button';
import Badge from './ui/Badge';
import toast from 'react-hot-toast';

interface MenuCardProps {
  item: MenuItem;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
}

const MenuCard: React.FC<MenuCardProps> = ({ 
  item, 
  isFavorite = false,
  onToggleFavorite 
}) => {
  const { isAuthenticated, user } = useAuth();
  const { addItem } = useCart();
  const navigate = useNavigate();
  
  const handleAddToCart = () => {
    addItem(item);
  };
  
  const handleToggleFavorite = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to add favorites');
      navigate('/login');
      return;
    }
    
    try {
      if (isFavorite) {
        await menuService.removeFromFavorites(user!.id, item.id);
      } else {
        await menuService.addToFavorites(user!.id, item.id);
      }
      
      if (onToggleFavorite) {
        onToggleFavorite();
      }
      
      toast.success(isFavorite 
        ? `${item.name} removed from favorites` 
        : `${item.name} added to favorites`
      );
    } catch (error) {
      toast.error('Could not update favorites');
    }
  };
  
  return (
    <div className="menu-item group">
      <div className="relative mb-3 overflow-hidden rounded-md">
        {/* Favorite Button */}
        {isAuthenticated && (
          <button
            onClick={handleToggleFavorite}
            className="absolute top-2 right-2 z-10 rounded-full bg-white/80 p-1.5 transition-colors hover:bg-white"
          >
            <Heart 
              className={`h-5 w-5 ${isFavorite ? 'fill-secondary-500 text-secondary-500' : 'text-gray-600'}`} 
            />
          </button>
        )}
        
        {/* Food Image */}
        <div className="overflow-hidden rounded-md">
          <img
            src={item.image}
            alt={item.name}
            className="menu-item-img transition-transform duration-500 group-hover:scale-110"
          />
        </div>
        
        {/* Badges */}
        <div className="absolute bottom-2 left-2 flex flex-wrap gap-1">
          {item.veg ? (
            <Badge variant="success">Vegetarian</Badge>
          ) : (
            <Badge variant="secondary">Non-Veg</Badge>
          )}
          
          {!item.available && (
            <Badge variant="error">Unavailable</Badge>
          )}
        </div>
      </div>
      
      {/* Food Details */}
      <div>
        <div className="mb-2 flex items-center justify-between">
          <h3 className="font-medium text-gray-900">{item.name}</h3>
          <span className="font-semibold text-primary-600">${item.price.toFixed(2)}</span>
        </div>
        
        <p className="mb-3 text-sm text-gray-600 line-clamp-2">{item.description}</p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center text-sm text-gray-500">
            <Clock className="mr-1 h-4 w-4" />
            <span>{item.preparationTime} mins</span>
          </div>
          
          <Button
            variant="primary"
            size="sm"
            onClick={handleAddToCart}
            disabled={!item.available}
            className="gap-1"
          >
            <ShoppingCart className="h-4 w-4" />
            Add
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MenuCard;