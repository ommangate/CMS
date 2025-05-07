import React from 'react';
import { Link } from 'react-router-dom';
import { Category } from '../types/menu';

interface CategoryCardProps {
  category: Category;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category }) => {
  return (
    <Link 
      to={`/menu?category=${category.name.toLowerCase()}`}
      className="relative block h-32 overflow-hidden rounded-lg group"
    >
      {/* Background Image */}
      <img 
        src={category.image} 
        alt={category.name}
        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
      />
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-gray-900/30 group-hover:from-primary-900/80 transition-colors duration-300">
        <div className="absolute inset-0 flex items-end p-4">
          <h3 className="text-lg font-medium text-white">{category.name}</h3>
        </div>
      </div>
    </Link>
  );
};

export default CategoryCard;