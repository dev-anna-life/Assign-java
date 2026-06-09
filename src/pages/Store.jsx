import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import TopBar from '../components/TopBar.jsx';
import ProductGrid from '../components/ProductGrid.jsx';
import Footer from '../components/Footer.jsx';

const categories = ['All', 'Electronics', 'Jewelry', 'Fashion', 'Gifts'];

export default function Store({ onCartClick }) {
  const { addToCart } = useCart();
  const { addToast } = useToast();
  const [products, setProducts] = useState([]);
  const [query, setQuery] = useState('');
  const [searchParams] = useSearchParams();
  const [activeCategory, setActiveCategory] = useState(searchParams.get('cat') || 'All');
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState('default');
  const [detailProduct, setDetailProduct] = useState(null);
  const [showScrollBtn, setShowScrollBtn] = useState(false);

  useEffect(() => {
    fetch('http://localhost:3001/api/products')
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const onScroll = () => setShowScrollBtn(window.scrollY > 400);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  let filtered = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(query.toLowerCase().trim()) ||
      p.priceFormatted.toLowerCase().includes(query.toLowerCase().trim());
    const matchesCategory = activeCategory === 'All' || p.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  if (sort === 'low') filtered = [...filtered].sort((a, b) => a.price - b.price);
  else if (sort === 'high') filtered = [...filtered].sort((a, b) => b.price - a.price);
  else if (sort === 'name') filtered = [...filtered].sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="min-h-screen flex flex-col">
      <TopBar query={query} onSearch={setQuery} onCartClick={onCartClick} />

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
                Shop Now <i className="fas fa-arrow-right text-xs group-hover:translate-x-1 transition-transform"></i>
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

          {loading ? (
            <div className="text-center py-20">
              <i className="fas fa-spinner fa-spin text-3xl text-gray-300"></i>
              <p className="text-gray-500 mt-3">Loading gifts...</p>
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
            <ProductGrid products={filtered} onViewDetail={setDetailProduct} />
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
              <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                detailProduct.category === 'Jewelry' ? 'bg-pink-100 text-pink-700' :
                detailProduct.category === 'Electronics' ? 'bg-blue-100 text-blue-700' :
                detailProduct.category === 'Fashion' ? 'bg-amber-100 text-amber-700' :
                'bg-emerald-100 text-emerald-700'
              }`}>{detailProduct.category}</span>
              <h2 className="text-xl font-bold text-gray-800 mt-3 mb-2">{detailProduct.name}</h2>
              <p className="text-2xl font-bold text-gray-700 mb-4">{detailProduct.priceFormatted}</p>
              <p className="text-sm text-gray-500 leading-relaxed mb-6">
                A beautifully curated gift item from GiftHaven. Perfect for any occasion, this {detailProduct.category.toLowerCase()} item combines quality craftsmanship with thoughtful design.
              </p>
              <button
                onClick={() => { addToCart(detailProduct); addToast(`${detailProduct.name} added to cart`); setDetailProduct(null); }}
                className="w-full py-3 bg-gradient-to-r from-gray-600 to-gray-800 text-white font-semibold rounded-lg cursor-pointer hover:from-gray-700 hover:to-gray-900 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
              >
                <i className="fas fa-cart-plus text-sm"></i> Add to Cart
              </button>
            </div>
          </div>
        </div>
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
