
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, CreditCard } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useCart } from '../context/CartContext';
import { createOrder } from '../services/orderService';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface FormData {
  name: string;
  email: string;
  address: string;
  cardNumber: string;
}

const Checkout = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { items, totalPrice, clearCart } = useCart();
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    address: '',
    cardNumber: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      // Split name into first and last name
      const nameParts = formData.name.split(' ');
      const firstName = nameParts[0];
      const lastName = nameParts.slice(1).join(' ') || '-';
      
      // Create order using our service
      const orderData = {
        firstName: firstName,
        lastName: lastName,
        email: formData.email,
        address: formData.address,
        city: 'Default City', // Default values
        zipCode: '00000',
        country: 'Indonesia',
        items: items,
        totalAmount: totalPrice + totalPrice * 0.08, // Including tax
      };
      
      const { orderId, trackingNumber } = await createOrder(orderData);
      
      // Clear cart and navigate to success page
      clearCart();
      toast({
        title: "Order placed successfully",
        description: `Your order #${orderId.substring(0, 8)} has been placed successfully!`,
      });
      
      // Navigate to tracking page with order info
      navigate('/tracking', { state: { orderId } });
    } catch (error) {
      console.error("Error placing order:", error);
      toast({
        title: "Error placing order",
        description: "We couldn't process your order. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Redirect to home if cart is empty
  if (items.length === 0) {
    if (typeof window !== 'undefined') {
      navigate('/');
    }
    return null;
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>
        
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Simplified Customer Information */}
          <div>
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h2 className="text-xl font-bold mb-4">Contact Information</h2>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <Input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <Input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                    Delivery Address
                  </label>
                  <Input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter your complete address"
                  />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold mb-4">Payment Information</h2>
              
              <div>
                <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">
                  Card Number
                </label>
                <div className="flex items-center">
                  <Input
                    type="text"
                    id="cardNumber"
                    name="cardNumber"
                    value={formData.cardNumber}
                    onChange={handleInputChange}
                    required
                    placeholder="XXXX XXXX XXXX XXXX"
                  />
                  <CreditCard className="w-5 h-5 text-gray-400 ml-2" />
                </div>
              </div>
            </div>
          </div>
          
          {/* Order Summary */}
          <div>
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-6">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                {items.map(item => (
                  <div key={item.product.id} className="flex items-center">
                    <div className="w-16 h-16 flex-shrink-0">
                      <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover rounded" />
                    </div>
                    <div className="ml-4 flex-grow">
                      <h3 className="font-medium text-gray-800">{item.product.name}</h3>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Qty: {item.quantity}</span>
                        <span className="font-medium">${(item.product.price * item.quantity).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="space-y-2 text-sm border-b pb-4 mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
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
              
              <Button 
                type="submit" 
                className="bg-shop-primary text-white w-full py-3 px-4 rounded-md text-center block hover:bg-shop-secondary transition-colors flex items-center justify-center"
                disabled={isSubmitting}
              >
                <Check className="w-5 h-5 mr-2" /> 
                {isSubmitting ? "Processing..." : "Complete Order"}
              </Button>
              
              <p className="text-xs text-gray-500 text-center mt-4">
                By placing your order, you agree to our Terms of Service and Privacy Policy.
              </p>
            </div>
          </div>
        </form>
      </div>
      
      <Footer />
    </div>
  );
};

export default Checkout;
