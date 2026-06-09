import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext.jsx';
import { ToastProvider } from './context/ToastContext.jsx';
import { WishlistProvider } from './context/WishlistContext.jsx';
import CartSidebar from './components/CartSidebar.jsx';
import Store from './pages/Store.jsx';
import Checkout from './pages/Checkout.jsx';
import InfoPage from './pages/InfoPage.jsx';
import WishlistPage from './pages/WishlistPage.jsx';
import Admin from './pages/Admin.jsx';
import NotFound from './pages/NotFound.jsx';

function App() {
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <CartProvider>
      <WishlistProvider>
        <ToastProvider>
          <div className="min-h-screen bg-gradient-to-br from-stone-50 via-gray-50 to-neutral-100">
            <Routes>
              <Route path="/" element={<Store onCartClick={() => setCartOpen(true)} />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/wishlist" element={<WishlistPage />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/about" element={<InfoPage pageKey="about" />} />
              <Route path="/contact" element={<InfoPage pageKey="contact" />} />
              <Route path="/shipping" element={<InfoPage pageKey="shipping" />} />
              <Route path="/returns" element={<InfoPage pageKey="returns" />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
          <CartSidebar open={cartOpen} onClose={() => setCartOpen(false)} />
        </ToastProvider>
      </WishlistProvider>
    </CartProvider>
  );
}

export default App;
