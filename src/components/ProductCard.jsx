import { useState } from 'react';
import { useCart } from '../context/CartContext.jsx';
import { useToast } from '../context/ToastContext.jsx';

export default function ProductCard({ product, index = 0, onViewDetail }) {
  const { addToCart } = useCart();
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

  const handleAdd = (e) => {
    e.stopPropagation();
    addToCart(product);
    addToast(`${product.name} added to cart`);
  };

  return (
    <article
      onClick={() => onViewDetail?.(product)}
      className={`group bg-white rounded-xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-100/50 overflow-hidden flex flex-col cursor-pointer animate-fade-in`}
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
        <span className={`absolute top-3 left-3 text-[10px] font-semibold px-2 py-1 rounded-full ${catColor}`}>
          {product.category}
        </span>
      </div>
      <div className="p-4 flex flex-col flex-1">
        <h3 className="text-sm font-semibold text-gray-800 mb-1 leading-snug line-clamp-2 group-hover:text-gray-900 transition-colors">{product.name}</h3>
        <p className="text-lg font-bold text-gray-700 mb-3 mt-auto">{product.priceFormatted}</p>
        <button
          onClick={handleAdd}
          className="w-full py-2.5 bg-gradient-to-r from-gray-600 to-gray-800 text-white text-sm font-semibold rounded-lg cursor-pointer hover:from-gray-700 hover:to-gray-900 active:scale-[0.95] transition-all duration-200 flex items-center justify-center gap-2 group/btn"
        >
          <i className="fas fa-cart-plus text-xs group-hover/btn:scale-110 transition-transform"></i>
          <span>Add to Cart</span>
        </button>
      </div>
    </article>
  );
}
