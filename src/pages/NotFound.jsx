import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <i className="fas fa-compass text-3xl text-gray-300"></i>
        </div>
        <h1 className="text-6xl font-bold text-gray-800 mb-2">404</h1>
        <p className="text-gray-500 mb-1">Looks like you've wandered off the map.</p>
        <p className="text-sm text-gray-400 mb-8">This page doesn't exist or has been moved.</p>
        <Link to="/" className="inline-flex items-center gap-2 px-6 py-2.5 bg-gray-800 text-white font-medium rounded-lg hover:bg-gray-700 transition-colors text-sm">
          <i className="fas fa-arrow-left text-xs"></i> Back to Store
        </Link>
      </div>
    </div>
  );
}
