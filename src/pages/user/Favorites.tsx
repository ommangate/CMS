import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { menuService } from '../../services/menuService';
import { Favorite } from '../../types/menu';
import MenuCard from '../../components/MenuCard';
import { Heart } from 'lucide-react';
import Button from '../../components/ui/Button';
import { Link } from 'react-router-dom';

const Favorites = () => {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Fetch user favorites
  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        if (user) {
          const userFavorites = await menuService.getUserFavorites(user.id);
          setFavorites(userFavorites);
        }
      } catch (error) {
        console.error('Error fetching favorites:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchFavorites();
  }, [user]);
  
  // Handle favorite toggle
  const handleToggleFavorite = async () => {
    if (user) {
      try {
        setIsLoading(true);
        const userFavorites = await menuService.getUserFavorites(user.id);
        setFavorites(userFavorites);
      } catch (error) {
        console.error('Error updating favorites:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };
  
  return (
    <div className="py-8 px-4 md:px-6">
      <div className="container-custom">
        <h1 className="text-2xl md:text-3xl font-bold mb-8">My Favorites</h1>
        
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="loading-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        ) : favorites.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {favorites.map(favorite => (
              <MenuCard
                key={favorite.itemId}
                item={favorite.item}
                isFavorite={true}
                onToggleFavorite={handleToggleFavorite}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-lg shadow-sm">
            <Heart className="h-16 w-16 mx-auto text-gray-300 mb-4" />
            <h2 className="text-xl font-semibold text-gray-700 mb-2">No favorites yet</h2>
            <p className="text-gray-500 mb-6">
              You haven't added any items to your favorites yet.
            </p>
            <Link to="/menu">
              <Button variant="primary">
                Browse Menu
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites;