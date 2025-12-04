import { Product, User, Order, Review, UserRole } from '../types';
import { INITIAL_PRODUCTS, MOCK_USER } from '../constants';

// Keys for LocalStorage
const KEYS = {
  USERS: 'intellivend_users',
  PRODUCTS: 'intellivend_products',
  ORDERS: 'intellivend_orders',
  CURRENT_USER: 'intellivend_user'
};

// Helper to simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

class DatabaseService {
  private init() {
    // Migrate Products: Ensure images are up to date even if user has cached data
    const currentProductsStr = localStorage.getItem(KEYS.PRODUCTS);
    
    if (!currentProductsStr) {
      localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
    } else {
      try {
        const products: Product[] = JSON.parse(currentProductsStr);
        let changed = false;
        
        // Sync images from constants to local storage for matching IDs
        // WE FORCE THIS UPDATE every refresh to ensure image fixes propagate to existing users
        products.forEach(p => {
          const fresh = INITIAL_PRODUCTS.find(ip => ip.id === p.id);
          if (fresh) {
             // FORCE update the image URL and images array to the fresh constant
             // Unconditional assignment ensures that even if local looks valid, we use the confirmed working URL
             p.imageUrl = fresh.imageUrl;
             p.images = fresh.images;
             changed = true;
          }
        });

        if (changed) {
          localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(products));
        }
      } catch (e) {
        // If corrupt, reset
        localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
      }
    }

    if (!localStorage.getItem(KEYS.ORDERS)) {
      localStorage.setItem(KEYS.ORDERS, JSON.stringify([]));
    }
  }

  constructor() {
    this.init();
  }

  // --- Products ---
  async getProducts(): Promise<Product[]> {
    await delay(300);
    const data = localStorage.getItem(KEYS.PRODUCTS);
    return data ? JSON.parse(data) : [];
  }

  async addProduct(product: Product): Promise<Product> {
    await delay(500);
    const products = await this.getProducts();
    const newProducts = [product, ...products];
    localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(newProducts));
    this.triggerEvent('db-products-changed');
    return product;
  }

  async updateProduct(updatedProduct: Product): Promise<void> {
    await delay(400);
    const products = await this.getProducts();
    const index = products.findIndex(p => p.id === updatedProduct.id);
    if (index !== -1) {
      products[index] = updatedProduct;
      localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(products));
      this.triggerEvent('db-products-changed');
    }
  }

  async deleteProduct(productId: string): Promise<void> {
    await delay(400);
    const products = await this.getProducts();
    const newProducts = products.filter(p => p.id !== productId);
    localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(newProducts));
    this.triggerEvent('db-products-changed');
  }

  // --- Reviews ---
  async addReview(productId: string, review: Review): Promise<void> {
    await delay(400);
    const products = await this.getProducts();
    const product = products.find(p => p.id === productId);
    
    if (product) {
      const existingReviews = product.reviews || [];
      const newReviews = [review, ...existingReviews];
      
      // Recalculate rating
      const totalRating = newReviews.reduce((sum, r) => sum + r.rating, 0);
      const newRating = parseFloat((totalRating / newReviews.length).toFixed(1));

      product.reviews = newReviews;
      product.rating = newRating;
      product.reviewsCount = newReviews.length;

      await this.updateProduct(product);
    }
  }

  // --- Orders ---
  async createOrder(order: Order): Promise<Order> {
    await delay(800);
    const ordersStr = localStorage.getItem(KEYS.ORDERS);
    const orders: Order[] = ordersStr ? JSON.parse(ordersStr) : [];
    
    const newOrders = [order, ...orders];
    localStorage.setItem(KEYS.ORDERS, JSON.stringify(newOrders));
    
    this.triggerEvent('db-orders-changed');
    return order;
  }

  async getOrders(): Promise<Order[]> {
    await delay(300);
    const data = localStorage.getItem(KEYS.ORDERS);
    return data ? JSON.parse(data) : [];
  }

  async getVendorStats(vendorId: string) {
    const orders = await this.getOrders();
    
    // In a real DB, we'd query items.vendorId. Here we filter locally.
    // Calculate last 7 days stats
    const stats = [
      { name: 'Mon', sales: 0, revenue: 0 },
      { name: 'Tue', sales: 0, revenue: 0 },
      { name: 'Wed', sales: 0, revenue: 0 },
      { name: 'Thu', sales: 0, revenue: 0 },
      { name: 'Fri', sales: 0, revenue: 0 },
      { name: 'Sat', sales: 0, revenue: 0 },
      { name: 'Sun', sales: 0, revenue: 0 },
    ];

    orders.forEach(order => {
      order.items.forEach(item => {
        if (item.vendorId === vendorId) {
          // Simplified: randomly assign to a day for demo purposes based on ID hash
          // In reality, use order.date
          const dayIndex = (order.id.charCodeAt(order.id.length - 1)) % 7;
          stats[dayIndex].sales += item.quantity;
          stats[dayIndex].revenue += item.price * item.quantity;
        }
      });
    });

    return stats;
  }

  // --- Users ---
  async updateUser(user: User): Promise<User> {
    await delay(400);
    localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(user));
    // Also update in the user list if we were tracking a list of all users
    const users = await this.getAllUsers();
    const index = users.findIndex(u => u.id === user.id);
    if(index !== -1) {
        users[index] = user;
    } else {
        users.push(user);
    }
    localStorage.setItem(KEYS.USERS, JSON.stringify(users));
    this.triggerEvent('db-users-changed');
    return user;
  }

  async getAllUsers(): Promise<User[]> {
      await delay(300);
      const data = localStorage.getItem(KEYS.USERS);
      // Ensure we include the current mock user or logged in user if not in list
      const currentUserStr = localStorage.getItem(KEYS.CURRENT_USER);
      let users: User[] = data ? JSON.parse(data) : [];
      
      if (currentUserStr) {
          const currentUser = JSON.parse(currentUserStr);
          if (!users.find(u => u.id === currentUser.id)) {
              users.push(currentUser);
          }
      }
      return users;
  }

  async getUser(userId: string): Promise<User | undefined> {
    const users = await this.getAllUsers();
    // Also check MOCK_USER just in case
    if (MOCK_USER.id === userId) return MOCK_USER;
    return users.find(u => u.id === userId);
  }

  async deleteUser(userId: string): Promise<void> {
      await delay(300);
      const users = await this.getAllUsers();
      
      // Check if user is a vendor before deleting
      const userToDelete = users.find(u => u.id === userId);
      
      const newUsers = users.filter(u => u.id !== userId);
      localStorage.setItem(KEYS.USERS, JSON.stringify(newUsers));
      
      // Cascading delete: If vendor, delete all their products
      if (userToDelete?.role === UserRole.VENDOR) {
          const products = await this.getProducts();
          const newProducts = products.filter(p => p.vendorId !== userId);
          localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(newProducts));
          this.triggerEvent('db-products-changed');
      }

      this.triggerEvent('db-users-changed');
  }

  // --- Password Reset Simulation ---
  async requestPasswordReset(email: string): Promise<string> {
    await delay(1200);
    // In a real app, verify email exists here. 
    // For demo, we accept any email format.
    return "123456"; // Mock code
  }

  async resetPassword(token: string, newPass: string): Promise<void> {
    await delay(1200);
    if (token !== "123456") {
      throw new Error("Invalid reset code");
    }
    // In a real app, hash and save password here
  }

  // --- Events ---
  private triggerEvent(eventName: string) {
    window.dispatchEvent(new Event(eventName));
  }
}

export const db = new DatabaseService();