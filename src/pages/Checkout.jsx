import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';

export default function Checkout() {
  const { items, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', address: '' });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(null);

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.email.trim()) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Invalid email';
    if (!form.address.trim()) errs.address = 'Address is required';
    return errs;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) return setErrors(errs);

    setSubmitting(true);
    try {
      const res = await fetch('http://localhost:3001/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items, customer: form }),
      });
      if (!res.ok) throw new Error('Order failed');
      const order = await res.json();
      setSuccess(order);
      clearCart();
    } catch (err) {
      setErrors({ submit: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center p-8 bg-white rounded-2xl shadow-lg border border-gray-100">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
            <i className="fas fa-check text-2xl text-green-500"></i>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Order Placed!</h1>
          <p className="text-gray-500 mb-1">Thank you, {success.customer.name}!</p>
          <p className="text-xs text-gray-400 mb-6 font-mono bg-gray-50 rounded-lg px-3 py-2 inline-block">Order #{success.id.slice(0, 8)}</p>
          <div className="space-y-3">
            <Link to="/" className="block w-full py-3 bg-gradient-to-r from-gray-600 to-gray-800 text-white font-semibold rounded-lg hover:from-gray-700 hover:to-gray-900 transition-all">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-gray-50 to-neutral-100">
      <div className="max-w-5xl mx-auto px-4 py-8 sm:py-12">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-6 transition-colors">
          <i className="fas fa-arrow-left"></i> Back to store
        </Link>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3 bg-white rounded-xl shadow-sm border border-gray-100 p-6 sm:p-8">
            <h1 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <i className="fas fa-truck text-gray-500"></i> Shipping Details
            </h1>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1.5">Full Name</label>
                <input name="name" value={form.name} onChange={handleChange} placeholder="John Doe" className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-400/50 focus:border-gray-400 transition-all bg-gray-50/30" />
                {errors.name && <p className="text-rose-500 text-xs mt-1.5"><i className="fas fa-exclamation-circle mr-1"></i>{errors.name}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1.5">Email</label>
                <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="john@example.com" className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-400/50 focus:border-gray-400 transition-all bg-gray-50/30" />
                {errors.email && <p className="text-rose-500 text-xs mt-1.5"><i className="fas fa-exclamation-circle mr-1"></i>{errors.email}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1.5">Shipping Address</label>
                <textarea name="address" value={form.address} onChange={handleChange} rows={3} placeholder="123 Main St, City, State, ZIP" className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-400/50 focus:border-gray-400 transition-all bg-gray-50/30 resize-none" />
                {errors.address && <p className="text-rose-500 text-xs mt-1.5"><i className="fas fa-exclamation-circle mr-1"></i>{errors.address}</p>}
              </div>
              {errors.submit && <p className="text-rose-500 text-sm bg-rose-50 rounded-lg px-4 py-2">{errors.submit}</p>}
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 bg-gradient-to-r from-gray-600 to-gray-800 text-white font-semibold rounded-lg cursor-pointer disabled:opacity-60 hover:from-gray-700 hover:to-gray-900 transition-all active:scale-[0.98]"
              >
                {submitting ? <><i className="fas fa-spinner fa-spin mr-2"></i>Processing...</> : `Place Order — $${cartTotal.toFixed(2)}`}
              </button>
            </form>
          </div>

          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6 sm:p-8 h-fit lg:sticky lg:top-24">
            <h2 className="text-lg font-bold text-gray-800 mb-5 flex items-center gap-2">
              <i className="fas fa-gift text-gray-500"></i> Order Summary
            </h2>
            {items.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <i className="fas fa-box-open text-gray-300"></i>
                </div>
                <p className="text-gray-500 text-sm">Your cart is empty</p>
              </div>
            ) : (
              <>
                <div className="space-y-4 mb-5">
                  {items.map(item => (
                    <div key={item.id} className="flex gap-3 pb-4 border-b border-gray-50 last:border-0">
                      <div className="w-14 h-16 bg-gray-50 rounded-lg flex items-center justify-center p-2 flex-shrink-0">
                        <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800 truncate">{item.name}</p>
                        <p className="text-xs text-gray-400 mt-0.5">Qty: {item.qty}</p>
                        <p className="text-sm font-bold text-gray-700 mt-1">${(item.price * item.qty).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="border-t border-gray-100 pt-4 space-y-2">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Subtotal</span>
                    <span>${cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Shipping</span>
                    <span className="text-green-600">Free</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold text-gray-800 pt-2 border-t border-gray-100">
                    <span>Total</span>
                    <span className="text-gray-700">${cartTotal.toFixed(2)}</span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
