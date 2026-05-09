
const STORAGE_KEY = 'chocolate_vibes_db';

interface DbState {
  products: any[];
  orders: any[];
  user: any | null;
}

const getInitialState = (): DbState => ({
  products: [],
  orders: [],
  user: null
});

export const localDb = {
  get(): DbState {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : getInitialState();
  },

  save(state: DbState) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  },

  // Products
  getProducts() {
    return this.get().products;
  },

  saveProducts(products: any[]) {
    const state = this.get();
    state.products = products;
    this.save(state);
  },

  addProduct(product: any) {
    const state = this.get();
    const newProduct = { ...product, id: Math.random().toString(36).substr(2, 9) };
    state.products.push(newProduct);
    this.save(state);
    return newProduct;
  },

  updateProduct(id: string, updates: any) {
    const state = this.get();
    state.products = state.products.map(p => p.id === id ? { ...p, ...updates } : p);
    this.save(state);
  },

  deleteProduct(id: string) {
    const state = this.get();
    state.products = state.products.filter(p => p.id !== id);
    this.save(state);
  },

  resetProducts() {
    const state = this.get();
    state.products = [];
    this.save(state);
  },

  // Orders
  getOrders() {
    return this.get().orders;
  },

  addOrder(order: any) {
    const state = this.get();
    const newOrder = { 
      ...order, 
      id: `ORD-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    state.orders.push(newOrder);
    this.save(state);
    return newOrder;
  },

  updateOrderStatus(id: string, status: string) {
    const state = this.get();
    state.orders = state.orders.map(o => o.id === id ? { ...o, status } : o);
    this.save(state);
  },

  // Admin Bypass
  setAdminMode(enabled: boolean) {
    localStorage.setItem('admin_mode', enabled ? 'true' : 'false');
  },

  isAdminMode() {
    return localStorage.getItem('admin_mode') === 'true';
  }
};
