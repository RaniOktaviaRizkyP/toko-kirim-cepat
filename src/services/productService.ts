import { supabase } from "@/integrations/supabase/client";
import { products } from "../data/products"; // Keep using mock data as fallback

export async function fetchProducts() {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*');
    
    if (error) {
      console.error('Error fetching products:', error);
      return products; // Fallback to mock data
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching products:', error);
    return products; // Fallback to mock data
  }
}

export async function fetchProductById(id: number | string) {
  // For now, we'll keep using the mock data
  // This is because our mock data uses number IDs while Supabase uses UUIDs
  // In a real app, we'd update this to use UUIDs consistently
  try {
    if (typeof id === 'string' && id.includes('-')) {
      // This looks like a UUID, try to fetch from Supabase
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error || !data) {
        throw error;
      }
      
      return data;
    } else {
      // This is a number ID from our mock data
      return products.find(p => p.id === Number(id));
    }
  } catch (error) {
    console.error('Error fetching product by ID:', error);
    return products.find(p => p.id === Number(id)); // Fallback to mock data
  }
}
