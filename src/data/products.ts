
export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string;
  category: string;
  featured?: boolean;
}

export const products: Product[] = [
  {
    id: 1,
    name: "Premium Headphones",
    price: 249.99,
    image: "/placeholder.svg",
    description: "High-quality wireless headphones with noise cancellation and premium sound quality. Perfect for music lovers and professionals.",
    category: "Electronics",
    featured: true
  },
  {
    id: 2,
    name: "Smartwatch Pro",
    price: 199.99,
    image: "/placeholder.svg",
    description: "Advanced smartwatch with health tracking, notifications, and apps. Water resistant and long battery life.",
    category: "Electronics",
    featured: true
  },
  {
    id: 3,
    name: "Laptop Backpack",
    price: 79.99,
    image: "/placeholder.svg",
    description: "Durable and stylish backpack with padded compartments for laptops up to 15 inches. Multiple pockets and water-resistant material.",
    category: "Accessories",
    featured: true
  },
  {
    id: 4,
    name: "Wireless Mouse",
    price: 39.99,
    image: "/placeholder.svg",
    description: "Ergonomic wireless mouse with precise tracking and long battery life. Compatible with all major operating systems.",
    category: "Electronics"
  },
  {
    id: 5,
    name: "Bluetooth Speaker",
    price: 89.99,
    image: "/placeholder.svg",
    description: "Portable bluetooth speaker with crystal clear sound and 12 hours of battery life. Water-resistant and durable design.",
    category: "Electronics"
  },
  {
    id: 6,
    name: "Classic T-Shirt",
    price: 24.99,
    image: "/placeholder.svg",
    description: "Premium cotton t-shirt with a comfortable fit. Available in multiple colors and sizes.",
    category: "Clothing"
  },
  {
    id: 7,
    name: "Coffee Mug",
    price: 14.99,
    image: "/placeholder.svg",
    description: "Ceramic coffee mug with a sleek design. Dishwasher and microwave safe.",
    category: "Home"
  },
  {
    id: 8,
    name: "Desk Lamp",
    price: 49.99,
    image: "/placeholder.svg",
    description: "LED desk lamp with adjustable brightness and color temperature. Energy-efficient and modern design.",
    category: "Home",
    featured: true
  }
];

export function getProductById(id: number): Product | undefined {
  return products.find(product => product.id === id);
}

export function getFeaturedProducts(): Product[] {
  return products.filter(product => product.featured);
}

export function getProductsByCategory(category: string): Product[] {
  return products.filter(product => product.category === category);
}
