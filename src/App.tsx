/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { Home } from './pages/Home';
import { ProductDetails } from './pages/ProductDetails';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { AdminLayout } from './components/admin/AdminLayout';
import { AdminDashboard } from './pages/admin/Dashboard';
import { AdminInventory } from './pages/admin/Inventory';
import { AdminOrders } from './pages/admin/Orders';
import { Login } from './pages/Login';
import { Toaster } from './components/ui/Toaster';
import { Checkout } from './pages/Checkout';

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="min-h-screen bg-[#1a0f0a] text-stone-100 font-sans selection:bg-amber-500/30 relative overflow-x-hidden">
            {/* Ambient Background Gradients */}
            <div className="fixed inset-0 opacity-40 pointer-events-none z-0" 
                 style={{ background: 'radial-gradient(circle at 20% 30%, #4a2c1d 0%, transparent 40%), radial-gradient(circle at 80% 70%, #2d1806 0%, transparent 50%), radial-gradient(circle at 50% 50%, #5d3a24 0%, transparent 70%)' }} 
            />
            
            <Navbar />
            <main className="container mx-auto px-4 py-8 relative z-10">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/product/:id" element={<ProductDetails />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/login" element={<Login />} />
                
                {/* Admin Routes */}
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<Navigate to="/admin/dashboard" replace />} />
                  <Route path="dashboard" element={<AdminDashboard />} />
                  <Route path="inventory" element={<AdminInventory />} />
                  <Route path="orders" element={<AdminOrders />} />
                </Route>
              </Routes>
            </main>
            <Toaster />
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

