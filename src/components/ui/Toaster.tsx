import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle, AlertCircle, X } from 'lucide-react';
import { cn } from '../../lib/utils';

interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error';
}

let toastCount = 0;
let addToastFn: ((message: string, type: 'success' | 'error') => void) | null = null;

export const toast = (message: string, type: 'success' | 'error' = 'success') => {
  if (addToastFn) addToastFn(message, type);
};

export function Toaster() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    addToastFn = (message, type) => {
      const id = ++toastCount;
      setToasts(prev => [...prev, { id, message, type }]);
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id));
      }, 3000);
    };
    return () => { addToastFn = null; };
  }, []);

  return (
    <div className="fixed bottom-8 right-8 z-[100] flex flex-col gap-4">
      <AnimatePresence>
        {toasts.map(t => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, x: 40, scale: 0.9, blur: 10 }}
            animate={{ opacity: 1, x: 0, scale: 1, blur: 0 }}
            exit={{ opacity: 0, scale: 0.9, x: 20, transition: { duration: 0.2 } }}
            className={cn(
              "flex items-center gap-4 px-6 py-4 rounded-[1.5rem] shadow-2xl border backdrop-blur-3xl min-w-[300px] relative overflow-hidden",
              t.type === 'success' 
                ? "bg-black/60 border-amber-500/20 shadow-amber-900/40" 
                : "bg-black/60 border-red-500/20 shadow-red-900/40"
            )}
          >
            {/* Ambient glow inside toast */}
            <div className={cn(
              "absolute top-0 right-0 w-16 h-16 blur-2xl rounded-full opacity-20 pointer-events-none",
              t.type === 'success' ? "bg-amber-500" : "bg-red-500"
            )} />

            {t.type === 'success' ? (
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-amber-500" />
              </div>
            ) : (
              <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-red-500" />
              </div>
            )}
            
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-500 mb-0.5">Notification</span>
              <span className="text-sm font-bold text-stone-100">{t.message}</span>
            </div>

            <button 
              onClick={() => setToasts(prev => prev.filter(toast => toast.id !== t.id))}
              className="ml-auto p-2 text-stone-600 hover:text-stone-300 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
