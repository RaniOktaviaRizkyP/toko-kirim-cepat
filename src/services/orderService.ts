
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
    console.log('Creating order with data:', orderData);
    
    // Get current user (bisa null untuk guest checkout)
    const { data: { user } } = await supabase.auth.getUser();
    console.log('Current user:', user?.id || 'Guest user');
    
    // Create a new order
    const orderId = uuidv4();
    console.log('Generated order ID:', orderId);
    
    const { data: orderResult, error: orderError } = await supabase
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
      })
      .select()
      .single();

    if (orderError) {
      console.error('Error creating order:', orderError);
      throw new Error(`Failed to create order: ${orderError.message}`);
    }

    console.log('Order created successfully:', orderResult);

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

    console.log('Creating order items:', orderItems);

    const { data: itemsResult, error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems)
      .select();

    if (itemsError) {
      console.error('Error creating order items:', itemsError);
      throw new Error(`Failed to create order items: ${itemsError.message}`);
    }

    console.log('Order items created successfully:', itemsResult);

    // Create shipping entry
    const trackingNumber = generateTrackingNumber();
    const estimatedDelivery = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString();
    
    console.log('Creating shipping record with tracking number:', trackingNumber);
    
    const { data: shippingResult, error: shippingError } = await supabase
      .from('shipping')
      .insert({
        order_id: orderId,
        tracking_number: trackingNumber,
        estimated_delivery: estimatedDelivery,
        status: 'processing'
      })
      .select()
      .single();

    if (shippingError) {
      console.error('Error creating shipping record:', shippingError);
      throw new Error(`Failed to create shipping record: ${shippingError.message}`);
    }

    console.log('Shipping record created successfully:', shippingResult);

    return { orderId, trackingNumber };
  } catch (error) {
    console.error('Error in createOrder:', error);
    throw error;
  }
}

export function generateTrackingNumber() {
  return 'TRK' + Math.floor(Math.random() * 100000000);
}

export async function getOrderByTrackingNumber(trackingNumber: string) {
  try {
    console.log('Searching for order with tracking number:', trackingNumber);
    
    const { data, error } = await supabase
      .from('shipping')
      .select(`
        *,
        orders(*)
      `)
      .eq('tracking_number', trackingNumber)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        console.log('No order found with tracking number:', trackingNumber);
        return null;
      }
      console.error('Error fetching order by tracking number:', error);
      throw new Error(`Failed to fetch order: ${error.message}`);
    }

    console.log('Order found by tracking number:', data);
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
    console.log('Fetching order by ID:', orderId);
    
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();

    if (orderError) {
      if (orderError.code === 'PGRST116') {
        console.log('No order found with ID:', orderId);
        return null;
      }
      console.error('Error fetching order by ID:', orderError);
      throw new Error(`Failed to fetch order: ${orderError.message}`);
    }

    const { data: shippingData, error: shippingError } = await supabase
      .from('shipping')
      .select('*')
      .eq('order_id', orderId)
      .single();

    if (shippingError && shippingError.code !== 'PGRST116') {
      console.error('Error fetching shipping information:', shippingError);
      throw new Error(`Failed to fetch shipping info: ${shippingError.message}`);
    }

    const { data: orderItems, error: itemsError } = await supabase
      .from('order_items')
      .select('*')
      .eq('order_id', orderId);

    if (itemsError) {
      console.error('Error fetching order items:', itemsError);
      throw new Error(`Failed to fetch order items: ${itemsError.message}`);
    }

    console.log('Order data fetched successfully:', { orderData, shippingData, orderItems });

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
    console.log('Updating order status:', { orderId, status });
    
    const { data, error } = await supabase
      .from('orders')
      .update({ status: status })
      .eq('id', orderId)
      .select()
      .single();

    if (error) {
      console.error('Error updating order status:', error);
      throw new Error(`Failed to update order status: ${error.message}`);
    }

    console.log('Order status updated successfully:', data);
    return data;
  } catch (error) {
    console.error('Error in updateOrderStatus:', error);
    throw error;
  }
}

export async function updateShippingStatus(orderId: string, status: string) {
  try {
    console.log('Updating shipping status:', { orderId, status });
    
    const updates: any = { status };
    
    if (status === 'shipped') {
      updates.shipped_at = new Date().toISOString();
    } else if (status === 'delivered') {
      updates.delivered_at = new Date().toISOString();
    }

    const { data, error } = await supabase
      .from('shipping')
      .update(updates)
      .eq('order_id', orderId)
      .select()
      .single();

    if (error) {
      console.error('Error updating shipping status:', error);
      throw new Error(`Failed to update shipping status: ${error.message}`);
    }

    console.log('Shipping status updated successfully:', data);
    return data;
  } catch (error) {
    console.error('Error in updateShippingStatus:', error);
    throw error;
  }
}

export async function searchOrder(searchTerm: string) {
  try {
    console.log('Searching for order with term:', searchTerm);
    
    // First try to find by tracking number
    const { data: trackingData, error: trackingError } = await supabase
      .from('shipping')
      .select(`
        *,
        orders(*)
      `)
      .eq('tracking_number', searchTerm);

    if (!trackingError && trackingData && trackingData.length > 0) {
      console.log('Order found by tracking number:', trackingData[0]);
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

    // Then try to find by order ID
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .select(`
        *,
        shipping(*)
      `)
      .eq('id', searchTerm);

    if (!orderError && orderData && orderData.length > 0) {
      console.log('Order found by order ID:', orderData[0]);
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

    console.log('No order found with search term:', searchTerm);
    return { found: false };
  } catch (error) {
    console.error('Error searching for order:', error);
    throw error;
  }
}

export async function getAllOrders() {
  try {
    console.log('Fetching all orders for admin');
    
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
      throw new Error(`Failed to fetch orders: ${error.message}`);
    }

    console.log('All orders fetched successfully:', data?.length || 0, 'orders');
    return data;
  } catch (error) {
    console.error('Error in getAllOrders:', error);
    throw error;
  }
}
