import { useEffect, useState } from 'react';
import { Product } from '../constants';
import { productService } from '../services/productService';
import { ProductCard } from '../components/shop/ProductCard';
import { motion } from 'motion/react';
import { Loader2, Sparkles, Truck, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await productService.getProducts();
        setProducts(data);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const categories = ['All', ...new Set(products.map(p => p.category))];
  const filteredProducts = selectedCategory === 'All' 
    ? products 
    : products.filter(p => p.category === selectedCategory);

  const scrollToProducts = () => {
    document.getElementById('storefront')?.scrollIntoView({ behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-amber-600" />
        <p className="text-amber-900 font-medium animate-pulse">Brewing the best vibes...</p>
      </div>
    );
  }

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative h-[100vh] -mx-6 flex items-center justify-center overflow-hidden"
      >
        <div className="absolute inset-0">
          <img 
            src="https://artifact.googleusercontent.com/airuntime/6eccf225-b461-460b-800e-6f81c96752c0/hero_chocolate.jpg" 
            className="w-full h-full object-cover opacity-70 scale-105"
            alt="Artisanal Chocolate"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/80" />
        </div>

        <div className="relative z-10 text-center max-w-4xl px-6">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center justify-center gap-3 mb-6"
          >
            <div className="h-px w-8 bg-amber-500/50" />
            <span className="text-amber-500 text-[10px] font-black uppercase tracking-[0.5em]">The Viral Dubai Experience</span>
            <div className="h-px w-8 bg-amber-500/50" />
          </motion.div>
          
          <motion.h1 
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-7xl md:text-9xl font-serif font-bold text-white mb-8 tracking-tighter leading-[0.8] drop-shadow-2xl"
          >
            Dubai <span className="text-amber-500 block italic">Vibes.</span>
          </motion.h1>
          
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-stone-200 max-w-2xl mx-auto mb-12 text-lg md:text-xl font-medium leading-relaxed drop-shadow-lg"
          >
            Indulge in the viral Dubai Pistachio Kunafa chocolate. 
            Handcrafted with 100% pure pistachio and rich Belgian chocolate.
          </motion.p>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6"
          >
            <button 
              onClick={scrollToProducts}
              className="w-full sm:w-auto bg-amber-600 hover:bg-amber-500 text-black px-12 py-5 rounded-full font-black uppercase tracking-widest text-[10px] transition-all shadow-2xl shadow-amber-600/40 active:scale-95"
            >
              Order Now
            </button>
            <Link 
              to="/admin"
              className="w-full sm:w-auto px-12 py-5 rounded-full text-[10px] font-black uppercase tracking-widest text-white border border-white/20 bg-white/5 backdrop-blur-md hover:bg-white/10 transition-all flex items-center justify-center gap-3"
            >
              <Shield className="w-4 h-4" />
              Manage Shop
            </Link>
          </motion.div>
        </div>
      </motion.section>

      {/* Product List */}
      <section id="storefront">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-8">
          <div>
            <h2 className="text-4xl font-serif font-bold text-white tracking-tight">Our Storefront</h2>
            <p className="text-stone-500 mt-2 font-medium">Artisanal treats made with passion and premium ingredients.</p>
          </div>
          <div className="hidden md:block h-px flex-1 bg-white/10 mx-12 mb-5" />
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all ${
                  selectedCategory === cat
                    ? 'bg-amber-600 border-amber-600 text-black shadow-lg shadow-amber-600/20'
                    : 'bg-white/5 border-white/10 text-stone-400 hover:text-white hover:bg-white/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 backdrop-blur-3xl bg-black/40 rounded-[3rem] border border-dashed border-white/10">
            <Sparkles className="w-12 h-12 text-stone-700 mx-auto mb-4" />
            <p className="text-stone-500 font-serif italic text-xl">No treats found in this category.</p>
            <p className="text-stone-600 font-black uppercase tracking-[0.2em] text-[9px] mt-2">Try exploring our other artisanal collections.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                layout
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* Admin Quick Access Section */}
      <section className="mt-32 p-12 rounded-[2.5rem] bg-gradient-to-br from-stone-900 to-black border border-amber-600/20 shadow-2xl shadow-amber-900/10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-xl">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-5 h-5 text-amber-500" />
              <span className="text-amber-500 text-[10px] font-black uppercase tracking-[0.4em]">Store Management</span>
            </div>
            <h2 className="text-3xl font-serif font-bold text-white mb-4">Internal Admin Dashboard</h2>
            <p className="text-stone-400 text-sm leading-relaxed">
              Access the management panel directly to update inventory, process orders, and view site analytics. No Google login required - simple local bypass enabled.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <Link 
              to="/admin" 
              className="px-8 py-4 bg-amber-600 hover:bg-amber-500 text-black rounded-full text-[10px] font-black uppercase tracking-widest transition-all text-center"
            >
              Enter Admin Panel
            </Link>
            <Link 
              to="/admin/orders" 
              className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest transition-all text-center"
            >
              View Orders
            </Link>
          </div>
        </div>
      </section>

      {/* Footer Info */}
      <section className="backdrop-blur-2xl bg-black/40 rounded-[2.5rem] p-16 text-center border border-white/10">
        <div className="w-12 h-12 bg-amber-600/10 rounded-full flex items-center justify-center mx-auto mb-6">
           <Truck className="w-6 h-6 text-amber-500" />
        </div>
        <h3 className="text-2xl font-serif font-bold text-white mb-4">Artisanal Excellence</h3>
        <p className="text-stone-400 max-w-2xl mx-auto text-base leading-relaxed font-medium">
          Every bar is hand-poured and tempered to perfection. We use temperature-controlled packaging to ensure your gourmet chocolates arrive in immaculate condition.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-10 opacity-40">
           <span className="text-[10px] font-black uppercase tracking-[0.4em]">Secure SSL Payment</span>
           <span className="text-[10px] font-black uppercase tracking-[0.4em]">Global Shipping</span>
           <span className="text-[10px] font-black uppercase tracking-[0.4em]">Ethical Sourcing</span>
        </div>
      </section>
    </div>
  );
}
