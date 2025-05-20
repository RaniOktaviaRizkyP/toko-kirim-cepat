
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Check, Truck, Package, Database } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

interface TrackingStep {
  status: 'completed' | 'current' | 'upcoming';
  title: string;
  description: string;
  date?: string;
  icon: React.ReactNode;
}

const OrderTracking = () => {
  const location = useLocation();
  const orderId = location.state?.orderId || '';
  const [trackingId, setTrackingId] = useState('');
  const [searchedOrderId, setSearchedOrderId] = useState(orderId);
  
  // Mock tracking data
  const trackingSteps: TrackingStep[] = [
    {
      status: 'completed',
      title: 'Order Confirmed',
      description: 'Your order has been received and confirmed',
      date: new Date().toLocaleDateString(),
      icon: <Check className="w-5 h-5" />
    },
    {
      status: 'completed',
      title: 'Order Processed',
      description: 'Your order has been processed and is being prepared for shipping',
      date: new Date(Date.now() + 24 * 60 * 60 * 1000).toLocaleDateString(),
      icon: <Database className="w-5 h-5" />
    },
    {
      status: 'current',
      title: 'Shipped',
      description: 'Your order has been shipped and is on the way',
      date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toLocaleDateString(),
      icon: <Package className="w-5 h-5" />
    },
    {
      status: 'upcoming',
      title: 'Out for Delivery',
      description: 'Your order is out for delivery',
      icon: <Truck className="w-5 h-5" />
    }
  ];
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchedOrderId(trackingId);
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Track Your Order</h1>
        
        {/* Order Tracking Form */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
            <div className="flex-grow">
              <label htmlFor="trackingId" className="block text-sm font-medium text-gray-700 mb-1">
                Order ID
              </label>
              <input
                type="text"
                id="trackingId"
                value={trackingId}
                onChange={(e) => setTrackingId(e.target.value)}
                placeholder="Enter your order ID"
                className="w-full px-3 py-2 border rounded-md"
                required={!searchedOrderId}
              />
            </div>
            <div className="flex items-end">
              <Button type="submit" className="bg-shop-primary hover:bg-shop-secondary h-10">
                Track Order
              </Button>
            </div>
          </form>
        </div>
        
        {searchedOrderId && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="mb-6">
              <h2 className="text-xl font-bold mb-1">Order #{searchedOrderId}</h2>
              <p className="text-gray-600">Estimated delivery: {new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString()}</p>
            </div>
            
            {/* Tracking Timeline */}
            <div className="relative">
              {trackingSteps.map((step, index) => (
                <div key={index} className="flex mb-8 last:mb-0">
                  {/* Status Icon */}
                  <div className={`relative z-10 flex items-center justify-center w-10 h-10 rounded-full ${
                    step.status === 'completed' ? 'bg-shop-primary text-white' :
                    step.status === 'current' ? 'bg-shop-light text-shop-primary border-2 border-shop-primary' :
                    'bg-gray-100 text-gray-400'
                  }`}>
                    {step.icon}
                  </div>
                  
                  {/* Content */}
                  <div className="ml-4 flex-grow">
                    <div className="flex items-baseline">
                      <h3 className="font-medium text-gray-800">{step.title}</h3>
                      {step.date && (
                        <span className="ml-2 text-sm text-gray-500">{step.date}</span>
                      )}
                    </div>
                    <p className="text-gray-600">{step.description}</p>
                  </div>
                </div>
              ))}
              
              {/* Connecting Line */}
              <div className="absolute left-5 top-5 h-[calc(100%-32px)] w-0.5 bg-gray-200"></div>
            </div>
            
            {/* Package Information */}
            <div className="mt-8 pt-6 border-t">
              <h3 className="font-medium mb-4">Shipping Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm text-gray-600">Shipping Method</h4>
                  <p className="font-medium">Standard Shipping</p>
                </div>
                <div>
                  <h4 className="text-sm text-gray-600">Tracking Number</h4>
                  <p className="font-medium">TRK{Math.floor(Math.random() * 100000000)}</p>
                </div>
                <div>
                  <h4 className="text-sm text-gray-600">Shipping Address</h4>
                  <p className="font-medium">123 Main St, Anytown, ST 12345</p>
                </div>
                <div>
                  <h4 className="text-sm text-gray-600">Contact</h4>
                  <p className="font-medium">customer@example.com</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default OrderTracking;
