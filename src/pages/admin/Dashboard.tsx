import { useEffect, useState } from 'react';
import { productService } from '../../services/productService';
import { orderService, Order } from '../../services/orderService';
import { formatPrice, cn } from '../../lib/utils';
import { TrendingUp, ShoppingBag, AlertCircle, BarChart3, Clock, RotateCcw } from 'lucide-react';
import { motion } from 'motion/react';

export function AdminDashboard() {
  const [stats, setStats] = useState({
    totalSales: 0,
    orderCount: 0,
    lowStock: 0,
    pendingOrders: 0
  });
  const [loading, setLoading] = useState(true);
  const [resetting, setResetting] = useState(false);

  const fetchStats = async () => {
    setLoading(true);
    const orders = await orderService.getOrders();
    const products = await productService.getProducts();

    setStats({
      totalSales: orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0),
      orderCount: orders.length,
      lowStock: products.filter(p => p.stock < 10).length,
      pendingOrders: orders.filter(o => o.status === 'pending').length
    });
    setLoading(false);
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleReset = async () => {
    if (!confirm('This will reset the entire product catalog to its default state. Orders will remain. Continue?')) return;
    setResetting(true);
    await productService.resetAndSeed();
    await fetchStats();
    setResetting(false);
  };

  const cards = [
    { label: 'Total Sales', value: formatPrice(stats.totalSales), icon: TrendingUp, color: 'text-amber-500', glow: 'shadow-amber-500/20' },
    { label: 'Orders', value: stats.orderCount, icon: ShoppingBag, color: 'text-stone-300', glow: 'shadow-stone-500/10' },
    { label: 'Low Stock', value: stats.lowStock, icon: AlertCircle, color: 'text-red-500', glow: 'shadow-red-500/20' },
    { label: 'Pending', value: stats.pendingOrders, icon: Clock, color: 'text-amber-200', glow: 'shadow-amber-200/20' },
  ];

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
      <div className="w-12 h-12 border-4 border-amber-500/20 border-t-amber-500 rounded-full animate-spin" />
      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-stone-500">Decrypting Analytics...</p>
    </div>
  );

  return (
    <div className="space-y-12">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-amber-500/10 backdrop-blur-xl border border-amber-500/20 rounded-2xl flex items-center justify-center shadow-xl shadow-amber-900/40">
           <BarChart3 className="w-6 h-6 text-amber-500" />
        </div>
        <div>
          <h2 className="text-3xl font-serif font-bold text-white leading-tight">Analytics <span className="text-amber-500 italic">Overview</span></h2>
          <p className="text-stone-500 text-[10px] font-black uppercase tracking-[0.2em] mt-1">Real-time performance metrics</p>
        </div>
        <div className="ml-auto flex gap-4">
           <button 
             onClick={handleReset}
             disabled={resetting}
             className="px-6 py-2.5 bg-white/5 hover:bg-white/10 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/10 text-stone-400 hover:text-stone-100 transition-all flex items-center gap-2 disabled:opacity-50"
           >
             <RotateCcw className={cn("w-3 h-3", resetting && "animate-spin")} />
             {resetting ? 'Resetting Catalog...' : 'Reset Default Catalog'}
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {cards.map((card, i) => {
          const Icon = card.icon;
          return (
            <motion.div 
              key={card.label}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className="p-8 backdrop-blur-2xl bg-white/5 rounded-[2rem] border border-white/10 shadow-2xl relative overflow-hidden group hover:bg-white/[0.07] transition-colors"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 blur-[50px] rounded-full pointer-events-none" />
              <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mb-8 bg-black/40 border border-white/5 shadow-2xl", card.glow)}>
                <Icon className={cn("w-7 h-7", card.color)} />
              </div>
              <p className="text-[10px] font-black text-stone-500 uppercase tracking-[0.2em] mb-2">{card.label}</p>
              <h3 className="text-3xl font-mono font-bold text-stone-100 tracking-tighter">{card.value}</h3>
            </motion.div>
          );
        })}
      </div>

      <div className="backdrop-blur-3xl bg-black/40 rounded-[3rem] p-16 border border-white/10 flex flex-col items-center justify-center text-center relative overflow-hidden">
         <div className="absolute inset-0 bg-gradient-to-b from-amber-500/5 to-transparent pointer-events-none" />
         <div className="w-20 h-20 bg-stone-900/50 backdrop-blur-xl border border-white/5 rounded-3xl flex items-center justify-center mb-8 shadow-2xl">
            <TrendingUp className="w-10 h-10 text-stone-700" />
         </div>
         <h3 className="font-serif text-3xl font-bold text-stone-400 mb-4 italic">Visualizing <span className="text-stone-500 not-italic uppercase text-xs font-black tracking-[0.3em] ml-2 font-sans">Growth Patterns</span></h3>
         <p className="text-stone-600 text-[10px] font-black uppercase tracking-[0.4em] max-w-sm leading-relaxed">
            Data streams are being processed. Advance visualization models will activate once transaction thresholds are reached.
         </p>
      </div>
    </div>
  );
}
