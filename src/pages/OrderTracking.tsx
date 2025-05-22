
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Check, Truck, Package, Database, Search, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/components/ui/use-toast';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { getOrderByTrackingNumber, getOrderById, searchOrder } from '../services/orderService';
import { supabase } from "@/integrations/supabase/client";

interface TrackingStep {
  status: 'completed' | 'current' | 'upcoming';
  title: string;
  description: string;
  date?: string;
  icon: React.ReactNode;
}

const OrderTracking = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const orderId = location.state?.orderId || '';
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [orderData, setOrderData] = useState<any>(null);
  const [shippingData, setShippingData] = useState<any>(null);
  const [trackingSteps, setTrackingSteps] = useState<TrackingStep[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  // Function to generate tracking steps based on order status
  const generateTrackingSteps = (status: string, shippingInfo: any) => {
    const steps: TrackingStep[] = [
      {
        status: 'completed',
        title: 'Order Confirmed',
        description: 'Your order has been received and confirmed',
        date: new Date(shippingInfo?.created_at || Date.now()).toLocaleDateString(),
        icon: <Check className="w-5 h-5" />
      },
      {
        status: status === 'processing' ? 'current' : (status === 'pending' ? 'upcoming' : 'completed'),
        title: 'Order Processed',
        description: 'Your order has been processed and is being prepared for shipping',
        date: status !== 'pending' ? new Date(shippingInfo?.created_at || Date.now() + 24 * 60 * 60 * 1000).toLocaleDateString() : undefined,
        icon: <Database className="w-5 h-5" />
      },
      {
        status: status === 'shipped' ? 'current' : (status === 'pending' || status === 'processing' ? 'upcoming' : 'completed'),
        title: 'Shipped',
        description: 'Your order has been shipped and is on the way',
        date: status === 'shipped' || status === 'delivered' ? new Date(shippingInfo?.shipped_at || Date.now() + 2 * 24 * 60 * 60 * 1000).toLocaleDateString() : undefined,
        icon: <Package className="w-5 h-5" />
      },
      {
        status: status === 'delivered' ? 'completed' : 'upcoming',
        title: 'Delivered',
        description: 'Your order has been delivered',
        date: status === 'delivered' ? new Date(shippingInfo?.delivered_at || Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString() : undefined,
        icon: <Truck className="w-5 h-5" />
      }
    ];
    
    return steps;
  };
  
  // Function to fetch order data by ID
  const fetchOrderById = async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getOrderById(id);
      if (data) {
        setOrderData(data.order);
        setShippingData(data.shipping);
        setTrackingSteps(generateTrackingSteps(data.shipping?.status || 'processing', data.shipping));
      } else {
        setError('Order not found. Please check the order ID or tracking number and try again.');
      }
    } catch (err) {
      console.error('Error fetching order:', err);
      setError('Failed to fetch order information. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Function to fetch order data by tracking number
  const fetchOrderByTrackingNumber = async (trackingNumber: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getOrderByTrackingNumber(trackingNumber);
      if (data) {
        setOrderData(data.order);
        setShippingData(data.shipping);
        setTrackingSteps(generateTrackingSteps(data.shipping?.status || 'processing', data.shipping));
      } else {
        setError('Order not found. Please check the order ID or tracking number and try again.');
      }
    } catch (err) {
      console.error('Error fetching order by tracking:', err);
      setError('Failed to fetch order information. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  // Search for order using either tracking number or order ID
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchTerm.trim()) {
      toast({
        title: "Input required",
        description: "Please enter an order ID or tracking number",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await searchOrder(searchTerm);
      
      if (result.found && result.data) {
        setOrderData(result.data.order);
        setShippingData(result.data.shipping);
        setTrackingSteps(generateTrackingSteps(
          result.data.shipping?.status || 'processing', 
          result.data.shipping
        ));
        
        toast({
          title: "Order found",
          description: `Found order for ${result.data.order.first_name} ${result.data.order.last_name}`,
        });
      } else {
        setOrderData(null);
        setShippingData(null);
        setError('Order not found. Please check the order ID or tracking number and try again.');
        
        toast({
          title: "Order not found",
          description: "We couldn't find any order matching your search",
          variant: "destructive"
        });
      }
    } catch (err) {
      console.error('Error searching for order:', err);
      setError('Failed to search for order. Please try again later.');
      
      toast({
        title: "Error",
        description: "An error occurred while searching for your order",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Set up real-time subscription for order status updates
  useEffect(() => {
    if (!orderData?.id) return;
    
    // Subscribe to changes in the orders table
    const orderChannel = supabase
      .channel('public:orders:id=' + orderData.id)
      .on('postgres_changes', { 
        event: 'UPDATE', 
        schema: 'public', 
        table: 'orders', 
        filter: `id=eq.${orderData.id}` 
      }, (payload) => {
        console.log('Order updated:', payload);
        setOrderData({...orderData, ...payload.new});
      })
      .subscribe();
      
    // Subscribe to changes in the shipping table
    const shippingChannel = supabase
      .channel('public:shipping:order_id=' + orderData.id)
      .on('postgres_changes', { 
        event: 'UPDATE', 
        schema: 'public', 
        table: 'shipping', 
        filter: `order_id=eq.${orderData.id}` 
      }, (payload) => {
        console.log('Shipping updated:', payload);
        setShippingData({...shippingData, ...payload.new});
        setTrackingSteps(generateTrackingSteps(payload.new.status, {...shippingData, ...payload.new}));
      })
      .subscribe();
    
    // Clean up subscriptions on unmount
    return () => {
      supabase.removeChannel(orderChannel);
      supabase.removeChannel(shippingChannel);
    };
  }, [orderData?.id, shippingData]);
  
  // Fetch order data on initial load if orderId is provided
  useEffect(() => {
    if (orderId) {
      fetchOrderById(orderId);
    }
  }, [orderId]);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Track Your Order</h1>
        
        {/* Order Tracking Form */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
            <div className="flex-grow">
              <label htmlFor="searchTerm" className="block text-sm font-medium text-gray-700 mb-1">
                Order ID or Tracking Number
              </label>
              <Input
                type="text"
                id="searchTerm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Enter your order ID or tracking number"
                className="w-full"
                disabled={isLoading}
                required
              />
            </div>
            <div className="flex items-end">
              <Button 
                type="submit" 
                className="bg-shop-primary hover:bg-shop-secondary h-10"
                disabled={isLoading}
              >
                {isLoading ? "Searching..." : (
                  <>
                    <Search className="w-4 h-4 mr-2" /> Track Order
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
        
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {orderData && shippingData && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="mb-6">
              <h2 className="text-xl font-bold mb-1">Order #{orderData.id}</h2>
              <p className="text-gray-600 mb-2">
                <span className="font-medium">Status:</span> {' '}
                <span className="capitalize">{orderData.status}</span>
              </p>
              <p className="text-gray-600">
                <span className="font-medium">Tracking Number:</span> {' '}
                {shippingData.tracking_number}
              </p>
              <p className="text-gray-600">
                <span className="font-medium">Estimated Delivery:</span> {' '}
                {new Date(shippingData.estimated_delivery).toLocaleDateString()}
              </p>
            </div>
            
            <Separator className="my-4" />
            
            {/* Tracking Timeline */}
            <div className="relative py-4">
              <h3 className="font-bold text-lg mb-4">Delivery Status</h3>
              
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
              <div className="absolute left-5 top-10 h-[calc(100%-40px)] w-0.5 bg-gray-200"></div>
            </div>
            
            <Separator className="my-4" />
            
            {/* Order and Shipping Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-bold text-lg mb-3">Shipping Information</h3>
                <div className="space-y-2">
                  <p>
                    <span className="text-sm text-gray-600 block">Recipient</span>
                    <span className="font-medium">
                      {orderData.first_name} {orderData.last_name}
                    </span>
                  </p>
                  <p>
                    <span className="text-sm text-gray-600 block">Contact</span>
                    <span className="font-medium">{orderData.email}</span>
                  </p>
                  <p>
                    <span className="text-sm text-gray-600 block">Shipping Address</span>
                    <span className="font-medium">
                      {orderData.address}, {orderData.city}, {orderData.zip_code}, {orderData.country}
                    </span>
                  </p>
                </div>
              </div>
              
              <div>
                <h3 className="font-bold text-lg mb-3">Order Information</h3>
                <div className="space-y-2">
                  <p>
                    <span className="text-sm text-gray-600 block">Order Date</span>
                    <span className="font-medium">
                      {new Date(orderData.created_at).toLocaleDateString()}
                    </span>
                  </p>
                  <p>
                    <span className="text-sm text-gray-600 block">Shipping Method</span>
                    <span className="font-medium">Standard Shipping</span>
                  </p>
                  <p>
                    <span className="text-sm text-gray-600 block">Order Total</span>
                    <span className="font-medium">${orderData.total_amount.toFixed(2)}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className="mt-auto">
        <Footer />
      </div>
    </div>
  );
};

export default OrderTracking;
