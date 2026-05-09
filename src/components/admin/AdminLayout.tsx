import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Box, ShoppingCart, ArrowLeft, Shield } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { cn } from '../../lib/utils';

export function AdminLayout() {
  const { isAdmin, loading } = useAuth();
  const location = useLocation();

  if (loading) return <div>Loading access...</div>;
  if (!isAdmin) return (
    <div className="flex flex-col items-center justify-center p-20 backdrop-blur-3xl bg-black/40 rounded-[3rem] border border-dashed border-red-900/30 text-center max-w-2xl mx-auto">
       <div className="w-16 h-16 bg-red-900/20 rounded-full flex items-center justify-center mb-6">
         <Shield className="w-8 h-8 text-red-500" />
       </div>
       <h2 className="text-3xl font-serif font-bold text-white mb-4 tracking-tight">Access Restricted</h2>
       <p className="text-stone-400 font-medium mb-8 leading-relaxed">
         The Admin Portal is a restricted area. Please enable Admin Mode in the navigation bar or use the authorized admin bypass.
       </p>
       <div className="flex flex-col sm:flex-row gap-4">
         <button 
           onClick={() => window.location.reload()} 
           className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest transition-all"
         >
           Try Again
         </button>
         <Link to="/" className="px-8 py-4 bg-amber-600 hover:bg-amber-500 text-black rounded-full text-[10px] font-black uppercase tracking-widest transition-all">
           Back to Store
         </Link>
       </div>
    </div>
  );

  const links = [
    { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/admin/inventory', icon: Box, label: 'Inventory' },
    { to: '/admin/orders', icon: ShoppingCart, label: 'Orders' },
  ];

  return (
    <div className="flex flex-col md:flex-row gap-10">
      <aside className="w-full md:w-72 flex flex-col gap-6">
        <div className="backdrop-blur-2xl bg-black/40 rounded-[2.5rem] border border-white/10 p-8 flex flex-col shadow-2xl overflow-hidden">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-lg font-bold flex items-center gap-2 uppercase tracking-[0.2em] text-amber-500">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
              Admin <span className="text-stone-100">Portal</span>
            </h2>
            <span className="text-[9px] text-stone-600 font-black uppercase tracking-widest">v.2.4</span>
          </div>

          <nav className="space-y-3">
            {links.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={cn(
                    "flex items-center gap-4 px-5 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all border",
                    isActive 
                      ? "bg-amber-600 text-black border-amber-600 shadow-xl shadow-amber-600/20" 
                      : "text-stone-500 border-white/5 hover:bg-white/5 hover:text-stone-100 hover:border-white/10"
                  )}
                >
                  <Icon className={cn("w-4 h-4", isActive ? "stroke-[3px]" : "")} />
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="mt-12 pt-8 border-t border-white/5 space-y-4">
             <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                <span className="text-[9px] text-stone-600 uppercase tracking-widest block mb-2 font-black">Auth Integrity</span>
                <p className="text-[10px] font-bold text-green-500 uppercase tracking-tighter">Verified Official</p>
             </div>
          </div>
        </div>
        
        <Link to="/" className="inline-flex items-center justify-center gap-3 py-4 text-[10px] font-black text-stone-600 hover:text-amber-500 uppercase tracking-[0.3em] transition-colors bg-white/5 rounded-2xl border border-white/5">
          <ArrowLeft className="w-4 h-4" /> Storefront
        </Link>
      </aside>

      <main className="flex-1 backdrop-blur-2xl bg-black/30 p-10 rounded-[3rem] border border-white/10 shadow-xl min-h-[700px]">
        <Outlet />
      </main>
    </div>
  );
}
