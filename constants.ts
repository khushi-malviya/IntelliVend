import { Product, User, UserRole, SalesStat } from './types';

export const MOCK_USER: User = {
  id: 'v1',
  name: 'Alex Developer',
  email: 'alex.developer@example.com',
  role: UserRole.VENDOR,
  avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
  age: 28,
  gender: 'Male',
  address: {
    street: '123 Galaxy Way',
    city: 'Tech District',
    state: 'CA',
    zip: '94105'
  }
};

export const CATEGORIES_DATA = [
  { 
    name: 'Electronics', 
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80',
    subCategories: ['Audio', 'Computers', 'Cameras', 'Accessories', 'Gaming']
  },
  { 
    name: 'Fashion', 
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=800&q=80',
    subCategories: ['Men', 'Women', 'Shoes', 'Outerwear', 'Accessories'] 
  },
  { 
    name: 'Furniture', 
    image: 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?auto=format&fit=crop&w=800&q=80',
    subCategories: ['Chairs', 'Tables', 'Sofas', 'Lighting', 'Decor']
  },
  { 
    name: 'Home & Living', 
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80',
    subCategories: ['Kitchen', 'Bedding', 'Storage', 'Plants', 'Dining']
  },
  { 
    name: 'Fitness', 
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80',
    subCategories: ['Equipment', 'Apparel', 'Supplements', 'Yoga', 'Tracking']
  },
  { 
    name: 'Books', 
    image: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=800&q=80',
    subCategories: ['Technology', 'Fiction', 'Self-Help', 'Design', 'Science']
  },
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'Ergonomic AI Chair',
    description: 'A futuristic chair that adapts to your posture in real-time using built-in sensors. Designed for 24/7 comfort with breathable mesh.',
    price: 599.99,
    originalPrice: 799.99,
    category: 'Furniture',
    subCategory: 'Chairs',
    imageUrl: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?auto=format&fit=crop&w=800&q=80'
    ],
    vendorId: 'v1',
    vendorName: 'FutureFurnish',
    rating: 4.8,
    reviewsCount: 124,
  },
  {
    id: 'p2',
    name: 'Pro Noise Cancelling Earbuds',
    description: 'Experience pure silence with our top-tier active noise cancellation technology and transparency mode. 30-hour battery life.',
    price: 199.50,
    originalPrice: 249.99,
    category: 'Electronics',
    subCategory: 'Audio',
    imageUrl: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80',
    images: [
       'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80',
       'https://images.unsplash.com/photo-1572569028738-411a29639581?auto=format&fit=crop&w=800&q=80',
       'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?auto=format&fit=crop&w=800&q=80'
    ],
    vendorId: 'v2',
    vendorName: 'AudioTech',
    rating: 4.5,
    reviewsCount: 89,
  },
  {
    id: 'p3',
    name: 'Ceramic Matcha Set',
    description: 'Premium handcrafted ceramic set with organic tea leaves harvested from high mountains. Includes whisk, bowl, and spoon.',
    price: 34.99,
    category: 'Home & Living',
    subCategory: 'Kitchen',
    imageUrl: 'https://images.unsplash.com/photo-1563822249548-9a72b6353cd1?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1563822249548-9a72b6353cd1?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1582794543139-8ac92a900275?auto=format&fit=crop&w=800&q=80'
    ],
    vendorId: 'v3',
    vendorName: 'NatureGood',
    rating: 4.9,
    reviewsCount: 210,
  },
  {
    id: 'p4',
    name: 'Mechanical Keyboard 60%',
    description: 'Clicky blue switches with customizable RGB lighting for the ultimate tactile typing experience. Compact design for gamers.',
    price: 89.99,
    originalPrice: 119.99,
    category: 'Electronics',
    subCategory: 'Computers',
    imageUrl: 'https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1587829741301-dc798b91a603?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=800&q=80'
    ],
    vendorId: 'v1',
    vendorName: 'FutureFurnish',
    rating: 4.6,
    reviewsCount: 55,
  },
  {
    id: 'p5',
    name: 'Smart Hydration Bottle',
    description: 'Tracks your hydration levels via app and glows gently when you need to drink water. Stainless steel construction.',
    price: 45.00,
    category: 'Fitness',
    subCategory: 'Equipment',
    imageUrl: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1602143407151-01114192008b?auto=format&fit=crop&w=800&q=80'
    ],
    vendorId: 'v2',
    vendorName: 'AudioTech',
    rating: 4.2,
    reviewsCount: 30,
  },
  {
    id: 'p6',
    name: 'Minimalist Desk Lamp',
    description: 'Adjustable color temperature LED lamp with wireless charging base for your devices. Sleek aluminum finish.',
    price: 79.00,
    originalPrice: 99.00,
    category: 'Furniture',
    subCategory: 'Lighting',
    imageUrl: 'https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1534073828943-f801091a7d58?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1507473888900-52e1adad5452?auto=format&fit=crop&w=800&q=80'
    ],
    vendorId: 'v1',
    vendorName: 'FutureFurnish',
    rating: 4.7,
    reviewsCount: 42,
  },
  {
    id: 'p7',
    name: 'Vintage Denim Jacket',
    description: 'Classic oversized denim jacket with distressed details. 100% cotton, perfect for layering in any season.',
    price: 65.00,
    category: 'Fashion',
    subCategory: 'Outerwear',
    imageUrl: 'https://images.unsplash.com/photo-1551537482-f2075a1d41f2?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1551537482-f2075a1d41f2?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1523205565295-f8e91625443b?auto=format&fit=crop&w=800&q=80'
    ],
    vendorId: 'v4',
    vendorName: 'UrbanStyle',
    rating: 4.4,
    reviewsCount: 67,
  },
  {
    id: 'p8',
    name: 'Running Shoes - Velocity X',
    description: 'Ultra-lightweight running shoes with foam cushioning technology. Breathable upper mesh for maximum comfort.',
    price: 129.99,
    originalPrice: 180.00,
    category: 'Fashion',
    subCategory: 'Shoes',
    imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1560769629-975e13f0c470?auto=format&fit=crop&w=800&q=80'
    ],
    vendorId: 'v4',
    vendorName: 'UrbanStyle',
    rating: 4.8,
    reviewsCount: 312,
  },
  {
    id: 'p9',
    name: 'The Art of Code',
    description: 'A comprehensive guide to software craftsmanship. Hardcover edition with illustrations.',
    price: 29.99,
    category: 'Books',
    subCategory: 'Technology',
    imageUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80'
    ],
    vendorId: 'v5',
    vendorName: 'BookHaven',
    rating: 4.9,
    reviewsCount: 500,
  }
];

export const VENDOR_STATS: SalesStat[] = [
  { name: 'Mon', sales: 12, revenue: 1200 },
  { name: 'Tue', sales: 19, revenue: 2100 },
  { name: 'Wed', sales: 15, revenue: 1600 },
  { name: 'Thu', sales: 22, revenue: 2800 },
  { name: 'Fri', sales: 30, revenue: 3500 },
  { name: 'Sat', sales: 45, revenue: 5000 },
  { name: 'Sun', sales: 38, revenue: 4100 },
];