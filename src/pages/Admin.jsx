import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Admin() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:3001/api/orders')
      .then(res => res.json())
      .then(data => setOrders(data))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-gray-50 to-neutral-100">
      <div className="max-w-6xl mx-auto px-4 py-8 sm:py-12">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-6 transition-colors">
          <i className="fas fa-arrow-left"></i> Back to store
        </Link>

        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-gradient-to-br from-gray-600 to-gray-800 rounded-xl flex items-center justify-center">
            <i className="fas fa-cog text-white text-sm"></i>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
            <p className="text-sm text-gray-400">Manage orders and products</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-bold text-gray-700 flex items-center gap-2">
              <i className="fas fa-truck text-gray-400 text-sm"></i> Orders
            </h2>
            <span className="text-xs text-gray-400">{orders.length} total</span>
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
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {orders.map(order => (
                <div key={order.id} className="px-6 py-5 hover:bg-gray-50/50 transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <span className="text-xs font-mono text-gray-400 bg-gray-50 rounded px-2 py-1">#{order.id.slice(0, 8)}</span>
                      <span className="text-xs text-gray-400 ml-3">{new Date(order.createdAt).toLocaleDateString()}</span>
                    </div>
                    <span className="text-sm font-bold text-gray-700">${order.total.toFixed(2)}</span>
                  </div>
                  <div className="text-sm text-gray-600 mb-2">
                    <span className="font-medium">{order.customer.name}</span> &middot; {order.customer.email}
                  </div>
                  <div className="text-xs text-gray-400 mb-2">{order.customer.address}</div>
                  <div className="flex flex-wrap gap-2">
                    {order.items.map((item, i) => (
                      <span key={i} className="text-xs bg-gray-100 text-gray-600 rounded-full px-2.5 py-1">
                        {item.name} x{item.qty}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
