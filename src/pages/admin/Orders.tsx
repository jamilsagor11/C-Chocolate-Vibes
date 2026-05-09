import { useEffect, useState } from 'react';
import { orderService, Order } from '../../services/orderService';
import { formatPrice, cn } from '../../lib/utils';
import { Loader2, Package, CheckCircle2, Truck, Clock, XCircle, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchOrders = async () => {
    const data = await orderService.getOrders();
    setOrders(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 3000);
    return () => clearInterval(interval);
  }, []);

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      await orderService.updateStatus(id, newStatus);
      fetchOrders();
    } catch (error) {
       console.error('Update status error:', error);
    }
  };

  const filteredOrders = orders.filter(o => 
    o.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.customerEmail.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4 text-amber-500" />;
      case 'processing': return <Package className="w-4 h-4 text-blue-500" />;
      case 'shipped': return <Truck className="w-4 h-4 text-purple-500" />;
      case 'delivered': return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case 'cancelled': return <XCircle className="w-4 h-4 text-red-500" />;
      default: return null;
    }
  };

  if (loading) {
     return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Loader2 className="w-8 h-8 animate-spin text-amber-600" />
        <p className="text-neutral-500 font-bold uppercase tracking-widest text-[10px]">Loading Orders...</p>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-serif font-bold text-white leading-tight">Customer <span className="text-amber-500 italic">Orders</span></h2>
          <p className="text-stone-500 text-[10px] font-black uppercase tracking-[0.2em] mt-1">Monitor the pulse of distributions</p>
        </div>
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-600 group-focus-within:text-amber-500 transition-colors" />
          <input 
            placeholder="Trace by name or email..."
            className="pl-12 pr-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] focus:outline-none focus:border-amber-500/50 focus:bg-white/10 transition-all w-full md:w-80 text-white placeholder:text-stone-600 shadow-xl"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-6 pb-20">
        {filteredOrders.length === 0 && (
          <div className="text-center py-32 backdrop-blur-3xl bg-black/40 rounded-[3rem] border border-dashed border-white/10">
             <div className="w-20 h-20 bg-stone-900/50 backdrop-blur-xl border border-white/5 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl">
                <Package className="w-10 h-10 text-stone-700" />
             </div>
             <p className="text-stone-500 font-serif italic text-2xl mb-2">No active traces found</p>
             <p className="text-stone-600 font-black uppercase tracking-[0.4em] text-[10px]">Awaiting new acquisitions</p>
          </div>
        )}

        <AnimatePresence mode="popLayout">
          {filteredOrders.map((order) => (
            <motion.div 
              key={order.id}
              layout
              initial={{ opacity: 0, scale: 0.98, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="backdrop-blur-2xl bg-white/5 border border-white/10 rounded-[2.5rem] p-10 shadow-2xl hover:bg-white/[0.08] transition-all relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/5 blur-[80px] rounded-full pointer-events-none" />
              
              <div className="flex flex-col lg:flex-row justify-between gap-10 relative">
                <div className="flex-1 space-y-8">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-3xl font-serif font-bold text-white group-hover:text-amber-500 transition-colors mb-2">{order.customerName}</h3>
                      <p className="text-[10px] text-stone-500 font-black uppercase tracking-[0.3em]">{order.customerEmail}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[9px] font-black text-stone-600 uppercase tracking-[0.4em] mb-2">Acquisition Value</p>
                      <p className="text-3xl font-mono font-bold text-amber-100 italic tracking-tighter">{formatPrice(order.totalAmount)}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="backdrop-blur-xl bg-black/40 p-5 rounded-2xl border border-white/10">
                      <p className="text-[8px] font-black text-stone-600 uppercase tracking-[0.3em] mb-2">Communication</p>
                      <p className="text-sm font-black text-stone-300 uppercase tracking-[0.1em]">{order.phone}</p>
                    </div>
                    <div className="backdrop-blur-xl bg-black/40 p-5 rounded-2xl border border-white/10">
                      <p className="text-[8px] font-black text-stone-600 uppercase tracking-[0.3em] mb-2">Distribution Point</p>
                      <p className="text-sm font-medium text-stone-300 line-clamp-1 italic">"{order.address}"</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3 pt-4">
                    {order.items.map((item, i) => (
                      <span key={i} className="text-[9px] bg-white/5 text-stone-300 px-4 py-2 rounded-full font-black uppercase tracking-[0.2em] border border-white/10 backdrop-blur-xl">
                        {item.quantity}x <span className="text-amber-500 italic lowercase">{item.name}</span>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="lg:w-64 space-y-6">
                  <div className="backdrop-blur-3xl bg-black/40 p-8 rounded-[2rem] border border-white/10 shadow-2xl">
                    <label className="text-[9px] font-black text-stone-600 uppercase tracking-[0.4em] block mb-4">Transmission State</label>
                    <select 
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-[10px] font-black uppercase tracking-[0.2em] text-white focus:outline-none focus:border-amber-500/50 appearance-none cursor-pointer transition-all mb-4 text-center"
                      value={order.status}
                      onChange={(e) => updateStatus(order.id, e.target.value)}
                    >
                      <option value="pending" className="bg-stone-900">Pending</option>
                      <option value="processing" className="bg-stone-900">Processing</option>
                      <option value="shipped" className="bg-stone-900">Shipped</option>
                      <option value="delivered" className="bg-stone-900">Delivered</option>
                      <option value="cancelled" className="bg-stone-900">Cancelled</option>
                    </select>

                    <div className="flex items-center justify-center gap-3 px-4 py-3 bg-white/5 rounded-xl border border-white/5">
                      {getStatusIcon(order.status)}
                      <span className="text-[9px] font-black uppercase tracking-[0.3em] text-stone-300">{order.status}</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
