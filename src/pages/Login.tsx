import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { Sparkles, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';

export function Login() {
  const { user, login } = useAuth();
  const [loggingIn, setLoggingIn] = useState(false);

  if (user) return <Navigate to="/" replace />;

  const handleLogin = async () => {
    setLoggingIn(true);
    try {
      await login();
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setLoggingIn(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full backdrop-blur-2xl bg-black/40 p-12 rounded-[2.5rem] border border-white/10 text-center shadow-2xl overflow-hidden relative"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 via-transparent to-transparent pointer-events-none" />
        
        <div className="w-20 h-20 bg-amber-500/20 backdrop-blur-xl border border-amber-500/30 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-xl shadow-amber-900/40">
           <Sparkles className="w-10 h-10 text-amber-500" />
        </div>
        
        <h1 className="text-4xl font-serif font-bold text-white mb-3">Welcome <span className="text-amber-500 italic">Back</span></h1>
        <p className="text-stone-400 mb-10 font-medium text-sm">Join the vibe and get your premium chocolates delivered.</p>
        
        <button 
          onClick={handleLogin}
          disabled={loggingIn}
          className="w-full flex items-center justify-center gap-4 bg-white/5 backdrop-blur-xl border border-white/10 py-4 rounded-2xl font-black uppercase text-[10px] tracking-[0.3em] text-white hover:bg-white/10 transition-all active:scale-95 shadow-xl group disabled:opacity-50"
        >
          {loggingIn ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5 group-hover:scale-110 transition-transform" />
          )}
          {loggingIn ? 'Authenticating...' : 'Continue with Google'}
        </button>

        <p className="mt-10 text-[9px] text-stone-500 uppercase font-black tracking-[0.3em] leading-loose">
          Secure Authentication powered by <br/> <span className="text-stone-400">Google Firebase</span>
        </p>
      </motion.div>
    </div>
  );
}
