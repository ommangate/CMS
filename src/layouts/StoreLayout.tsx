import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Utensils, ClipboardList, Menu as MenuIcon, Package, LogOut, X } from 'lucide-react';
import Button from '../components/ui/Button';

const StoreLayout = () => {
  const { logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/store/login');
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar for desktop */}
      <aside className="hidden md:flex md:w-64 flex-col bg-white shadow-md">
        <div className="p-6">
          <Link to="/store" className="flex items-center gap-2 font-bold text-primary-600 text-xl">
            <Utensils className="h-6 w-6" />
            <span>Store Admin</span>
          </Link>
        </div>
        
        <nav className="flex-1 px-4 py-6">
          <ul className="space-y-2">
            <li>
              <Link
                to="/store/orders"
                className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-gray-100 ${
                  location.pathname === '/store' || location.pathname === '/store/orders'
                    ? 'bg-primary-50 text-primary-600'
                    : 'text-gray-700'
                }`}
              >
                <ClipboardList className="h-5 w-5" />
                Orders
              </Link>
            </li>
            <li>
              <Link
                to="/store/menu"
                className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-gray-100 ${
                  location.pathname === '/store/menu'
                    ? 'bg-primary-50 text-primary-600'
                    : 'text-gray-700'
                }`}
              >
                <MenuIcon className="h-5 w-5" />
                Menu Management
              </Link>
            </li>
          </ul>
        </nav>
        
        <div className="p-4 border-t">
          <Button
            variant="outline"
            onClick={handleLogout}
            fullWidth
            className="justify-start"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="flex flex-col flex-1">
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-white px-4 md:hidden">
          <Link to="/store" className="flex items-center gap-2 font-bold text-primary-600 text-lg">
            <Utensils className="h-5 w-5" />
            <span>Store Admin</span>
          </Link>
          
          <button
            onClick={toggleMobileMenu}
            className="rounded-md p-2 text-gray-700 hover:bg-gray-100"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <MenuIcon className="h-6 w-6" />
            )}
          </button>
        </header>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 bg-white pt-16">
            <nav className="p-4">
              <ul className="space-y-3">
                <li>
                  <Link
                    to="/store/orders"
                    className="flex items-center gap-3 rounded-md px-3 py-3 text-base font-medium hover:bg-gray-100"
                    onClick={closeMobileMenu}
                  >
                    <ClipboardList className="h-5 w-5" />
                    Orders
                  </Link>
                </li>
                <li>
                  <Link
                    to="/store/menu"
                    className="flex items-center gap-3 rounded-md px-3 py-3 text-base font-medium hover:bg-gray-100"
                    onClick={closeMobileMenu}
                  >
                    <MenuIcon className="h-5 w-5" />
                    Menu Management
                  </Link>
                </li>
              </ul>
              
              <div className="mt-6 pt-6 border-t">
                <Button
                  variant="outline"
                  onClick={handleLogout}
                  fullWidth
                  className="justify-start text-base"
                >
                  <LogOut className="mr-2 h-5 w-5" />
                  Logout
                </Button>
              </div>
            </nav>
          </div>
        )}

        {/* Main content */}
        <main className="flex-1 px-4 py-6 md:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default StoreLayout;