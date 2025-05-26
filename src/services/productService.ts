
import { supabase } from "@/integrations/supabase/client";

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  category: string;
  featured?: boolean;
}

export interface CreateProductData {
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  featured?: boolean;
}

export interface UpdateProductData {
  name?: string;
  description?: string;
  price?: number;
  category?: string;
  image?: string;
  featured?: boolean;
}

export async function fetchProducts(): Promise<Product[]> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*');
    
    if (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
}

export async function createProduct(productData: CreateProductData): Promise<Product> {
  try {
    const { data, error } = await supabase
      .from('products')
      .insert([productData])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating product:', error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
}

export async function updateProduct(id: string, productData: UpdateProductData): Promise<Product> {
  try {
    const { data, error } = await supabase
      .from('products')
      .update(productData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating product:', error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
}

export async function deleteProduct(id: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
}

export async function fetchProductById(id: string): Promise<Product | null> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        // No rows returned - not found
        return null;
      }
      console.error('Error fetching product by ID:', error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching product by ID:', error);
    throw error;
  }
}

export async function getFeaturedProducts(): Promise<Product[]> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('featured', true);
    
    if (error) {
      console.error('Error fetching featured products:', error);
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error('Error fetching featured products:', error);
    throw error;
  }
}

export async function getProductsByCategory(category: string): Promise<Product[]> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('category', category);
    
    if (error) {
      console.error('Error fetching products by category:', error);
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error('Error fetching products by category:', error);
    throw error;
  }
}
