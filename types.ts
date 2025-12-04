export interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number; // Added for deals
  category: string;
  subCategory?: string; // Added for more granular categorization
  imageUrl: string; // Main display image
  images?: string[]; // Array of all product images
  vendorId: string;
  vendorName: string;
  rating: number;
  reviewsCount: number;
  reviews?: Review[];
}

export interface CartItem extends Product {
  quantity: number;
}

export enum UserRole {
  BUYER = 'BUYER',
  VENDOR = 'VENDOR',
  ADMIN = 'ADMIN'
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zip: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl: string;
  age?: number;
  gender?: string;
  address?: Address;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export interface SalesStat {
  name: string;
  sales: number;
  revenue: number;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  date: string;
  status: 'processing' | 'shipped' | 'delivered';
  shippingAddress: Address;
  paymentMethod: string;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}