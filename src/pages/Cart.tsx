
import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '../context/CartContext';
import CartItem from '../components/CartItem';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Cart = () => {
  const { items, totalPrice, itemCount, clearCart } = useCart();
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 flex-grow">
        <h1 className="text-3xl font-bold mb-8">Your Shopping Cart</h1>
        
        {items.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="divide-y">
                  {items.map(item => (
                    <CartItem 
                      key={item.product.id}
                      id={item.product.id}
                      name={item.product.name}
                      price={item.product.price}
                      image={item.product.image}
                      quantity={item.quantity}
                    />
                  ))}
                </div>
                
                <div className="mt-6 flex justify-between">
                  <Button 
                    variant="outline" 
                    onClick={clearCart}
                    className="text-gray-600"
                  >
                    Clear Cart
                  </Button>
                  
                  <Link to="/products" className="text-shop-primary hover:underline flex items-center">
                    Continue Shopping
                  </Link>
                </div>
              </div>
            </div>
            
            {/* Order Summary */}
            <div>
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-6">
                <h2 className="text-xl font-bold mb-4">Order Summary</h2>
                
                <div className="space-y-3 text-sm border-b pb-4 mb-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal ({itemCount} items)</span>
                    <span className="font-medium">${totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium">Free</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax</span>
                    <span className="font-medium">${(totalPrice * 0.08).toFixed(2)}</span>
                  </div>
                </div>
                
                <div className="flex justify-between mb-6">
                  <span className="font-bold">Total</span>
                  <span className="font-bold">${(totalPrice + totalPrice * 0.08).toFixed(2)}</span>
                </div>
                
                <Link 
                  to="/checkout"
                  className="bg-shop-primary text-white w-full py-3 px-4 rounded-md text-center block hover:bg-shop-secondary transition-colors"
                >
                  <div className="flex items-center justify-center">
                    Proceed to Checkout <ArrowRight className="ml-2 w-4 h-4" />
                  </div>
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <ShoppingCart className="w-10 h-10 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
            <p className="text-gray-600 mb-6">Browse our products and find something you like!</p>
            <Link to="/products" className="btn-primary">
              Start Shopping
            </Link>
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default Cart;
