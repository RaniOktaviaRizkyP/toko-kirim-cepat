
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AdminProductManagement from '../components/AdminProductManagement';
import AdminOrderManagement from '../components/AdminOrderManagement';
import { Button } from '@/components/ui/button';
import { Package, ShoppingCart } from 'lucide-react';

const Admin = () => {
  const { user, isAdmin, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<'products' | 'orders'>('products');

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex justify-center items-center">
          <p className="text-xl">Loading...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!user || !isAdmin) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 flex-1">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
        
        {/* Tab Navigation */}
        <div className="flex space-x-4 mb-6">
          <Button
            variant={activeTab === 'products' ? 'default' : 'outline'}
            onClick={() => setActiveTab('products')}
            className="flex items-center"
          >
            <Package className="w-4 h-4 mr-2" />
            Products
          </Button>
          <Button
            variant={activeTab === 'orders' ? 'default' : 'outline'}
            onClick={() => setActiveTab('orders')}
            className="flex items-center"
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            Orders
          </Button>
        </div>
        
        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow-sm">
          {activeTab === 'products' && <AdminProductManagement />}
          {activeTab === 'orders' && <AdminOrderManagement />}
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Admin;
