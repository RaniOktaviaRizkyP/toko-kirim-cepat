
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, CreditCard } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { createOrder } from '../services/orderService';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  city: string;
  zipCode: string;
  country: string;
  cardNumber: string;
}

const Checkout = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { items, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: user?.email || '',
    address: '',
    city: '',
    zipCode: '',
    country: 'Indonesia',
    cardNumber: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
    
    if (validationError) {
      setValidationError(null);
    }
  };
  
  const validateForm = () => {
    if (!formData.firstName?.trim()) {
      setValidationError('Mohon masukkan nama depan');
      return false;
    }
    if (!formData.lastName?.trim()) {
      setValidationError('Mohon masukkan nama belakang');
      return false;
    }
    if (!formData.email?.trim() || !formData.email.includes('@')) {
      setValidationError('Mohon masukkan alamat email yang valid');
      return false;
    }
    if (!formData.address?.trim()) {
      setValidationError('Mohon masukkan alamat pengiriman');
      return false;
    }
    if (!formData.city?.trim()) {
      setValidationError('Mohon masukkan nama kota');
      return false;
    }
    if (!formData.zipCode?.trim()) {
      setValidationError('Mohon masukkan kode pos');
      return false;
    }
    if (!formData.cardNumber?.trim()) {
      setValidationError('Mohon masukkan nomor kartu');
      return false;
    }
    return true;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSubmitting) return;
    
    console.log('Starting checkout process...');
    
    if (!validateForm()) {
      toast({
        title: "Validasi gagal",
        description: validationError,
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      console.log('Preparing order data...');
      const orderData = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        address: formData.address.trim(),
        city: formData.city.trim(),
        zipCode: formData.zipCode.trim(),
        country: formData.country.trim(),
        items: items,
        totalAmount: Number((totalPrice + (totalPrice * 0.08)).toFixed(2))
      };

      console.log('Creating order...');
      const result = await createOrder(orderData);
      
      console.log('Order created successfully:', result);
      clearCart();
      
      toast({
        title: "Pesanan berhasil dibuat!",
        description: `Pesanan Anda telah berhasil dibuat! Nomor tracking: ${result.trackingNumber}`,
      });
      
      // Navigate to tracking page with order info
      navigate('/tracking', { 
        state: { 
          orderId: result.orderId,
          trackingNumber: result.trackingNumber
        } 
      });
      
    } catch (error: any) {
      console.error("Error placing order:", error);
      toast({
        title: "Gagal membuat pesanan",
        description: error.message || "Terjadi kesalahan saat memproses pesanan. Silakan coba lagi.",
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
          <div>
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h2 className="text-xl font-bold mb-4">Informasi Kontak</h2>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                      Nama Depan *
                    </label>
                    <Input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                      Nama Belakang *
                    </label>
                    <Input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Alamat Email *
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
                    Alamat Lengkap *
                  </label>
                  <Input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    placeholder="Masukkan alamat lengkap Anda"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                      Kota *
                    </label>
                    <Input
                      type="text"
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-1">
                      Kode Pos *
                    </label>
                    <Input
                      type="text"
                      id="zipCode"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                    Negara *
                  </label>
                  <Input
                    type="text"
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold mb-4">Informasi Pembayaran</h2>
              
              <div>
                <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">
                  Nomor Kartu *
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
              <h2 className="text-xl font-bold mb-4">Ringkasan Pesanan</h2>
              
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
                        <span className="font-medium">Rp {(item.product.price * item.quantity).toLocaleString('id-ID')}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="space-y-2 text-sm border-b pb-4 mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">Rp {totalPrice.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Ongkos Kirim</span>
                  <span className="font-medium">Gratis</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Pajak (8%)</span>
                  <span className="font-medium">Rp {(totalPrice * 0.08).toLocaleString('id-ID')}</span>
                </div>
              </div>
              
              <div className="flex justify-between mb-6">
                <span className="font-bold">Total</span>
                <span className="font-bold">Rp {(totalPrice + totalPrice * 0.08).toLocaleString('id-ID')}</span>
              </div>
              
              <Button 
                type="submit" 
                className="bg-shop-primary text-white w-full py-3 px-4 rounded-md text-center block hover:bg-shop-secondary transition-colors flex items-center justify-center"
                disabled={isSubmitting}
              >
                <Check className="w-5 h-5 mr-2" /> 
                {isSubmitting ? "Memproses..." : "Selesaikan Pesanan"}
              </Button>
              
              <p className="text-xs text-gray-500 text-center mt-4">
                Dengan melakukan pemesanan, Anda menyetujui Syarat & Ketentuan dan Kebijakan Privasi kami.
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
