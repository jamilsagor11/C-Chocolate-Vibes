import { Link } from 'react-router-dom';
import { ShoppingCart, User, LogOut, Settings, Shield } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { cn } from '../../lib/utils';

export function Navbar() {
  const { totalItems } = useCart();
  const { user, isAdmin, logout, login, toggleAdminMode } = useAuth();

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-black/20 border-b border-white/10">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="text-xl font-semibold tracking-tight text-amber-100 flex items-center gap-3">
          <div className="w-8 h-8 bg-amber-600 rounded-full flex items-center justify-center text-black font-bold text-sm">C</div>
          <span>Chocolate <span className="text-amber-500">Vibes</span></span>
        </Link>

        <div className="flex items-center gap-8">
          <Link to="/" className="text-xs uppercase tracking-widest font-medium text-stone-400 hover:text-white transition-colors">Storefront</Link>
          
          <button 
            onClick={toggleAdminMode}
            className={cn(
              "px-4 py-1.5 border rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 transition-all",
              isAdmin 
                ? "bg-amber-600/20 border-amber-600/50 text-amber-500 shadow-lg shadow-amber-600/10" 
                : "bg-white/5 border-white/10 text-stone-500 hover:text-stone-300"
            )}
          >
            <Shield className="w-3 h-3" />
            {isAdmin ? "Admin: ON" : "Admin Panel"}
          </button>

          {isAdmin && (
            <Link to="/admin" className="p-2 rounded-xl bg-amber-600 text-black shadow-lg shadow-amber-600/20 hover:scale-105 transition-transform">
              <Settings className="w-4 h-4" />
            </Link>
          )}

          <Link to="/checkout" className="relative group p-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
            <ShoppingCart className="w-5 h-5 text-stone-300 group-hover:text-amber-400 transition-colors" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-amber-600 text-black text-[9px] font-black w-4 h-4 flex items-center justify-center rounded-full">
                {totalItems}
              </span>
            )}
          </Link>

          <div className="h-4 w-px bg-white/10" />

          {user ? (
            <div className="flex items-center gap-3">
              <div className="flex flex-col items-end">
                <span className="text-[10px] uppercase tracking-tighter font-bold text-stone-300">{user.displayName?.split(' ')[0]}</span>
                <button 
                  onClick={logout} 
                  className="text-[9px] text-stone-500 hover:text-amber-500 transition-colors uppercase tracking-widest font-black"
                >
                  Logout
                </button>
              </div>
              <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                <User className="w-4 h-4 text-stone-400" />
              </div>
            </div>
          ) : (
            <button 
              onClick={login}
              className="text-xs font-bold bg-amber-600 hover:bg-amber-500 text-black px-6 py-2 rounded-full transition-all shadow-lg shadow-amber-600/20 active:scale-95"
            >
              SIGN IN
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
