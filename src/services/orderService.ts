
import { localDb } from '../lib/localDb';

export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  address: string;
  phone: string;
  totalAmount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
  items: any[];
}

export const orderService = {
  getOrders(): Order[] {
    return localDb.getOrders();
  },

  createOrder(order: Omit<Order, 'id' | 'createdAt'>): Order {
    return localDb.addOrder({ ...order, status: 'pending' });
  },

  updateStatus(id: string, status: string) {
    localDb.updateOrderStatus(id, status);
  }
};
