import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { productService } from '../services/productService';
import { Product } from '../constants';
import { formatPrice } from '../lib/utils';
import { useCart } from '../context/CartContext';
import { ShoppingCart, ArrowLeft, Loader2, Star, ShieldCheck, Truck } from 'lucide-react';
import { motion } from 'motion/react';

export function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetch = async () => {
      if (!id) return;
      try {
        const data = await productService.getProductById(id);
        setProduct(data);
      } catch (error) {
        console.error('Fetch product error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin" /></div>;
  if (!product) return <div>Product not found</div>;

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-20">
      <Link to="/" className="inline-flex items-center gap-3 text-stone-500 hover:text-amber-500 transition-colors group">
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span className="text-[10px] font-black uppercase tracking-[0.3em]">Back to Storefront</span>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="aspect-square rounded-[3rem] overflow-hidden border border-white/10 shadow-2xl relative"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          <img src={product.imageUrl} className="w-full h-full object-cover" />
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col justify-center"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="flex text-amber-500">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
            </div>
            <span className="text-[10px] font-black text-stone-500 uppercase tracking-widest">48 Handcrafted batches</span>
          </div>

          <h1 className="text-5xl lg:text-7xl font-serif font-bold text-white mb-4 leading-tight">
            {product.name.split(' ').map((word, i) => i % 2 !== 0 ? <span key={i} className="text-amber-500 italic block lg:inline"> {word}</span> : word + ' ')}
          </h1>
          <p className="text-amber-500/80 font-black uppercase tracking-[0.4em] text-xs mb-8">{product.category}</p>
          
          <div className="text-4xl font-mono font-bold text-amber-100 mb-10 tracking-tighter">{formatPrice(product.price)}</div>

          <p className="text-stone-400 leading-relaxed mb-12 text-lg font-medium">
            {product.description}
          </p>

          <div className="grid grid-cols-2 gap-6 mb-12">
            <div className="p-5 backdrop-blur-xl bg-white/5 rounded-3xl border border-white/10 flex items-center gap-4 group hover:bg-white/10 transition-colors">
               <ShieldCheck className="w-6 h-6 text-amber-500" />
               <span className="text-[10px] font-black uppercase tracking-widest text-stone-300">Handmade Quality</span>
            </div>
            <div className="p-5 backdrop-blur-xl bg-white/5 rounded-3xl border border-white/10 flex items-center gap-4 group hover:bg-white/10 transition-colors">
               <Truck className="w-6 h-6 text-amber-500" />
               <span className="text-[10px] font-black uppercase tracking-widest text-stone-300">Express Delivery</span>
            </div>
          </div>

          <button 
            disabled={product.stock === 0}
            onClick={() => addToCart(product)}
            className="w-full bg-amber-600 text-black py-6 rounded-3xl font-black uppercase tracking-[0.2em] text-sm hover:bg-amber-500 transition-all shadow-2xl shadow-amber-600/20 active:scale-95 flex items-center justify-center gap-4 disabled:opacity-50"
          >
            {product.stock > 0 ? (
              <>
                <ShoppingCart className="w-6 h-6 stroke-[3px]" />
                Add to Cart
              </>
            ) : 'Waitlist Only'}
          </button>
        </motion.div>
      </div>
    </div>
  );
}
