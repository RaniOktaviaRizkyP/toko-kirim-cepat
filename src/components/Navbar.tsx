
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, User, Package, LogOut, ShieldCheck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuTrigger, 
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';

const Navbar = () => {
  const { itemCount } = useCart();
  const { user, signOut, isAdmin } = useAuth();
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="bg-white shadow-sm py-4 sticky top-0 z-50">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-shop-primary">ShopPurple</Link>
        
        <div className="flex items-center space-x-8">
          <Link to="/" 
            className={`text-gray-700 hover:text-shop-primary transition-colors ${
              isActive('/') ? 'text-shop-primary font-medium' : ''
            }`}>
            Home
          </Link>
          <Link to="/products" 
            className={`text-gray-700 hover:text-shop-primary transition-colors ${
              isActive('/products') ? 'text-shop-primary font-medium' : ''
            }`}>
            Products
          </Link>
          <Link to="/tracking" 
            className={`text-gray-700 hover:text-shop-primary transition-colors flex items-center ${
              isActive('/tracking') ? 'text-shop-primary font-medium' : ''
            }`}>
            <Package className="h-4 w-4 mr-1" /> Track Order
          </Link>
          
          <Link to="/cart" className="relative">
            <ShoppingCart className="h-6 w-6 text-gray-700 hover:text-shop-primary transition-colors" />
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-shop-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </Link>
          
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="hover:bg-transparent">
                  <User className="h-8 w-8 text-gray-700 hover:text-shop-primary/80 transition-colors" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-0.5">
                    <p className="text-sm font-medium">{user.email}</p>
                    <p className="text-xs text-gray-500">
                      {isAdmin ? 'Administrator' : 'Customer'}
                    </p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                {isAdmin && (
                  <DropdownMenuItem asChild>
                    <Link to="/admin" className="flex cursor-pointer items-center">
                      <ShieldCheck className="mr-2 h-4 w-4" />
                      <span>Admin Dashboard</span>
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem asChild onClick={signOut}>
                  <div className="flex cursor-pointer items-center text-red-500">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link to="/auth">
              <User className="h-8 w-8 text-gray-700 hover:text-shop-primary/80 transition-colors" />
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
