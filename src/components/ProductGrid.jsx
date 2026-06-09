import ProductCard from './ProductCard.jsx';

export default function ProductGrid({ products, onViewDetail }) {
  if (products.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-5">
          <i className="fas fa-search text-3xl text-gray-300"></i>
        </div>
        <p className="text-gray-700 text-lg font-medium mb-1">No gifts found</p>
        <p className="text-gray-400 text-sm">Try a different search term</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 lg:gap-6 mt-6">
      {products.map((p, idx) => (
        <ProductCard key={p.id} product={p} index={idx} onViewDetail={onViewDetail} />
      ))}
    </div>
  );
}
