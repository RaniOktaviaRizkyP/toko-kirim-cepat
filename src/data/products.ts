
export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  category: string;
  featured?: boolean;
}

export const products: Product[] = [
  {
    id: "1",
    name: "Premium Headphones",
    price: 249.99,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8aGVhZHBob25lc3xlbnwwfHwwfHx8MA%3D%3D",
    description: "High-quality wireless headphones with noise cancellation and premium sound quality. Perfect for music lovers and professionals.",
    category: "Electronics",
    featured: true
  },
  {
    id: "2",
    name: "Smartwatch Pro",
    price: 199.99,
    image: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c21hcnR3YXRjaHxlbnwwfHwwfHx8MA%3D%3D",
    description: "Advanced smartwatch with health tracking, notifications, and apps. Water resistant and long battery life.",
    category: "Electronics",
    featured: true
  },
  {
    id: "3",
    name: "Laptop Backpack",
    price: 79.99,
    image: "https://images.unsplash.com/photo-1622560480654-d96214fdc887?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bGFwdG9wJTIwYmFja3BhY2t8ZW58MHx8MHx8fDA%3D",
    description: "Durable and stylish backpack with padded compartments for laptops up to 15 inches. Multiple pockets and water-resistant material.",
    category: "Accessories",
    featured: true
  },
  {
    id: "4",
    name: "Wireless Mouse",
    price: 39.99,
    image: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8d2lyZWxlc3MlMjBtb3VzZXxlbnwwfHwwfHx8MA%3D%3D",
    description: "Ergonomic wireless mouse with precise tracking and long battery life. Compatible with all major operating systems.",
    category: "Electronics"
  },
  {
    id: "5",
    name: "Bluetooth Speaker",
    price: 89.99,
    image: "https://images.unsplash.com/photo-1589003077984-894e133dabab?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8YmxldXRvb3RoJTIwc3BlYWtlcnxlbnwwfHwwfHx8MA%3D%3D",
    description: "Portable bluetooth speaker with crystal clear sound and 12 hours of battery life. Water-resistant and durable design.",
    category: "Electronics"
  },
  {
    id: "6",
    name: "Classic T-Shirt",
    price: 24.99,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8dHNoaXJ0fGVufDB8fDB8fHww",
    description: "Premium cotton t-shirt with a comfortable fit. Available in multiple colors and sizes.",
    category: "Clothing"
  },
  {
    id: "7",
    name: "Coffee Mug",
    price: 14.99,
    image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8Y29mZmVlJTIwbXVnfGVufDB8fDB8fHww",
    description: "Ceramic coffee mug with a sleek design. Dishwasher and microwave safe.",
    category: "Home"
  },
  {
    id: "8",
    name: "Desk Lamp",
    price: 49.99,
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZGVzayUyMGxhbXB8ZW58MHx8MHx8fDA%3D",
    description: "LED desk lamp with adjustable brightness and color temperature. Energy-efficient and modern design.",
    category: "Home",
    featured: true
  }
];

export function getProductById(id: string): Product | undefined {
  return products.find(product => product.id === id);
}

export function getFeaturedProducts(): Product[] {
  return products.filter(product => product.featured);
}

export function getProductsByCategory(category: string): Product[] {
  return products.filter(product => product.category === category);
}
