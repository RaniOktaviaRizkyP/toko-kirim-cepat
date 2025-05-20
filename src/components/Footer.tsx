
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-100 pt-12 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">ShopPurple</h3>
            <p className="text-gray-600">Your one-stop shop for quality products with fast delivery and excellent customer service.</p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Shop</h3>
            <ul className="space-y-2">
              <li><Link to="/products" className="text-gray-600 hover:text-shop-primary">All Products</Link></li>
              <li><Link to="/products?category=Electronics" className="text-gray-600 hover:text-shop-primary">Electronics</Link></li>
              <li><Link to="/products?category=Clothing" className="text-gray-600 hover:text-shop-primary">Clothing</Link></li>
              <li><Link to="/products?category=Home" className="text-gray-600 hover:text-shop-primary">Home</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Customer Service</h3>
            <ul className="space-y-2">
              <li><Link to="/tracking" className="text-gray-600 hover:text-shop-primary">Track Order</Link></li>
              <li><Link to="#" className="text-gray-600 hover:text-shop-primary">Returns & Exchanges</Link></li>
              <li><Link to="#" className="text-gray-600 hover:text-shop-primary">Shipping Information</Link></li>
              <li><Link to="#" className="text-gray-600 hover:text-shop-primary">Contact Us</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Connect</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-600 hover:text-shop-primary">Facebook</a>
              <a href="#" className="text-gray-600 hover:text-shop-primary">Instagram</a>
              <a href="#" className="text-gray-600 hover:text-shop-primary">Twitter</a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-200 mt-8 pt-8 text-center text-gray-500">
          <p>© {new Date().getFullYear()} ShopPurple. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
