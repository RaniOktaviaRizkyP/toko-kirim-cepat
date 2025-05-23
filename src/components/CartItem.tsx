
import React from 'react';
import { Minus, Plus, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '../context/CartContext';

interface CartItemProps {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

const CartItem: React.FC<CartItemProps> = ({ id, name, price, image, quantity }) => {
  const { updateQuantity, removeItem } = useCart();

  const handleIncrement = () => {
    updateQuantity(id, quantity + 1);
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      updateQuantity(id, quantity - 1);
    } else {
      removeItem(id);
    }
  };

  const handleRemove = () => {
    removeItem(id);
  };

  return (
    <div className="py-4 flex flex-wrap md:flex-nowrap gap-4">
      <div className="w-24 h-24 flex-shrink-0">
        <img 
          src={image} 
          alt={name} 
          className="w-full h-full object-cover rounded-md"
        />
      </div>
      
      <div className="flex-grow">
        <h4 className="text-lg font-medium">{name}</h4>
        <div className="text-shop-primary font-medium mt-1">${Number(price).toFixed(2)}</div>
      </div>
      
      <div className="flex items-center space-x-2">
        <Button 
          variant="outline" 
          size="icon" 
          className="h-8 w-8" 
          onClick={handleDecrement}
          aria-label="Decrease quantity"
        >
          <Minus className="h-3 w-3" />
        </Button>
        
        <span className="w-10 text-center">{quantity}</span>
        
        <Button 
          variant="outline" 
          size="icon" 
          className="h-8 w-8" 
          onClick={handleIncrement}
          aria-label="Increase quantity"
        >
          <Plus className="h-3 w-3" />
        </Button>
      </div>
      
      <div className="w-24 text-right font-medium">
        ${(price * quantity).toFixed(2)}
      </div>
      
      <Button 
        variant="ghost" 
        size="icon" 
        className="text-gray-400 hover:text-red-500" 
        onClick={handleRemove}
        aria-label="Remove from cart"
      >
        <Trash className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default CartItem;
