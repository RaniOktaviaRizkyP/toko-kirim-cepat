
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from 'uuid';

interface OrderItem {
  product: {
    id: string | number;
    name: string;
    price: number;
    image: string;
  };
  quantity: number;
}

interface OrderData {
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  city: string;
  zipCode: string;
  country: string;
  items: OrderItem[];
  totalAmount: number;
}

export async function createOrder(orderData: OrderData) {
  try {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    
    // Create a new order
    const orderId = uuidv4();
    const { error: orderError } = await supabase
      .from('orders')
      .insert({
        id: orderId,
        user_id: user?.id || null,
        first_name: orderData.firstName,
        last_name: orderData.lastName,
        email: orderData.email,
        address: orderData.address,
        city: orderData.city,
        zip_code: orderData.zipCode,
        country: orderData.country,
        total_amount: orderData.totalAmount,
        status: 'pending'
      });

    if (orderError) {
      console.error('Error creating order:', orderError);
      throw orderError;
    }

    // Create order items
    const orderItems = orderData.items.map(item => {
      const productId = typeof item.product.id === 'number' 
        ? item.product.id.toString() 
        : item.product.id;
      
      return {
        order_id: orderId,
        product_id: productId,
        quantity: item.quantity,
        unit_price: item.product.price
      };
    });

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) {
      console.error('Error creating order items:', itemsError);
      throw itemsError;
    }

    // Create shipping entry
    const trackingNumber = generateTrackingNumber();
    const estimatedDelivery = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString();
    
    const { error: shippingError } = await supabase
      .from('shipping')
      .insert({
        order_id: orderId,
        tracking_number: trackingNumber,
        estimated_delivery: estimatedDelivery,
        status: 'processing'
      });

    if (shippingError) {
      console.error('Error creating shipping record:', shippingError);
      throw shippingError;
    }

    return { orderId, trackingNumber };
  } catch (error) {
    console.error('Error processing order:', error);
    throw error;
  }
}

export function generateTrackingNumber() {
  return 'TRK' + Math.floor(Math.random() * 100000000);
}

export async function getOrderByTrackingNumber(trackingNumber: string) {
  try {
    const { data, error } = await supabase
      .from('shipping')
      .select(`
        *,
        orders(*)
      `)
      .eq('tracking_number', trackingNumber)
      .single();

    if (error) {
      console.error('Error fetching order by tracking number:', error);
      throw error;
    }

    return {
      order: data.orders,
      shipping: data,
      items: null
    };
  } catch (error) {
    console.error('Error in getOrderByTrackingNumber:', error);
    throw error;
  }
}

export async function getOrderById(orderId: string) {
  try {
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();

    if (orderError) {
      console.error('Error fetching order by ID:', orderError);
      throw orderError;
    }

    const { data: shippingData, error: shippingError } = await supabase
      .from('shipping')
      .select('*')
      .eq('order_id', orderId)
      .single();

    if (shippingError && shippingError.code !== 'PGRST116') {
      console.error('Error fetching shipping information:', shippingError);
      throw shippingError;
    }

    const { data: orderItems, error: itemsError } = await supabase
      .from('order_items')
      .select('*')
      .eq('order_id', orderId);

    if (itemsError) {
      console.error('Error fetching order items:', itemsError);
      throw itemsError;
    }

    return {
      order: orderData,
      shipping: shippingData || null,
      items: orderItems || []
    };
  } catch (error) {
    console.error('Error in getOrderById:', error);
    throw error;
  }
}

export async function updateOrderStatus(orderId: string, status: string) {
  try {
    const { error } = await supabase
      .from('orders')
      .update({ status: status })
      .eq('id', orderId);

    if (error) {
      console.error('Error updating order status:', error);
      throw error;
    }

    return true;
  } catch (error) {
    console.error('Error in updateOrderStatus:', error);
    throw error;
  }
}

export async function updateShippingStatus(orderId: string, status: string) {
  try {
    const updates: any = { status };
    
    if (status === 'shipped') {
      updates.shipped_at = new Date().toISOString();
    } else if (status === 'delivered') {
      updates.delivered_at = new Date().toISOString();
    }

    const { error } = await supabase
      .from('shipping')
      .update(updates)
      .eq('order_id', orderId);

    if (error) {
      console.error('Error updating shipping status:', error);
      throw error;
    }

    return true;
  } catch (error) {
    console.error('Error in updateShippingStatus:', error);
    throw error;
  }
}

export async function searchOrder(searchTerm: string) {
  try {
    const { data: trackingData, error: trackingError } = await supabase
      .from('shipping')
      .select(`
        *,
        orders(*)
      `)
      .eq('tracking_number', searchTerm);

    if (!trackingError && trackingData && trackingData.length > 0) {
      return { 
        found: true, 
        type: 'tracking',
        data: {
          order: trackingData[0].orders,
          shipping: trackingData[0],
          items: null
        }
      };
    }

    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .select(`
        *,
        shipping(*)
      `)
      .eq('id', searchTerm);

    if (!orderError && orderData && orderData.length > 0) {
      return { 
        found: true, 
        type: 'order',
        data: {
          order: orderData[0],
          shipping: orderData[0].shipping?.length > 0 ? orderData[0].shipping[0] : null,
          items: null
        }
      };
    }

    return { found: false };
  } catch (error) {
    console.error('Error searching for order:', error);
    throw error;
  }
}

export async function getAllOrders() {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        shipping(*),
        order_items(
          *,
          products(name, image)
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching all orders:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error in getAllOrders:', error);
    throw error;
  }
}
