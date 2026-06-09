import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import { useToast } from '../context/ToastContext.jsx';

export default function WishlistPage() {
  const { wishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { addToast } = useToast();

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-gray-50 to-neutral-100">
      <div className="max-w-5xl mx-auto px-4 py-8 sm:py-12">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-6 transition-colors">
          <i className="fas fa-arrow-left"></i> Back to store
        </Link>

        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-gradient-to-br from-gray-600 to-gray-800 rounded-xl flex items-center justify-center">
            <i className="fas fa-heart text-white text-sm"></i>
          </div>
          <h1 className="text-2xl font-bold text-gray-800">My Wishlist</h1>
          <span className="text-sm text-gray-400">({wishlist.length} items)</span>
        </div>

        {wishlist.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-heart text-2xl text-gray-300"></i>
            </div>
            <p className="text-gray-600 font-medium mb-1">Your wishlist is empty</p>
            <p className="text-gray-400 text-sm mb-6">Save items you love by tapping the heart icon</p>
            <Link to="/" className="inline-flex items-center gap-2 px-6 py-2.5 bg-gray-800 text-white font-medium rounded-lg hover:bg-gray-700 transition-colors text-sm">
              Browse Gifts
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
            {wishlist.map((item, idx) => (
              <div key={item.id} className="bg-white rounded-xl border border-gray-100/50 overflow-hidden group animate-fade-in" style={{ animationDelay: `${Math.min(idx * 80, 600)}ms`, animationFillMode: 'both' }}>
                <div className="relative aspect-[3/4] bg-gray-50">
                  <img src={item.image} alt={item.name} className="w-full h-full object-contain p-4" />
                  <button
                    onClick={() => { toggleWishlist(item); addToast('Removed from wishlist'); }}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-all shadow-sm cursor-pointer"
                  >
                    <i className="fas fa-heart text-sm text-rose-500"></i>
                  </button>
                </div>
                <div className="p-4">
                  <h3 className="text-sm font-semibold text-gray-800 mb-1 truncate">{item.name}</h3>
                  <p className="text-lg font-bold text-gray-700 mb-3">${item.price}</p>
                  <button
                    onClick={() => { addToCart(item); addToast(`${item.name} added to cart`); }}
                    className="w-full py-2 bg-gradient-to-r from-gray-600 to-gray-800 text-white text-sm font-semibold rounded-lg cursor-pointer hover:from-gray-700 hover:to-gray-900 active:scale-[0.97] transition-all flex items-center justify-center gap-2"
                  >
                    <i className="fas fa-cart-plus text-xs"></i> Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
