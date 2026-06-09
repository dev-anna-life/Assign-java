import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Admin() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadOrders = () => {
    setLoading(true);
    fetch('http://localhost:3001/api/orders')
      .then(res => res.json())
      .then(data => setOrders(data))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  };

  useEffect(loadOrders, []);

  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-gray-50 to-neutral-100">
      <div className="max-w-6xl mx-auto px-4 py-8 sm:py-12">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-6 transition-colors">
          <i className="fas fa-arrow-left"></i> Back to store
        </Link>

        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-gray-600 to-gray-800 rounded-xl flex items-center justify-center">
              <i className="fas fa-cog text-white text-sm"></i>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
              <p className="text-sm text-gray-400">Orders are saved to <code className="text-xs bg-gray-100 px-1.5 py-0.5 rounded">orders.json</code></p>
            </div>
          </div>
          <button onClick={loadOrders} className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer">
            <i className="fas fa-sync-alt text-xs"></i> Refresh
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Total Orders</p>
            <p className="text-2xl font-bold text-gray-800">{orders.length}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Revenue</p>
            <p className="text-2xl font-bold text-gray-800">${totalRevenue.toFixed(2)}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Items Sold</p>
            <p className="text-2xl font-bold text-gray-800">{orders.reduce((s, o) => s + o.items.reduce((si, i) => si + i.qty, 0), 0)}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-bold text-gray-700 flex items-center gap-2">
              <i className="fas fa-truck text-gray-400 text-sm"></i> Orders
            </h2>
          </div>

          {loading ? (
            <div className="text-center py-16">
              <i className="fas fa-spinner fa-spin text-2xl text-gray-300"></i>
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <i className="fas fa-box-open text-xl text-gray-300"></i>
              </div>
              <p className="text-gray-500 font-medium">No orders yet</p>
              <p className="text-gray-400 text-sm mt-1">Orders will appear here after customers check out</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {[...orders].reverse().map(order => (
                <div key={order.id} className="px-6 py-5 hover:bg-gray-50/50 transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <span className="text-xs font-mono text-gray-400 bg-gray-50 rounded px-2 py-1">#{order.id.slice(0, 8)}</span>
                      <span className="text-xs text-gray-400 ml-3">{new Date(order.createdAt).toLocaleString()}</span>
                    </div>
                    <span className="text-sm font-bold text-gray-700">${order.total.toFixed(2)}</span>
                  </div>
                  <div className="text-sm text-gray-600 mb-2">
                    <span className="font-medium">{order.customer.name}</span> &middot; {order.customer.email}
                  </div>
                  <div className="text-xs text-gray-400 mb-2">{order.customer.address}</div>
                  {order.coupon && <div className="text-xs text-green-600 mb-1">Coupon: {order.coupon.code} ({order.coupon.discount}% off)</div>}
                  {order.customer.giftMessage && <div className="text-xs text-amber-600 mb-1 italic">Gift note: &ldquo;{order.customer.giftMessage}&rdquo;</div>}
                  <div className="flex flex-wrap gap-2">
                    {order.items.map((item, i) => (
                      <span key={i} className="text-xs bg-gray-100 text-gray-600 rounded-full px-2.5 py-1">
                        {item.name} x{item.qty} — ${(item.price * item.qty).toFixed(2)}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-8 bg-amber-50 border border-amber-200 rounded-xl p-5 text-sm text-amber-700">
          <p className="font-medium mb-1"><i className="fas fa-info-circle mr-1"></i> How orders work:</p>
          <ul className="space-y-1 text-amber-600">
            <li>&bull; Orders are saved to <code className="text-xs bg-amber-100 px-1 rounded">server/orders.json</code> immediately</li>
            <li>&bull; They persist after server restarts</li>
            <li>&bull; This dashboard reads from <code className="text-xs bg-amber-100 px-1 rounded">GET /api/orders</code></li>
            <li>&bull; For production, swap the file with a database</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
