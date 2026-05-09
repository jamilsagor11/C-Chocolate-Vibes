import { Link } from 'react-router-dom';
import { Plus, Info } from 'lucide-react';
import { Product } from '../../constants';
import { formatPrice } from '../../lib/utils';
import { useCart } from '../../context/CartContext';
import { motion } from 'motion/react';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="group backdrop-blur-xl bg-white/5 rounded-3xl overflow-hidden border border-white/10 shadow-sm hover:shadow-2xl hover:bg-white/10 transition-all duration-500"
    >
      <div className="aspect-[4/5] overflow-hidden relative">
        <img 
          src={product.imageUrl} 
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
        
        <div className="absolute top-4 right-4 flex flex-col gap-2 translate-x-16 group-hover:translate-x-0 transition-transform duration-500 ease-out">
           <button 
            onClick={() => addToCart(product)}
            className="p-3 bg-amber-600 text-black rounded-full shadow-xl hover:bg-amber-500 active:scale-90 transition-all"
            title="Add to Cart"
          >
            <Plus className="w-5 h-5 stroke-[3px]" />
          </button>
          <Link 
            to={`/product/${product.id}`}
            className="p-3 bg-white/10 backdrop-blur-md text-white border border-white/20 rounded-full shadow-xl hover:bg-white/20 active:scale-90 transition-all"
            title="View Details"
          >
            <Info className="w-5 h-5" />
          </Link>
        </div>

        {product.stock <= 5 && product.stock > 0 && (
          <div className="absolute bottom-4 left-4">
            <span className="bg-amber-500/20 backdrop-blur-md text-amber-400 text-[9px] font-black px-2 py-1 rounded uppercase tracking-[0.2em] border border-amber-500/30">
              Only {product.stock} left
            </span>
          </div>
        )}
        
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
            <span className="bg-white/10 border border-white/20 text-white text-[10px] font-black px-4 py-2 rounded-full uppercase tracking-[0.3em]">
              Sold Out
            </span>
          </div>
        )}
      </div>

      <div className="p-6">
        <div className="flex justify-between items-start mb-3">
          <p className="text-[10px] font-black text-amber-500 uppercase tracking-[0.2em]">{product.category}</p>
          <span className="text-lg font-mono font-bold text-amber-100">{formatPrice(product.price)}</span>
        </div>
        <h3 className="text-lg font-semibold text-stone-100 line-clamp-1 group-hover:text-amber-100 transition-colors">
          {product.name}
        </h3>
        <p className="text-xs text-stone-400 mt-2 line-clamp-2 leading-relaxed font-medium">
          {product.description}
        </p>
      </div>
    </motion.div>
  );
}
