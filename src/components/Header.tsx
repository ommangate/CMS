import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { Search, ShoppingCart, Heart, User, Utensils, Menu, X, LogOut } from 'lucide-react';
import Button from './ui/Button';

const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/menu?q=${encodeURIComponent(searchQuery)}`);
      setIsMenuOpen(false);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="container-custom mx-auto flex h-16 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 font-bold text-primary-600 text-xl">
          <Utensils className="h-6 w-6" />
          <span>Campus Canteen</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <form onSubmit={handleSearch} className="relative w-64">
            <input
              type="text"
              placeholder="Search menu..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input w-full pr-10"
            />
            <button
              type="submit"
              className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:text-primary-600"
            >
              <Search className="h-4 w-4" />
            </button>
          </form>

          <Link
            to="/menu"
            className={`text-sm font-medium transition-colors hover:text-primary-600 ${
              location.pathname === '/menu' ? 'text-primary-600' : 'text-gray-700'
            }`}
          >
            Menu
          </Link>

          {isAuthenticated && (
            <>
              <Link
                to="/favorites"
                className={`text-sm font-medium transition-colors hover:text-primary-600 ${
                  location.pathname === '/favorites' ? 'text-primary-600' : 'text-gray-700'
                }`}
              >
                <span className="flex items-center gap-1">
                  <Heart className="h-4 w-4" />
                  Favorites
                </span>
              </Link>

              <Link
                to="/orders"
                className={`text-sm font-medium transition-colors hover:text-primary-600 ${
                  location.pathname === '/orders' ? 'text-primary-600' : 'text-gray-700'
                }`}
              >
                Orders
              </Link>
            </>
          )}

          <Link to="/cart" className="relative">
            <ShoppingCart className="h-6 w-6 text-gray-700 hover:text-primary-600" />
            {cart.totalItems > 0 && (
              <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary-600 text-xs font-bold text-white">
                {cart.totalItems}
              </span>
            )}
          </Link>

          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-gray-700">
                Hi, {user?.name.split(' ')[0]}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="gap-1"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
          ) : (
            <Link to="/login">
              <Button variant="primary" size="sm" className="gap-1">
                <User className="h-4 w-4" />
                Login
              </Button>
            </Link>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-4 md:hidden">
          <Link to="/cart" className="relative">
            <ShoppingCart className="h-6 w-6 text-gray-700" />
            {cart.totalItems > 0 && (
              <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary-600 text-xs font-bold text-white">
                {cart.totalItems}
              </span>
            )}
          </Link>
          <button
            onClick={toggleMenu}
            className="rounded-md p-2 text-gray-700 hover:bg-gray-100"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white py-4 px-4 shadow-lg">
          <form onSubmit={handleSearch} className="mb-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search menu..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input w-full pr-10"
              />
              <button
                type="submit"
                className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500"
              >
                <Search className="h-4 w-4" />
              </button>
            </div>
          </form>

          <nav className="flex flex-col space-y-3">
            <Link
              to="/menu"
              className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-gray-100"
              onClick={() => setIsMenuOpen(false)}
            >
              <Utensils className="h-5 w-5" />
              Menu
            </Link>

            {isAuthenticated && (
              <>
                <Link
                  to="/favorites"
                  className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-gray-100"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Heart className="h-5 w-5" />
                  Favorites
                </Link>

                <Link
                  to="/orders"
                  className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-gray-100"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <ShoppingCart className="h-5 w-5" />
                  Orders
                </Link>
              </>
            )}

            {isAuthenticated ? (
              <Button
                variant="outline"
                onClick={handleLogout}
                className="w-full justify-start gap-2 mt-4"
              >
                <LogOut className="h-5 w-5" />
                Logout
              </Button>
            ) : (
              <Link
                to="/login"
                onClick={() => setIsMenuOpen(false)}
                className="mt-4"
              >
                <Button variant="primary" fullWidth className="gap-2 justify-center">
                  <User className="h-5 w-5" />
                  Login
                </Button>
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;