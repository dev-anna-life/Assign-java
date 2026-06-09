import { useState } from 'react';
import { useCart } from '../context/CartContext.jsx';
import { useWishlist } from '../context/WishlistContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import StarRating from './StarRating.jsx';

export default function ProductCard({ product, index = 0, onViewDetail }) {
  const { addToCart } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const { addToast } = useToast();
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);

  const catColors = {
    'Jewelry': 'bg-pink-100 text-pink-700',
    'Electronics': 'bg-blue-100 text-blue-700',
    'Fashion': 'bg-amber-100 text-amber-700',
    'Gifts': 'bg-emerald-100 text-emerald-700',
  };
  const catColor = catColors[product.category] || 'bg-gray-100 text-gray-700';

  const delay = Math.min((index % 8) * 100, 700);
  const wished = isWishlisted(product.id);
  const onSale = product.originalPrice > 0;
  const discount = onSale ? Math.round((1 - product.price / product.originalPrice) * 100) : 0;
  const lowStock = product.stock > 0 && product.stock <= 5;
  const outOfStock = product.stock === 0;

  const handleAdd = (e) => {
    e.stopPropagation();
    if (outOfStock) return;
    addToCart(product);
    addToast(`${product.name} added to cart`);
  };

  const handleWishlist = (e) => {
    e.stopPropagation();
    toggleWishlist(product);
    addToast(wished ? 'Removed from wishlist' : 'Added to wishlist');
  };

  return (
    <article
      onClick={() => !outOfStock && onViewDetail?.(product)}
      className={`group bg-white rounded-xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-100/50 overflow-hidden flex flex-col animate-fade-in ${outOfStock ? 'opacity-60' : 'cursor-pointer'}`}
      style={{ animationDelay: `${delay}ms`, animationFillMode: 'both' }}
    >
      <div className="relative aspect-[3/4] bg-gray-50 overflow-hidden">
        {!imgLoaded && !imgError && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
            <i className="fas fa-spinner fa-spin text-gray-300 text-2xl"></i>
          </div>
        )}
        {imgError && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <div className="text-center">
              <i className="fas fa-image text-3xl text-gray-300 mb-1 block"></i>
              <span className="text-xs text-gray-400">{product.name}</span>
            </div>
          </div>
        )}
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          onLoad={() => setImgLoaded(true)}
          onError={() => setImgError(true)}
          className={`w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
        />

        <button
          onClick={handleWishlist}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-all shadow-sm cursor-pointer z-10"
        >
          <i className={`fas fa-heart text-sm transition-all ${wished ? 'text-rose-500 scale-110' : 'text-gray-400 hover:text-rose-400'}`}></i>
        </button>

        {outOfStock && (
          <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
            <span className="bg-gray-800 text-white text-xs font-bold px-4 py-1.5 rounded-full">Out of Stock</span>
          </div>
        )}

        {product.badge && !outOfStock && (
          <span className={`absolute top-3 left-3 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm ${
            product.badge === 'New' ? 'bg-blue-500 text-white' : 'bg-amber-500 text-white'
          }`}>
            {product.badge}
          </span>
        )}

        {discount > 0 && !product.badge && !outOfStock && (
          <span className="absolute top-3 left-3 bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
            -{discount}%
          </span>
        )}

        <span className={`absolute bottom-3 left-3 text-[10px] font-semibold px-2 py-1 rounded-full ${catColor}`}>
          {product.category}
        </span>

        {lowStock && !outOfStock && (
          <span className="absolute bottom-3 right-3 text-[10px] font-medium text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">
            Only {product.stock} left
          </span>
        )}
      </div>
      <div className="p-4 flex flex-col flex-1">
        <h3 className="text-sm font-semibold text-gray-800 mb-1 leading-snug line-clamp-2 group-hover:text-gray-900 transition-colors">{product.name}</h3>
        <StarRating rating={product.rating} showCount reviewCount={product.reviewCount} />
        <div className="flex items-baseline gap-2 mb-2 mt-auto">
          <p className="text-lg font-bold text-gray-700">{product.priceFormatted}</p>
          {onSale && (
            <p className="text-xs text-gray-400 line-through">{product.originalPriceFormatted}</p>
          )}
        </div>
        {product.stock > 0 && product.stock <= 10 && (
          <div className="mb-3">
            <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
              <div className={`h-full rounded-full transition-all duration-500 ${lowStock ? 'bg-rose-400' : 'bg-amber-400'}`}
                style={{ width: `${(product.stock / 10) * 100}%` }} />
            </div>
          </div>
        )}
        <button
          onClick={handleAdd}
          disabled={outOfStock}
          className="w-full py-2.5 bg-gradient-to-r from-gray-600 to-gray-800 text-white text-sm font-semibold rounded-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:from-gray-700 hover:to-gray-900 active:scale-[0.95] transition-all duration-200 flex items-center justify-center gap-2 group/btn"
        >
          <i className="fas fa-cart-plus text-xs group-hover/btn:scale-110 transition-transform"></i>
          <span>{outOfStock ? 'Out of Stock' : 'Add to Cart'}</span>
        </button>
      </div>
    </article>
  );
}
