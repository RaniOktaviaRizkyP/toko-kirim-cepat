
import React from 'react';
import { useCart } from '../context/CartContext';
import { MinusCircle, PlusCircle, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CartItemProps {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

const CartItem: React.FC<CartItemProps> = ({ id, name, price, image, quantity }) => {
  const { updateQuantity, removeItem } = useCart();
  
  return (
    <div className="flex items-center py-4 border-b">
      <div className="w-20 h-20 flex-shrink-0">
        <img src={image} alt={name} className="w-full h-full object-cover rounded" />
      </div>
      
      <div className="ml-4 flex-grow">
        <h3 className="font-medium text-gray-800">{name}</h3>
        <p className="text-gray-600">${price.toFixed(2)}</p>
      </div>
      
      <div className="flex items-center space-x-2">
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8" 
          onClick={() => updateQuantity(id, quantity - 1)}
        >
          <MinusCircle className="h-4 w-4" />
        </Button>
        
        <span className="w-8 text-center">{quantity}</span>
        
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8" 
          onClick={() => updateQuantity(id, quantity + 1)}
        >
          <PlusCircle className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="ml-4 w-24 text-right">
        <p className="font-medium">${(price * quantity).toFixed(2)}</p>
      </div>
      
      <Button 
        variant="ghost" 
        size="icon" 
        className="ml-2 text-gray-400 hover:text-red-500" 
        onClick={() => removeItem(id)}
      >
        <Trash className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default CartItem;
