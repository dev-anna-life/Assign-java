import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';

export default function CartSidebar({ open, onClose }) {
  const { items, removeFromCart, updateQty, cartTotal, cartCount } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    onClose();
    navigate('/checkout');
  };

  return (
    <>
      {open && <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40" onClick={onClose} />}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-96 bg-white shadow-2xl z-50 flex flex-col transition-transform duration-300 ease-out ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <i className="fas fa-shopping-cart text-gray-500"></i>
            Cart
            {cartCount > 0 && (
              <span className="text-sm font-normal text-gray-400">({cartCount})</span>
            )}
          </h2>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-50 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer text-xl leading-none">&times;</button>
        </div>

        <div className="flex-1 overflow-auto px-5 py-4 space-y-4">
          {items.length === 0 && (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-box-open text-2xl text-gray-300"></i>
              </div>
              <p className="text-gray-600 font-medium">Your cart is empty</p>
              <p className="text-gray-400 text-sm mt-1">Add some gifts to get started</p>
            </div>
          )}
          {items.map(item => (
            <div key={item.id} className="flex gap-3 bg-gray-50/50 rounded-xl p-3 border border-gray-100/50">
              <div className="w-20 h-24 bg-white rounded-lg flex items-center justify-center p-2 flex-shrink-0">
                <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
              </div>
              <div className="flex-1 min-w-0 flex flex-col justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-800 truncate">{item.name}</p>
                  <p className="text-gray-700 font-bold text-sm mt-0.5">${item.price}</p>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <button onClick={() => updateQty(item.id, item.qty - 1)} className="w-7 h-7 rounded-md border border-gray-200 text-sm cursor-pointer hover:bg-gray-100 text-gray-600 font-medium flex items-center justify-center transition-colors">-</button>
                    <span className="text-sm font-semibold text-gray-800 w-6 text-center">{item.qty}</span>
                    <button onClick={() => updateQty(item.id, item.qty + 1)} className="w-7 h-7 rounded-md border border-gray-200 text-sm cursor-pointer hover:bg-gray-100 text-gray-600 font-medium flex items-center justify-center transition-colors">+</button>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-sm text-gray-800">${(item.price * item.qty).toFixed(2)}</p>
                  </div>
                </div>
                <button onClick={() => removeFromCart(item.id)} className="text-[11px] text-gray-400 hover:text-rose-600 cursor-pointer self-end mt-1">Remove</button>
              </div>
            </div>
          ))}
        </div>

        {items.length > 0 && (
          <div className="border-t border-gray-100 px-5 py-4 bg-gray-50/30 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 font-medium">Subtotal</span>
              <span className="text-lg font-bold text-gray-800">${cartTotal.toFixed(2)}</span>
            </div>
            <p className="text-[11px] text-gray-400">Shipping calculated at checkout</p>
            <button
              onClick={handleCheckout}
              className="w-full py-3 bg-gradient-to-r from-gray-600 to-gray-800 text-white font-semibold rounded-lg cursor-pointer hover:from-gray-700 hover:to-gray-900 transition-all active:scale-[0.98]"
            >
              Checkout <i className="fas fa-arrow-right ml-2 text-sm"></i>
            </button>
          </div>
        )}
      </div>
    </>
  );
}
