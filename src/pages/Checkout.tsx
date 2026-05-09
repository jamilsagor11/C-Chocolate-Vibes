import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../lib/utils';
import { Trash2, ShoppingBag, ArrowLeft, Loader2, CreditCard, ShieldCheck } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { orderService } from '../services/orderService';

export function Checkout() {
  const { items, totalPrice, updateQuantity, removeFromCart, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    phone: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;
    
    setLoading(true);
    try {
      const orderData = {
        customerName: formData.name,
        customerEmail: formData.email,
        address: formData.address,
        phone: formData.phone,
        items: items.map(i => ({
          productId: i.id,
          name: i.name,
          quantity: i.quantity,
          price: i.price
        })),
        totalAmount: totalPrice,
        status: 'pending',
      };

      await orderService.createOrder(orderData as any);
      setSuccess(true);
      clearCart();
    } catch (error) {
       console.error('Order creation error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-md mx-auto text-center py-20 animate-in fade-in zoom-in duration-500">
        <div className="w-24 h-24 backdrop-blur-2xl bg-amber-600/10 text-amber-500 border border-amber-500/20 rounded-[2rem] flex items-center justify-center mx-auto mb-8">
          <ShoppingBag className="w-12 h-12" />
        </div>
        <h2 className="text-4xl font-serif font-bold text-white mb-4">Batch Reserved!</h2>
        <p className="text-stone-400 mb-10 font-medium">Thank you for choosing Chocolate Vibes. We've started tempering your gourmet order.</p>
        <button 
          onClick={() => navigate('/')}
          className="bg-amber-600 text-black px-10 py-4 rounded-full font-black uppercase tracking-widest text-xs hover:bg-amber-500 transition-all shadow-xl shadow-amber-600/20"
        >
          Return to Storefront
        </button>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-md mx-auto text-center py-32">
        <h2 className="text-3xl font-serif font-bold text-white mb-4 italic">Empty Collections</h2>
        <p className="text-stone-500 mb-10 font-medium">Your shopping bag is currently awaiting its first truffle.</p>
        <Link to="/" className="inline-flex items-center gap-3 text-amber-500 font-black uppercase tracking-[0.2em] text-[10px] hover:text-amber-400 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Start Browsing
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 pb-20">
      {/* Items Section */}
      <div className="space-y-10">
        <div className="flex items-end justify-between border-b border-white/10 pb-6">
          <h2 className="text-3xl font-serif font-bold text-white">Your Selections</h2>
          <span className="text-[10px] font-black text-stone-500 uppercase tracking-widest">{items.length} Units</span>
        </div>

        <div className="space-y-6">
          <AnimatePresence mode='popLayout'>
            {items.map((item) => (
              <motion.div 
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex gap-6 p-6 backdrop-blur-xl bg-white/5 rounded-3xl border border-white/10 group hover:bg-white/10 transition-all"
              >
                <img src={item.imageUrl} className="w-24 h-24 object-cover rounded-2xl shadow-lg group-hover:scale-105 transition-transform" />
                <div className="flex-1 space-y-1">
                  <h3 className="font-bold text-lg text-white">{item.name}</h3>
                  <p className="text-amber-500 font-mono font-bold">{formatPrice(item.price)}</p>
                  <div className="flex items-center gap-6 pt-4">
                    <div className="flex items-center backdrop-blur-md bg-white/5 rounded-xl border border-white/10 overflow-hidden">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-1 px-4 text-stone-400 hover:text-white hover:bg-white/10 transition-colors"
                      >-</button>
                      <span className="px-4 text-xs font-black text-white">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-1 px-4 text-stone-400 hover:text-white hover:bg-white/10 transition-colors"
                      >+</button>
                    </div>
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="text-stone-600 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="font-mono font-bold text-amber-100 text-lg">
                  {formatPrice(item.price * item.quantity)}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Checkout Form */}
      <div className="backdrop-blur-3xl bg-black/40 p-10 rounded-[2.5rem] border border-white/10 h-fit sticky top-24 shadow-2xl">
        <h2 className="text-2xl font-serif font-bold text-white mb-8">Completion</h2>
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-stone-500 mb-1">Customer Name</label>
              <input 
                required
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:bg-white/10 transition-all font-medium"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                placeholder="Gourmet Enthusiast"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-stone-500 mb-1">Email Delivery</label>
              <input 
                required
                type="email"
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:bg-white/10 transition-all font-medium"
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
                placeholder="connoisseur@vibes.com"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="space-y-2">
                <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-stone-500 mb-1">Handset</label>
                <input 
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:bg-white/10 transition-all font-medium"
                  value={formData.phone}
                  onChange={e => setFormData({...formData, phone: e.target.value})}
                  placeholder="+880"
                />
              </div>
               <div className="space-y-2">
                <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-stone-500 mb-1">Shipping Vault</label>
                <input 
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:bg-white/10 transition-all font-medium"
                  value={formData.address}
                  onChange={e => setFormData({...formData, address: e.target.value})}
                  placeholder="Street, City"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-8 border-t border-white/10">
            <div className="flex justify-between text-stone-400 font-medium">
              <span className="text-xs uppercase tracking-widest">Subtotal</span>
              <span className="font-mono">{formatPrice(totalPrice)}</span>
            </div>
            <div className="flex justify-between text-stone-400 font-medium pb-2">
              <span className="text-xs uppercase tracking-widest">Tempered Transit</span>
              <span className="text-amber-500 font-black italic tracking-widest text-[10px]">INCLUDED</span>
            </div>
            <div className="flex justify-between text-3xl font-mono font-bold text-white border-t border-white/10 pt-6">
              <span className="text-xl font-serif italic">Total</span>
              <span>{formatPrice(totalPrice)}</span>
            </div>
          </div>
          
          <div className="bg-amber-500/5 p-5 rounded-2xl border border-dashed border-amber-500/20 flex gap-4 items-center">
             <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5 text-amber-500" />
             </div>
             <p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest leading-relaxed">
               Encrypted checkout process powered by <span className="text-amber-500">Stripe Verified</span>
             </p>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-amber-600 text-black py-5 rounded-2xl font-black uppercase tracking-[0.3em] text-xs hover:bg-amber-500 transition-all shadow-2xl shadow-amber-600/30 active:scale-95 disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-3"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><CreditCard className="w-5 h-5 stroke-[3px]" /> Confirm Order</>}
          </button>
        </form>
      </div>
    </div>
  );
}
