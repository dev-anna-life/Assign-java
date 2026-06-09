import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { useWishlist } from '../context/WishlistContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import TopBar from '../components/TopBar.jsx';
import ProductGrid from '../components/ProductGrid.jsx';
import ProductCard from '../components/ProductCard.jsx';
import SkeletonCard from '../components/SkeletonCard.jsx';
import Footer from '../components/Footer.jsx';

const categories = ['All', 'Electronics', 'Jewelry', 'Fashion', 'Gifts'];
const PAGE_SIZE = 12;

export default function Store({ onCartClick }) {
  const { addToCart } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const { addToast } = useToast();
  const [products, setProducts] = useState([]);
  const [query, setQuery] = useState('');
  const [searchParams] = useSearchParams();
  const [activeCategory, setActiveCategory] = useState(searchParams.get('cat') || 'All');
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState('default');
  const [detailProduct, setDetailProduct] = useState(null);
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [recentlyViewed, setRecentlyViewed] = useState(() => {
    try { const r = localStorage.getItem('recentlyViewed'); return r ? JSON.parse(r) : []; } catch { return []; }
  });

  const handleViewDetail = (product) => {
    addRecentlyViewed(product);
    setDetailProduct(product);
  };

  const addRecentlyViewed = (product) => {
    setRecentlyViewed(prev => {
      const filtered = prev.filter(p => p.id !== product.id);
      const next = [product, ...filtered].slice(0, 8);
      localStorage.setItem('recentlyViewed', JSON.stringify(next));
      return next;
    });
  };

  useEffect(() => {
    fetch('http://localhost:3001/api/products')
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [activeCategory, query, sort]);

  useEffect(() => {
    const onScroll = () => setShowScrollBtn(window.scrollY > 400);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const featured = products.filter(p => p.featured && (activeCategory === 'All' || p.category === activeCategory));

  let filtered = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(query.toLowerCase().trim()) ||
      p.priceFormatted.toLowerCase().includes(query.toLowerCase().trim());
    const matchesCategory = activeCategory === 'All' || p.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  if (sort === 'low') filtered = [...filtered].sort((a, b) => a.price - b.price);
  else if (sort === 'high') filtered = [...filtered].sort((a, b) => b.price - a.price);
  else if (sort === 'name') filtered = [...filtered].sort((a, b) => a.name.localeCompare(b.name));

  const visibleProducts = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  const relatedProducts = detailProduct
    ? products.filter(p => p.category === detailProduct.category && p.id !== detailProduct.id).slice(0, 4)
    : [];

  return (
    <div className="min-h-screen flex flex-col">
      <TopBar query={query} onSearch={setQuery} onCartClick={onCartClick}
        suggestions={query.trim() ? products.filter(p => p.name.toLowerCase().includes(query.toLowerCase())).slice(0, 6) : []}
        onSuggestionClick={(p) => { setQuery(''); handleViewDetail(p); }}
      />

      {/* Hero */}
      <section className="relative bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse" style={{ animationDuration: '4s' }}></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="max-w-2xl">
            <span className="inline-block text-xs font-semibold uppercase tracking-widest text-gray-300 mb-3 animate-fade-in" style={{ animationDelay: '100ms', animationFillMode: 'both' }}>
              Premium Gift Store
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 leading-tight animate-fade-in-up" style={{ animationDelay: '200ms', animationFillMode: 'both' }}>
              Find the <span className="text-gray-200">Perfect Gift</span>
            </h1>
            <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-6 max-w-lg animate-fade-in-up" style={{ animationDelay: '350ms', animationFillMode: 'both' }}>
              Curated collection of thoughtful gifts for everyone you love. From electronics to jewelry, fashion to unique finds.
            </p>
            <div className="flex flex-wrap gap-3 animate-fade-in-up" style={{ animationDelay: '500ms', animationFillMode: 'both' }}>
              <a href="#products" className="inline-flex items-center gap-2 px-6 py-2.5 bg-white text-gray-800 font-semibold rounded-lg hover:bg-gray-100 hover:scale-105 transition-all text-sm">
                Shop Now <i className="fas fa-arrow-right text-xs"></i>
              </a>
              <a href="/about" className="inline-flex items-center gap-2 px-6 py-2.5 border border-gray-400 text-gray-200 font-semibold rounded-lg hover:bg-white/10 hover:scale-105 transition-all text-sm">
                Learn More
              </a>
            </div>
          </div>
        </div>
      </section>

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full" id="products">
        <div className="py-8 sm:py-12">
          {/* Filters row */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div className="flex flex-wrap items-center gap-2">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all cursor-pointer ${
                    activeCategory === cat
                      ? 'bg-gray-800 text-white shadow-md'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-200/50'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <i className="fas fa-sort text-gray-400 text-sm"></i>
              <select
                value={sort}
                onChange={e => setSort(e.target.value)}
                className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-white text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400/50 cursor-pointer"
              >
                <option value="default">Default</option>
                <option value="low">Price: Low to High</option>
                <option value="high">Price: High to Low</option>
                <option value="name">Name: A-Z</option>
              </select>
            </div>
          </div>

          {/* Featured section */}
          {featured.length > 0 && loading === false && query === '' && activeCategory !== 'Gifts' && (
            <section className="mb-10">
              <div className="flex items-center gap-2 mb-4">
                <i className="fas fa-fire text-rose-500 text-sm"></i>
                <h2 className="text-lg font-bold text-gray-800">Trending Now</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
                {featured.slice(0, 4).map((p, idx) => (
                  <ProductCard key={p.id} product={p} index={idx} onViewDetail={handleViewDetail} />
                ))}
              </div>
            </section>
          )}

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 lg:gap-6 mt-6">
              {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-search text-2xl text-gray-300"></i>
              </div>
              <p className="text-gray-500 font-medium">No products found</p>
              <p className="text-gray-400 text-sm mt-1">Try a different search or category</p>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-lg font-bold text-gray-800">All Products</h2>
                <span className="text-xs text-gray-400">{filtered.length} items</span>
              </div>
              <ProductGrid products={visibleProducts} onViewDetail={handleViewDetail} />
              {hasMore && (
                <div className="text-center mt-8">
                  <button
                    onClick={() => setVisibleCount(prev => prev + PAGE_SIZE)}
                    className="px-8 py-2.5 bg-white border border-gray-200 text-gray-600 font-medium rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all cursor-pointer active:scale-[0.97] text-sm"
                  >
                    Load More ({filtered.length - visibleCount} remaining)
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {/* Detail modal */}
      {detailProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setDetailProduct(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-auto">
            <button
              onClick={() => setDetailProduct(null)}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 transition-colors cursor-pointer z-10"
            >
              <i className="fas fa-times text-sm"></i>
            </button>
            <div className="p-6 sm:p-8">
              <div className="aspect-[3/4] bg-gray-50 rounded-xl flex items-center justify-center p-6 mb-5">
                <img src={detailProduct.image} alt={detailProduct.name} className="w-full h-full object-contain max-h-72" />
              </div>

              <div className="flex items-center gap-2 mb-3">
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                  detailProduct.category === 'Jewelry' ? 'bg-pink-100 text-pink-700' :
                  detailProduct.category === 'Electronics' ? 'bg-blue-100 text-blue-700' :
                  detailProduct.category === 'Fashion' ? 'bg-amber-100 text-amber-700' :
                  'bg-emerald-100 text-emerald-700'
                }`}>{detailProduct.category}</span>
                {detailProduct.originalPrice > 0 && (
                  <span className="text-xs font-bold bg-rose-50 text-rose-600 px-2 py-0.5 rounded-full">Sale</span>
                )}
              </div>

              <h2 className="text-xl font-bold text-gray-800 mb-2">{detailProduct.name}</h2>
              <div className="flex items-baseline gap-2 mb-4">
                <p className="text-2xl font-bold text-gray-700">{detailProduct.priceFormatted}</p>
                {detailProduct.originalPrice > 0 && (
                  <p className="text-sm text-gray-400 line-through">{detailProduct.originalPriceFormatted}</p>
                )}
              </div>
              <p className="text-sm text-gray-500 leading-relaxed mb-6">
                A beautifully curated gift item from GiftHaven. Perfect for any occasion, this {detailProduct.category.toLowerCase()} item combines quality craftsmanship with thoughtful design.
              </p>

              <div className="flex gap-2">
                <button
                  onClick={() => { addToCart(detailProduct); addToast(`${detailProduct.name} added to cart`); setDetailProduct(null); }}
                  className="flex-1 py-3 bg-gradient-to-r from-gray-600 to-gray-800 text-white font-semibold rounded-lg cursor-pointer hover:from-gray-700 hover:to-gray-900 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  <i className="fas fa-cart-plus text-sm"></i> Add to Cart
                </button>
                <button
                  onClick={() => { toggleWishlist(detailProduct); addToast(isWishlisted(detailProduct.id) ? 'Removed from wishlist' : 'Added to wishlist'); }}
                  className={`w-12 h-12 rounded-lg border cursor-pointer flex items-center justify-center transition-all active:scale-95 ${
                    isWishlisted(detailProduct.id) ? 'bg-rose-50 border-rose-200 text-rose-500' : 'bg-gray-50 border-gray-200 text-gray-400 hover:bg-gray-100'
                  }`}
                >
                  <i className={`fas fa-heart ${isWishlisted(detailProduct.id) ? 'scale-110' : ''}`}></i>
                </button>
              </div>

              {/* Related products */}
              {relatedProducts.length > 0 && (
                <div className="mt-8 pt-6 border-t border-gray-100">
                  <h3 className="text-sm font-bold text-gray-700 mb-3">More in {detailProduct.category}</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {relatedProducts.map(rp => (
                      <div
                        key={rp.id}
                        onClick={() => handleViewDetail(rp)}
                        className="bg-gray-50 rounded-xl p-3 cursor-pointer hover:bg-gray-100 transition-colors"
                      >
                        <div className="aspect-square bg-white rounded-lg flex items-center justify-center p-2 mb-2">
                          <img src={rp.image} alt={rp.name} className="w-full h-full object-contain" />
                        </div>
                        <p className="text-xs font-medium text-gray-700 truncate">{rp.name}</p>
                        <p className="text-xs font-bold text-gray-600">{rp.priceFormatted}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Recently viewed */}
      {recentlyViewed.length > 0 && query === '' && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pb-4">
          <div className="flex items-center gap-2 mb-4">
            <i className="fas fa-clock-rotate text-gray-400 text-sm"></i>
            <h2 className="text-lg font-bold text-gray-800">Recently Viewed</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
            {recentlyViewed.map((p, idx) => (
              <div
                key={p.id}
                onClick={() => handleViewDetail(p)}
                className="bg-white rounded-xl border border-gray-100/50 p-3 cursor-pointer hover:shadow-md hover:-translate-y-0.5 transition-all animate-fade-in"
                style={{ animationDelay: `${idx * 60}ms`, animationFillMode: 'both' }}
              >
                <div className="aspect-square bg-gray-50 rounded-lg flex items-center justify-center p-2 mb-2">
                  <img src={p.image} alt={p.name} className="w-full h-full object-contain" />
                </div>
                <p className="text-xs font-medium text-gray-700 truncate">{p.name}</p>
                <p className="text-xs font-bold text-gray-600">${p.price}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Scroll to top */}
      {showScrollBtn && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 left-6 z-50 w-10 h-10 bg-gray-800 text-white rounded-full shadow-lg hover:bg-gray-700 transition-colors cursor-pointer flex items-center justify-center"
        >
          <i className="fas fa-arrow-up text-sm"></i>
        </button>
      )}

      <Footer />
    </div>
  );
}
