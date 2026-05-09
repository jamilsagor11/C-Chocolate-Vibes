import React, { useEffect, useState } from 'react';
import { Product } from '../../constants';
import { productService } from '../../services/productService';
import { formatPrice, cn } from '../../lib/utils';
import { Plus, Pencil, Trash2, Loader2, Save, X, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export function AdminInventory() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const [formData, setFormData] = useState<Omit<Product, 'id'>>({
    name: '',
    description: '',
    price: 0,
    imageUrl: '',
    category: 'Bars',
    stock: 0
  });

  const fetch = async () => {
    setLoading(true);
    try {
      const data = await productService.getProducts();
      setProducts(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetch();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingId) {
        await productService.updateProduct(editingId, formData);
      } else {
        await productService.addProduct({...formData, createdAt: new Date().toISOString()});
      }
      setIsAdding(false);
      setEditingId(null);
      await fetch();
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    setLoading(true);
    try {
      await productService.deleteProduct(id);
      await fetch();
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (p: Product) => {
    setEditingId(p.id);
    setFormData({
      name: p.name,
      description: p.description,
      price: p.price,
      imageUrl: p.imageUrl,
      category: p.category,
      stock: p.stock
    });
    setIsAdding(true);
  };

  const resetForm = () => {
    setIsAdding(false);
    setEditingId(null);
    setFormData({
      name: '',
      description: '',
      price: 0,
      imageUrl: '',
      category: 'Bars',
      stock: 0
    });
  };

  const [seeding, setSeeding] = useState(false);

  const handleSeed = async () => {
    setSeeding(true);
    try {
      await productService.seedInitialData();
      const data = await productService.getProducts();
      setProducts(data);
    } finally {
      setSeeding(false);
    }
  };

  return (
    <div className="space-y-12">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-serif font-bold text-white leading-tight">Product <span className="text-amber-500 italic">Inventory</span></h2>
          <p className="text-stone-500 text-[10px] font-black uppercase tracking-[0.2em] mt-1">Manage your artisanal collection</p>
        </div>
        <div className="flex gap-4">
          {products.length === 0 && (
            <button 
              onClick={handleSeed}
              disabled={seeding}
              className="bg-white/5 backdrop-blur-xl border border-white/10 text-stone-400 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-3 hover:bg-white/10 transition-all active:scale-95 disabled:opacity-50"
            >
              {seeding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              Seed Data
            </button>
          )}
          <button 
            onClick={() => { setIsAdding(true); setEditingId(null); }}
            className="bg-amber-600 text-black px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-3 hover:bg-amber-500 transition-all shadow-xl shadow-amber-900/40 active:scale-95 group"
          >
            <Plus className="w-4 h-4 stroke-[3px] group-hover:rotate-90 transition-transform" /> Add Product
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isAdding && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <form onSubmit={handleSave} className="backdrop-blur-2xl bg-black/40 p-10 rounded-[2.5rem] border border-white/10 space-y-8 mb-12 shadow-2xl relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-transparent to-transparent pointer-events-none" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-stone-500 uppercase tracking-[0.3em] ml-4">Name</label>
                  <input 
                    required
                    placeholder="E.g. Dark Sea Salt"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-amber-500/50 transition-colors placeholder:text-stone-600"
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-stone-500 uppercase tracking-[0.3em] ml-4">Price (TK)</label>
                  <input 
                    required
                    placeholder="0.00"
                    type="number"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-amber-500/50 transition-colors placeholder:text-stone-600 font-mono"
                    value={formData.price || ''}
                    onChange={e => setFormData({...formData, price: Number(e.target.value)})}
                  />
                </div>
                <div className="space-y-2 col-span-1 md:col-span-2">
                  <label className="text-[10px] font-black text-stone-500 uppercase tracking-[0.3em] ml-4">Image URL</label>
                  <input 
                    required
                    placeholder="https://images.unsplash.com/..."
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-amber-500/50 transition-colors placeholder:text-stone-600"
                    value={formData.imageUrl}
                    onChange={e => setFormData({...formData, imageUrl: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-stone-500 uppercase tracking-[0.3em] ml-4">Category</label>
                  <select 
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-amber-500/50 transition-colors appearance-none cursor-pointer"
                    value={formData.category}
                    onChange={e => setFormData({...formData, category: e.target.value})}
                  >
                    <option value="Bars" className="bg-stone-900">Bars</option>
                    <option value="Mini" className="bg-stone-900">Mini</option>
                    <option value="Boxes" className="bg-stone-900">Boxes</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-stone-500 uppercase tracking-[0.3em] ml-4">Inventory Level</label>
                  <input 
                    required
                    placeholder="Stock count"
                    type="number"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-amber-500/50 transition-colors placeholder:text-stone-600"
                    value={formData.stock || ''}
                    onChange={e => setFormData({...formData, stock: Number(e.target.value)})}
                  />
                </div>
              </div>
              <div className="space-y-2 relative">
                <label className="text-[10px] font-black text-stone-500 uppercase tracking-[0.3em] ml-4">Narrative Description</label>
                <textarea 
                  required
                  placeholder="Describe the sensory experience..."
                  className="w-full bg-white/5 border border-white/10 rounded-[2rem] px-6 py-4 text-white focus:outline-none focus:border-amber-500/50 transition-colors h-32 placeholder:text-stone-600 leading-relaxed"
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                />
              </div>
              <div className="flex justify-end gap-6 pt-4 relative">
                <button 
                  type="button" 
                  onClick={resetForm}
                  className="px-6 py-2 text-[10px] font-black uppercase tracking-[0.3em] text-stone-500 hover:text-stone-300 transition-colors"
                >Abort</button>
                <button 
                  type="submit"
                  disabled={loading}
                  className="bg-white/10 backdrop-blur-xl border border-white/10 text-white px-10 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-3 hover:bg-white/20 disabled:opacity-50 transition-all shadow-2xl"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {editingId ? 'Push Update' : 'Initialize Product'}
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 gap-6 pb-20">
        {products.map((p) => (
          <motion.div 
            key={p.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-8 p-6 backdrop-blur-2xl bg-white/5 rounded-[2rem] border border-white/10 hover:bg-white/[0.08] transition-all group relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 blur-[40px] rounded-full pointer-events-none" />
            
            <div className="w-24 h-24 flex-shrink-0 rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
              <img src={p.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="font-serif text-2xl font-bold text-white group-hover:text-amber-500 transition-colors">{p.name}</h3>
                <span className="text-[8px] bg-amber-500/20 text-amber-500 px-3 py-1 rounded-full font-black uppercase tracking-[0.2em] border border-amber-500/30">{p.category}</span>
              </div>
              <div className="flex items-center gap-8">
                <div className="flex flex-col">
                  <span className="text-[8px] font-black uppercase tracking-[0.2em] text-stone-600 mb-1">Valuation</span>
                  <span className="text-lg font-mono font-bold text-stone-100 italic">{formatPrice(p.price)}</span>
                </div>
                <div className="flex flex-col">
                   <span className="text-[8px] font-black uppercase tracking-[0.2em] text-stone-600 mb-1">Availability</span>
                   <span className={cn(
                     "text-sm font-black uppercase tracking-[0.1em]",
                     p.stock < 10 ? "text-red-500" : "text-stone-400"
                   )}>
                    {p.stock} Units
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
               <button 
                onClick={() => startEdit(p)}
                className="w-12 h-12 flex items-center justify-center backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl text-stone-400 hover:text-amber-500 hover:bg-white/10 transition-all shadow-xl"
              >
                <Pencil className="w-5 h-5" />
              </button>
              <button 
                onClick={() => handleDelete(p.id)}
                className="w-12 h-12 flex items-center justify-center backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl text-stone-400 hover:text-red-500 hover:bg-white/10 transition-all shadow-xl"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
