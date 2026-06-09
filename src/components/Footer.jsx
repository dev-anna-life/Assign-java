import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useToast } from '../context/ToastContext.jsx';

export default function Footer() {
  const [email, setEmail] = useState('');
  const { addToast } = useToast();

  const handleSubscribe = () => {
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      addToast('Please enter a valid email', 'error');
      return;
    }
    addToast('Subscribed! Welcome to GiftHaven.');
    setEmail('');
  };

  return (
    <footer className="mt-16 bg-white/60 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-8 mb-8">
          <div className="sm:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 bg-gradient-to-br from-gray-600 to-gray-800 rounded-md flex items-center justify-center">
                <i className="fas fa-gift text-white text-xs"></i>
              </div>
              <span className="font-bold text-gray-800">GiftHaven</span>
            </Link>
            <p className="text-sm text-gray-500 leading-relaxed">Curated gifts for every occasion. Fast shipping, easy returns.</p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-3">Quick Links</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><Link to="/about" className="hover:text-gray-700 transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-gray-700 transition-colors">Contact</Link></li>
              <li><Link to="/shipping" className="hover:text-gray-700 transition-colors">Shipping Info</Link></li>
              <li><Link to="/returns" className="hover:text-gray-700 transition-colors">Returns</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-3">Categories</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><Link to="/?cat=Electronics" className="hover:text-gray-700 transition-colors">Electronics</Link></li>
              <li><Link to="/?cat=Jewelry" className="hover:text-gray-700 transition-colors">Jewelry</Link></li>
              <li><Link to="/?cat=Fashion" className="hover:text-gray-700 transition-colors">Fashion</Link></li>
              <li><Link to="/?cat=Gifts" className="hover:text-gray-700 transition-colors">Gifts</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-3">Newsletter</h4>
            <p className="text-sm text-gray-500 mb-3">Get updates on new arrivals and exclusive offers.</p>
            <div className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSubscribe()}
                placeholder="Your email"
                className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-400/50 bg-gray-50/50"
              />
              <button
                onClick={handleSubscribe}
                className="px-4 py-2 bg-gray-800 text-white text-sm font-semibold rounded-lg cursor-pointer hover:bg-gray-700 transition-colors whitespace-nowrap active:scale-95"
              >
                Subscribe
              </button>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-100 pt-6 text-center">
          <p className="text-xs text-gray-400">&copy; 2025 GiftHaven. Designed by DevAnna. All rights reserved.</p>
          <Link to="/admin" className="text-[10px] text-gray-300 hover:text-gray-500 transition-colors mt-2 inline-block">
            <i className="fas fa-shield-alt mr-1"></i> Admin
          </Link>
        </div>
      </div>
    </footer>
  );
}
