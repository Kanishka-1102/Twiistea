import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingBag, Heart, Star, Plus, Minus, Check, Truck, Shield, RefreshCw } from 'lucide-react';
import api from '../lib/api';
import useCartStore from '../store/cartStore';
import useAuthStore from '../store/authStore';
import toast from 'react-hot-toast';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [tab, setTab] = useState('description');
  const [review, setReview] = useState({ rating: 5, comment: '' });
  const [submittingReview, setSubmittingReview] = useState(false);
  const [added, setAdded] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);
  const { addItem } = useCartStore();
  const { user } = useAuthStore();

  useEffect(() => {
    setLoading(true);
    api.get(`/products/${id}`).then(r => setProduct(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = () => {
    if (!product || product.stock === 0) return;
    addItem(product, quantity);
    setAdded(true);
    toast.success(`${product.name} added to cart!`, { icon: '🍵' });
    setTimeout(() => setAdded(false), 2000);
  };

  const handleReview = async (e) => {
    e.preventDefault();
    if (!user) return toast.error('Please login to add a review');
    setSubmittingReview(true);
    try {
      await api.post(`/products/${id}/review`, review);
      toast.success('Review submitted!');
      const r = await api.get(`/products/${id}`);
      setProduct(r.data);
      setReview({ rating: 5, comment: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen max-w-7xl mx-auto px-4 py-8 pt-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-6">
        <div className="skeleton rounded-2xl" style={{ height: 480 }} />
        <div className="space-y-4 pt-4">
          {[...Array(6)].map((_, i) => <div key={i} className="skeleton h-7 rounded-lg" style={{ width: `${50 + i * 8}%` }} />)}
        </div>
      </div>
    </div>
  );

  if (!product) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-[#999]">Product not found.</p>
    </div>
  );

  const price = product.discountPrice || product.price;
  const discount = product.discountPrice ? Math.round((1 - product.discountPrice / product.price) * 100) : 0;

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="bg-[#F5F1EA] py-3 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-sm text-[#999]">
          <Link to="/" className="hover:text-[#1B4332] transition-colors">Home</Link>
          <span>/</span>
          <Link to="/products" className="hover:text-[#1B4332] transition-colors">Products</Link>
          <span>/</span>
          <Link to={`/products?category=${product.category}`} className="hover:text-[#1B4332] transition-colors capitalize">{product.category}</Link>
          <span>/</span>
          <span className="text-[#1a1a1a] font-medium truncate max-w-xs">{product.name}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Images */}
          <div>
            <div className="relative rounded-2xl overflow-hidden bg-[#F5F1EA]" style={{ aspectRatio: '1' }}>
              {product.images?.[selectedImage]?.url ? (
                <img src={product.images[selectedImage].url} alt={product.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-8xl">🍵</div>
              )}
              {discount > 0 && (
                <div className="absolute top-4 left-4">
                  <span className="bg-[#1B4332] text-white text-xs font-bold px-3 py-1.5 rounded-full">{discount}% OFF</span>
                </div>
              )}
            </div>
            {product.images?.length > 1 && (
              <div className="flex gap-3 mt-4 overflow-x-auto no-scrollbar">
                {product.images.map((img, i) => (
                  <button key={i} onClick={() => setSelectedImage(i)}
                    className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${i === selectedImage ? 'border-[#1B4332]' : 'border-[#E5DDD0] hover:border-[#1B4332]/40'}`}>
                    <img src={img.url} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div>
            <span className="inline-flex items-center gap-1.5 bg-[#F0F7F3] text-[#1B4332] text-xs font-semibold px-3 py-1.5 rounded-full mb-4 capitalize">
              {product.category === 'tea' ? '🍃' : '🎁'} {product.category}
            </span>
            <h1 className="text-3xl md:text-4xl font-bold text-[#1a1a1a] mb-3 leading-tight" style={{ fontFamily: 'Playfair Display, serif' }}>
              {product.name}
            </h1>

            {product.ratings?.count > 0 && (
              <div className="flex items-center gap-2 mb-4">
                <div className="flex">
                  {[1,2,3,4,5].map(s => (
                    <Star key={s} size={16} className={s <= Math.round(product.ratings.average) ? 'text-[#B5821F] fill-[#B5821F]' : 'text-[#ddd]'} />
                  ))}
                </div>
                <span className="text-sm text-[#555] font-medium">{product.ratings.average.toFixed(1)}</span>
                <span className="text-sm text-[#999]">({product.ratings.count} reviews)</span>
              </div>
            )}

            <p className="text-[#555] leading-relaxed mb-6 text-base">{product.shortDescription || product.description}</p>

            <div className="flex items-baseline gap-3 mb-2">
              <span className="text-4xl font-bold text-[#1a1a1a]">₹{price.toLocaleString('en-IN')}</span>
              {product.discountPrice && (
                <span className="text-xl text-[#bbb] line-through">₹{product.price.toLocaleString('en-IN')}</span>
              )}
              {discount > 0 && (
                <span className="text-xs bg-green-100 text-green-700 font-semibold px-2 py-0.5 rounded-full">Save {discount}%</span>
              )}
            </div>

            {product.weight && <p className="text-sm text-[#999] mb-5">Weight: <span className="text-[#555] font-medium">{product.weight}</span></p>}

            <div className="flex items-center gap-2 mb-6">
              <div className={`w-2 h-2 rounded-full ${product.stock > 0 ? 'bg-green-500' : 'bg-red-400'}`} />
              <span className={`text-sm font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
                {product.stock === 0 ? 'Out of Stock' : product.stock <= 10 ? `Only ${product.stock} left` : 'In Stock'}
              </span>
            </div>

            {product.stock > 0 && (
              <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center gap-2 border border-[#E5DDD0] rounded-full px-4 py-2.5">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="text-[#999] hover:text-[#1a1a1a] transition-colors"><Minus size={16} /></button>
                  <span className="font-bold text-[#1a1a1a] w-8 text-center">{quantity}</span>
                  <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))} className="text-[#999] hover:text-[#1a1a1a] transition-colors"><Plus size={16} /></button>
                </div>
                <button onClick={handleAddToCart}
                  className={`flex-1 btn-primary py-3 ${added ? '!bg-green-600' : ''}`}>
                  {added ? <><Check size={18} /> Added!</> : <><ShoppingBag size={18} /> Add to Cart</>}
                </button>
                <button onClick={() => setWishlisted(w => !w)}
                  className={`p-3 border border-[#E5DDD0] rounded-full hover:border-red-300 hover:text-red-500 transition-colors ${wishlisted ? 'text-red-500 border-red-300' : 'text-[#bbb]'}`}>
                  <Heart size={20} fill={wishlisted ? 'currentColor' : 'none'} />
                </button>
              </div>
            )}

            <div className="grid grid-cols-3 gap-3 mb-6">
              {[
                { icon: Truck, text: 'Free above ₹500' },
                { icon: Shield, text: '100% authentic' },
                { icon: RefreshCw, text: '7-day returns' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex flex-col items-center text-center gap-1.5 p-3 bg-[#F5F1EA] rounded-xl">
                  <Icon size={16} className="text-[#1B4332]" />
                  <span className="text-xs text-[#777]">{text}</span>
                </div>
              ))}
            </div>

            {product.tags?.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {product.tags.map(tag => (
                  <span key={tag} className="text-xs bg-[#F5F1EA] text-[#777] px-3 py-1 rounded-full">#{tag}</span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-16 border-b border-[#F0EBE3]">
          <div className="flex gap-8">
            {[
              { id: 'description', label: 'Description' },
              { id: 'details', label: 'Details' },
              { id: 'reviews', label: `Reviews (${product.reviews?.length || 0})` },
            ].map(t => (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={`pb-3 text-sm font-medium border-b-2 transition-colors -mb-px ${tab === t.id ? 'border-[#1B4332] text-[#1B4332]' : 'border-transparent text-[#999] hover:text-[#1a1a1a]'}`}>
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-8 max-w-3xl">
          {tab === 'description' && (
            <div>
              <p className="text-[#555] leading-relaxed text-base">{product.description}</p>
              {product.brewingInstructions && (
                <div className="mt-6 bg-[#F5F1EA] rounded-2xl p-6">
                  <h4 className="text-lg font-bold text-[#1a1a1a] mb-3" style={{ fontFamily: 'Playfair Display, serif' }}>Brewing Instructions</h4>
                  <p className="text-[#555]">{product.brewingInstructions}</p>
                </div>
              )}
            </div>
          )}

          {tab === 'details' && (
            <div className="space-y-0">
              {[
                { k: 'Category', v: product.category },
                { k: 'Weight', v: product.weight },
                { k: 'Ingredients', v: product.ingredients?.join(', ') },
              ].filter(i => i.v).map(({ k, v }) => (
                <div key={k} className="flex gap-4 py-3.5 border-b border-[#F0EBE3]">
                  <span className="text-[#999] w-32 flex-shrink-0 text-sm">{k}</span>
                  <span className="text-[#1a1a1a] font-medium text-sm capitalize">{v}</span>
                </div>
              ))}
            </div>
          )}

          {tab === 'reviews' && (
            <div>
              {product.reviews?.length === 0 && (
                <p className="text-[#999] italic mb-6">No reviews yet. Be the first!</p>
              )}
              <div className="space-y-4 mb-8">
                {product.reviews?.map((r, i) => (
                  <div key={i} className="bg-[#FAFAF7] rounded-2xl p-5">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-9 h-9 bg-[#1B4332] rounded-full flex items-center justify-center text-white text-sm font-bold">
                        {r.name?.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-[#1a1a1a]">{r.name}</p>
                        <div className="flex">
                          {[1,2,3,4,5].map(s => <Star key={s} size={11} className={s <= r.rating ? 'text-[#B5821F] fill-[#B5821F]' : 'text-[#ddd]'} />)}
                        </div>
                      </div>
                    </div>
                    <p className="text-[#555] text-sm">{r.comment}</p>
                  </div>
                ))}
              </div>
              {user ? (
                <form onSubmit={handleReview} className="bg-[#FAFAF7] rounded-2xl p-6">
                  <h4 className="font-bold text-[#1a1a1a] mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>Write a Review</h4>
                  <div className="mb-4">
                    <label className="text-sm text-[#555] mb-2 block">Rating</label>
                    <div className="flex gap-1">
                      {[1,2,3,4,5].map(s => (
                        <button key={s} type="button" onClick={() => setReview(r => ({ ...r, rating: s }))}>
                          <Star size={24} className={s <= review.rating ? 'text-[#B5821F] fill-[#B5821F]' : 'text-[#ddd]'} />
                        </button>
                      ))}
                    </div>
                  </div>
                  <textarea value={review.comment} onChange={e => setReview(r => ({ ...r, comment: e.target.value }))}
                    placeholder="Share your experience..." rows={3} className="input-field mb-4" required />
                  <button type="submit" disabled={submittingReview} className="btn-primary">
                    {submittingReview ? 'Submitting...' : 'Submit Review'}
                  </button>
                </form>
              ) : (
                <p className="text-[#999] text-sm"><Link to="/login" className="text-[#1B4332] font-medium hover:underline">Sign in</Link> to write a review.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
