export default function SkeletonCard() {
  return (
    <div className="bg-white rounded-xl border border-gray-100/50 overflow-hidden animate-pulse">
      <div className="aspect-[3/4] bg-gray-100" />
      <div className="p-4 space-y-3">
        <div className="h-3 bg-gray-100 rounded w-3/4" />
        <div className="h-5 bg-gray-100 rounded w-1/3" />
        <div className="h-9 bg-gray-100 rounded-lg" />
      </div>
    </div>
  );
}
