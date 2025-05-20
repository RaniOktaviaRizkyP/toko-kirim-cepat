
import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const { itemCount } = useCart();

  return (
    <nav className="bg-white shadow-sm py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-shop-primary">ShopPurple</Link>
        
        <div className="flex items-center space-x-8">
          <Link to="/" className="text-gray-700 hover:text-shop-primary transition-colors">Home</Link>
          <Link to="/products" className="text-gray-700 hover:text-shop-primary transition-colors">Products</Link>
          <Link to="/tracking" className="text-gray-700 hover:text-shop-primary transition-colors">Track Order</Link>
          
          <Link to="/cart" className="relative">
            <ShoppingCart className="h-6 w-6 text-gray-700 hover:text-shop-primary transition-colors" />
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-shop-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
