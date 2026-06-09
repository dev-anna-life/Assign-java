export default function StarRating({ rating = 0, size = 'sm', showCount, reviewCount }) {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    const fill = rating >= i ? 'full' : rating >= i - 0.5 ? 'half' : 'empty';
    stars.push(
      <span key={i} className={`text-${size === 'sm' ? 'xs' : 'sm'} ${fill === 'full' ? 'text-amber-400' : fill === 'half' ? 'text-amber-400' : 'text-gray-200'}`}>
        {fill === 'full' ? '★' : fill === 'half' ? '★' : '☆'}
      </span>
    );
  }
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center">{stars}</div>
      <span className="text-xs text-gray-400">{rating.toFixed(1)}</span>
      {showCount && <span className="text-xs text-gray-300">({reviewCount})</span>}
    </div>
  );
}
