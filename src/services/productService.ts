import { Product, INITIAL_PRODUCTS } from '../constants';
import { localDb } from '../lib/localDb';

export const productService = {
  async getProducts(): Promise<Product[]> {
    const products = localDb.getProducts();
    // Auto-seed if truly empty and first time
    if (products.length === 0) {
      await this.seedInitialData();
      return localDb.getProducts();
    }
    return products;
  },

  async getProductById(id: string): Promise<Product | null> {
    const products = localDb.getProducts();
    return products.find(p => p.id === id) || null;
  },

  async seedInitialData(): Promise<void> {
    const products = localDb.getProducts();
    if (products.length === 0) {
      for (const p of INITIAL_PRODUCTS) {
        localDb.addProduct({ ...p, createdAt: new Date().toISOString() });
      }
    }
  },

  async addProduct(product: Omit<Product, 'id'>): Promise<string> {
    const newProduct = localDb.addProduct(product);
    return newProduct.id;
  },

  async updateProduct(id: string, product: Partial<Product>): Promise<void> {
    localDb.updateProduct(id, product);
  },

  async deleteProduct(id: string): Promise<void> {
    localDb.deleteProduct(id);
  },

  async resetAndSeed(): Promise<void> {
    localDb.resetProducts();
    await this.seedInitialData();
  }
};
