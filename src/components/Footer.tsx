import React from 'react';
import { Link } from 'react-router-dom';
import { Utensils, Instagram, Facebook, Twitter } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and About */}
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 text-white font-bold text-xl mb-4">
              <Utensils className="h-6 w-6" />
              <span>Campus Canteen</span>
            </Link>
            <p className="text-sm text-gray-400 mb-4">
              Order delicious food from your campus canteen. Skip the long queues and enjoy your meals with ease.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div className="col-span-1">
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/menu" className="text-sm text-gray-400 hover:text-white transition-colors">
                  Menu
                </Link>
              </li>
              <li>
                <Link to="/cart" className="text-sm text-gray-400 hover:text-white transition-colors">
                  Cart
                </Link>
              </li>
              <li>
                <Link to="/favorites" className="text-sm text-gray-400 hover:text-white transition-colors">
                  Favorites
                </Link>
              </li>
              <li>
                <Link to="/orders" className="text-sm text-gray-400 hover:text-white transition-colors">
                  My Orders
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Categories */}
          <div className="col-span-1">
            <h3 className="text-white font-semibold mb-4">Categories</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/menu?category=burgers" className="text-sm text-gray-400 hover:text-white transition-colors">
                  Burgers
                </Link>
              </li>
              <li>
                <Link to="/menu?category=pizza" className="text-sm text-gray-400 hover:text-white transition-colors">
                  Pizza
                </Link>
              </li>
              <li>
                <Link to="/menu?category=sides" className="text-sm text-gray-400 hover:text-white transition-colors">
                  Sides
                </Link>
              </li>
              <li>
                <Link to="/menu?category=beverages" className="text-sm text-gray-400 hover:text-white transition-colors">
                  Beverages
                </Link>
              </li>
              <li>
                <Link to="/menu?category=desserts" className="text-sm text-gray-400 hover:text-white transition-colors">
                  Desserts
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Contact Info */}
          <div className="col-span-1">
            <h3 className="text-white font-semibold mb-4">Opening Hours</h3>
            <ul className="space-y-2">
              <li className="text-sm text-gray-400">Monday - Friday: 8:00 AM - 8:00 PM</li>
              <li className="text-sm text-gray-400">Saturday: 9:00 AM - 7:00 PM</li>
              <li className="text-sm text-gray-400">Sunday: 10:00 AM - 6:00 PM</li>
            </ul>
            <div className="mt-4">
              <p className="text-sm text-gray-400">Email: canteen@campus.edu</p>
              <p className="text-sm text-gray-400">Phone: (123) 456-7890</p>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-sm text-gray-400">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p>&copy; {new Date().getFullYear()} Campus Canteen. All rights reserved.</p>
            <div className="flex gap-4 mt-4 md:mt-0">
              <Link to="#" className="hover:text-white transition-colors">Privacy Policy</Link>
              <Link to="#" className="hover:text-white transition-colors">Terms of Service</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;