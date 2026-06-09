import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { useWishlist } from '../context/WishlistContext.jsx';

export default function TopBar({ query, onSearch, onCartClick }) {
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 bg-gradient-to-br from-gray-600 to-gray-800 rounded-lg flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
            <i className="fas fa-gift text-white text-sm"></i>
          </div>
          <span className="text-xl font-bold text-gray-800 tracking-tight">GiftHaven</span>
        </Link>

        <div className="flex items-center gap-3 sm:gap-5">
          <div className="hidden sm:flex items-center gap-2">
            <div className="relative">
              <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
              <input
                type="text"
                value={query}
                onChange={e => onSearch(e.target.value)}
                placeholder="Search gifts..."
                className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm w-48 lg:w-64 focus:outline-none focus:ring-2 focus:ring-gray-400/50 focus:border-gray-400 transition-all bg-gray-50/50"
              />
            </div>
          </div>
          <button
            onClick={() => onSearch(query)}
            className="hidden sm:flex items-center justify-center w-9 h-9 bg-gradient-to-r from-gray-600 to-gray-800 text-white rounded-lg hover:from-gray-700 hover:to-gray-900 transition-all cursor-pointer"
          >
            <i className="fas fa-search text-sm"></i>
          </button>

          <Link
            to="/wishlist"
            className="relative flex items-center justify-center w-9 h-9 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <i className="fas fa-heart"></i>
            {wishlistCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 shadow-sm">
                {wishlistCount}
              </span>
            )}
          </Link>

          <button
            onClick={onCartClick}
            className="relative flex items-center justify-center w-9 h-9 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer"
          >
            <i className="fas fa-shopping-cart"></i>
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-gray-700 text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 shadow-sm">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
      <div className="sm:hidden px-4 pb-3">
        <div className="relative">
          <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
          <input
            type="text"
            value={query}
            onChange={e => onSearch(e.target.value)}
            placeholder="Search gifts..."
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-400/50 focus:border-gray-400 transition-all bg-gray-50/50"
          />
        </div>
      </div>
    </header>
  );
}
