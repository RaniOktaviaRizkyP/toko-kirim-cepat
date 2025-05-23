
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  category: string;
  featured?: boolean;
}

const fetchProducts = async () => {
  const { data, error } = await supabase
    .from('products')
    .select('*');
  
  if (error) {
    throw error;
  }
  
  return data || [];
};

const Products = () => {
  const location = useLocation();
  const { toast } = useToast();
  const queryParams = new URLSearchParams(location.search);
  const categoryFilter = queryParams.get('category');
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(categoryFilter || 'All');
  const [sortBy, setSortBy] = useState('');
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>(['All']);
  
  const { data: products = [], isLoading, isError, error } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
  });
  
  // Extract unique categories
  useEffect(() => {
    if (products.length > 0) {
      const uniqueCategories = ['All', ...new Set(products.map(product => product.category))];
      setCategories(uniqueCategories);
    }
  }, [products]);
  
  // Filter and sort products
  useEffect(() => {
    let result = [...products];
    
    // Filter by category
    if (selectedCategory && selectedCategory !== 'All') {
      result = result.filter(product => product.category === selectedCategory);
    }
    
    // Filter by search term
    if (searchTerm) {
      result = result.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Sort products
    if (sortBy === 'priceLow') {
      result = result.sort((a, b) => Number(a.price) - Number(b.price));
    } else if (sortBy === 'priceHigh') {
      result = result.sort((a, b) => Number(b.price) - Number(a.price));
    } else if (sortBy === 'nameAZ') {
      result = result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'nameZA') {
      result = result.sort((a, b) => b.name.localeCompare(a.name));
    }
    
    setFilteredProducts(result);
  }, [selectedCategory, searchTerm, sortBy, products]);
  
  // Display error if fetching products fails
  useEffect(() => {
    if (isError && error) {
      toast({
        title: "Error loading products",
        description: error.message,
        variant: "destructive",
      });
    }
  }, [isError, error, toast]);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Products</h1>
        
        <div className="flex flex-col md:flex-row gap-8">
          {/* Filters */}
          <div className="w-full md:w-1/4 space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-2">Search</h3>
              <input
                type="text"
                placeholder="Search products..."
                className="w-full px-3 py-2 border rounded-md"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2">Categories</h3>
              <div className="space-y-1">
                {categories.map(category => (
                  <div key={category} className="flex items-center">
                    <button
                      className={`w-full text-left py-1 px-2 rounded hover:bg-gray-100 ${selectedCategory === category ? 'bg-shop-light text-shop-primary font-medium' : ''}`}
                      onClick={() => setSelectedCategory(category)}
                    >
                      {category}
                    </button>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2">Sort By</h3>
              <select 
                className="w-full px-3 py-2 border rounded-md"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="">Recommended</option>
                <option value="priceLow">Price: Low to High</option>
                <option value="priceHigh">Price: High to Low</option>
                <option value="nameAZ">Name: A to Z</option>
                <option value="nameZA">Name: Z to A</option>
              </select>
            </div>
          </div>
          
          {/* Products */}
          <div className="w-full md:w-3/4">
            {isLoading ? (
              <div className="text-center py-12">
                <p className="text-xl">Loading products...</p>
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-xl font-medium mb-2">No products found</h3>
                <p className="text-gray-600">Try changing your filters or search term.</p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Products;
