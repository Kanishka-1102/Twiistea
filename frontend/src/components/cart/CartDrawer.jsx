import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import useCartStore from '../../store/cartStore';
import useAuthStore from '../../store/authStore';

function CartItem({ item }) {
  const { updateQuantity, removeItem } = useCartStore();
  const price = item.discountPrice || item.price;
  return (
    <div className="flex gap-3 py-4 border-b border-[#F5F1EA] last:border-0">
      <div className="w-16 h-16 rounded-xl overflow-hidden bg-[#F5F1EA] flex-shrink-0">
        {item.images?.[0]?.url
          ? <img src={item.images[0].url} alt={item.name} className="w-full h-full object-cover" />
          : <div className="w-full h-full flex items-center justify-center text-2xl">🍵</div>
        }
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-[#1a1a1a] truncate leading-snug">{item.name}</p>
        <p className="text-[#1B4332] font-bold text-sm mt-0.5">₹{price.toLocaleString('en-IN')}</p>
        <div className="flex items-center gap-3 mt-2">
          <div className="flex items-center gap-1.5 border border-[#E5DDD0] rounded-lg px-2 py-1">
            <button onClick={() => updateQuantity(item._id, item.quantity - 1)} className="text-[#999] hover:text-[#1a1a1a] transition-colors">
              <Minus size={12} />
            </button>
            <span className="text-xs font-semibold text-[#1a1a1a] w-4 text-center">{item.quantity}</span>
            <button onClick={() => updateQuantity(item._id, item.quantity + 1)} className="text-[#999] hover:text-[#1a1a1a] transition-colors">
              <Plus size={12} />
            </button>
          </div>
          <button onClick={() => removeItem(item._id)} className="text-[#ccc] hover:text-red-400 transition-colors">
            <Trash2 size={13} />
          </button>
        </div>
      </div>
      <p className="text-sm font-bold text-[#1a1a1a] flex-shrink-0">
        ₹{(price * item.quantity).toLocaleString('en-IN')}
      </p>
    </div>
  );
}

export default function CartDrawer() {
  const { items, isOpen, closeCart, clearCart } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  const subtotal = items.reduce((acc, i) => acc + (i.discountPrice || i.price) * i.quantity, 0);
  const shipping = subtotal >= 500 ? 0 : 60;
  const tax = Math.round(subtotal * 0.05);
  const total = subtotal + shipping + tax;

  const handleCheckout = () => {
    closeCart();
    navigate(isAuthenticated() ? '/checkout' : '/login?redirect=/checkout');
  };

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/30 z-50 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={closeCart}
      />
      <div className={`fixed right-0 top-0 h-full w-full sm:w-96 bg-white z-50 flex flex-col shadow-2xl transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#F0EBE3]">
          <div className="flex items-center gap-2">
            <ShoppingBag size={18} className="text-[#1B4332]" />
            <h2 className="font-bold text-[#1a1a1a]" style={{ fontFamily: 'Playfair Display, serif' }}>Cart</h2>
            {items.length > 0 && (
              <span className="text-xs bg-[#1B4332] text-white rounded-full px-2 py-0.5 font-medium">{items.length}</span>
            )}
          </div>
          <button onClick={closeCart} className="p-1.5 rounded-lg hover:bg-[#F5F1EA] transition-colors text-[#999]">
            <X size={18} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-5 py-2 no-scrollbar">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-16">
              <ShoppingBag size={48} className="text-[#E5DDD0] mb-4" />
              <h3 className="font-bold text-[#1a1a1a] mb-1" style={{ fontFamily: 'Playfair Display, serif' }}>Your cart is empty</h3>
              <p className="text-[#999] text-sm mb-6">Add some teas to get started</p>
              <button onClick={() => { closeCart(); navigate('/products?category=tea'); }}
                className="btn-primary btn-sm text-xs">Shop Teas</button>
            </div>
          ) : (
            <>
              {items.map(item => <CartItem key={item._id} item={item} />)}
              <button onClick={clearCart} className="flex items-center gap-1 text-[#ccc] hover:text-red-400 text-xs mt-3 transition-colors">
                <Trash2 size={11} /> Clear cart
              </button>
            </>
          )}
        </div>

        {/* Summary */}
        {items.length > 0 && (
          <div className="border-t border-[#F0EBE3] px-5 py-5 bg-[#FAFAF7]">
            <div className="space-y-2 text-sm mb-4">
              <div className="flex justify-between text-[#777]">
                <span>Subtotal</span><span>₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-[#777]">
                <span>Shipping</span>
                <span className={shipping === 0 ? 'text-green-600 font-medium' : ''}>
                  {shipping === 0 ? 'Free' : `₹${shipping}`}
                </span>
              </div>
              <div className="flex justify-between text-[#777]">
                <span>GST (5%)</span><span>₹{tax}</span>
              </div>
              {subtotal < 500 && (
                <p className="text-xs text-[#B5821F] bg-[#FDF6E8] rounded-lg px-3 py-2">
                  Add ₹{500 - subtotal} more for free shipping
                </p>
              )}
            </div>
            <div className="flex justify-between font-bold text-[#1a1a1a] text-base mb-4 pt-3 border-t border-[#E5DDD0]">
              <span>Total</span>
              <span>₹{total.toLocaleString('en-IN')}</span>
            </div>
            <button onClick={handleCheckout} className="btn-primary w-full py-3">
              Checkout <ArrowRight size={16} />
            </button>
            <button onClick={() => { closeCart(); navigate('/products'); }}
              className="w-full text-center text-xs text-[#999] hover:text-[#1a1a1a] transition-colors mt-3">
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </>
  );
}
